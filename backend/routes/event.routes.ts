import { Router, Request, Response } from "express";
import { EventsService } from "../services/eventService";
import createError from "http-errors";
import { validateConference } from "../validation/validateConference";
import { validateCreateEvent } from "../validation/validateCreateEvent";
import { validateUpdateConference } from "../validation/validateUpdateConference";
import { validateUpdateEvent } from "../validation/validateUpdateEvent";
import {
  GetEventsResponse,
  GetEventByIdResponse,
  CreateEventResponse,
  UpdateEventResponse,
  DeleteEventResponse,
  DeleteReviewResponse,
} from "../interfaces/responses/eventResponses.interface";
import { UserRole } from "../constants/user.constants";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserService } from "../services/userService";
import { applyRoleBasedFilters } from "../middleware/applyRoleBasedFilters.middleware"
import { CreateReviewResponse, GetAllReviewsByEventResponse, UpdateReviewResponse } from "../interfaces/responses/reviewResponses.interface";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";
import { userInfo } from "os";

const eventsService = new EventsService();

async function findAll(req: Request, res: Response<GetEventsResponse>) {
  try {
    const { search, type, location, sort, startDate, endDate } = req.query;
    const events = await eventsService.getEvents(
      search as string,
      type as string,
      location as string,
      sort === "true",
      startDate as string,
      endDate as string 
    );
    if (!events || events.length === 0) {
      throw createError(404, "No events found");
    }
    res.json({
      success: true,
      data: events,
      message: "Events retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving events"
    );
  }
}

async function findAllWorkshops(
  req: Request,
  res: Response<GetEventsResponse>
) {
  try {
    const events = await eventsService.getAllWorkshops();
    if (!events || events.length === 0) {
      throw createError(404, "No workshops found");
    }
    res.json({
      success: true,
      data: events,
      message: "Workshops retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving workshops"
    );
  }
}

async function findOne(req: Request, res: Response<GetEventByIdResponse>) {
  try {
    const id = req.params.id;
    const event = await eventsService.getEventById(id);
    if (!event) {
      throw createError(404, "Event not found");
    }
    res.json({
      success: true,
      data: event,
      message: "Event retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving event"
    );
  }
}

// Bazaar, Trip, Conference
async function createEvent(req: Request, res: Response<CreateEventResponse>) {
  try {
    const user = (req as any).user;
    const { type } = req.body;
    let validationResult;

    switch (type) {
      case "conference":
        validationResult = validateConference(req.body);
        break;
      case "bazaar":
      case "trip":
        validationResult = validateCreateEvent(req.body);
        break;
      default:
        throw createError(400, "Invalid or unsupported event type");
    }

    // Handle Joi validation errors
    if (validationResult.error) {
      const message = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const event = await eventsService.createEvent(user, req.body);
    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully",
    });
  } catch (err: any) {
    throw createError(err.status || 500, err.message || "Error creating event");
  }
}

async function updateEvent(req: Request, res: Response<UpdateEventResponse>) {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    let validationResult;

    //have to specifcy type in postman since it needs it to validate
    switch (req.body.type) {
      case "conference":
        // Validate conference-specific fields
        validationResult = validateUpdateConference(req.body);
        break;
      case "bazaar":
      case "trip":
        validationResult = validateUpdateEvent(req.body);
        break;

      default:
        throw createError(400, "Invalid or unsupported event type");
    }

    if (validationResult.error) {
      const message = validationResult.error.details
        .map((d) => d.message)
        .join(", ");
      throw createError(400, message);
    }

    const updatedEvent = await eventsService.updateEvent(eventId, updateData);

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating Event:", err);
    throw createError(err.status || 500, err.message || "Error updating event");
  }
}

async function deleteEvent(req: Request, res: Response<DeleteEventResponse>) {
  try {
    const id = req.params.id;
    const deletedEvent = await eventsService.deleteEvent(id);
    res.json({
      success: true,
      data: deletedEvent,
      message: "Event deleted successfully",
    });
  } catch (err: any) {
    throw createError(err.status || 500, err.message || "Error deleting event");
  }
}

async function createReview(req: AuthenticatedRequest, res: Response<CreateReviewResponse>) {
  try {
    const eventId = req.params.eventId;
    const { comment, rating } = req.body;
    if (!eventId || !req.user?.id) {
      throw createError(400, "eventId and userId are required");
    }

    if (!comment && !rating) {
      throw createError(400, "At least one of comment or rating must be provided");
    }

    const newReview = await eventsService.createReview(eventId, req.user.id, comment, rating);
    res.status(201).json({
      success: true,
      data: newReview,
      message: "Review created successfully"
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || 'Error creating review'
    );
  }
}

async function updateReview(req: AuthenticatedRequest, res: Response<UpdateReviewResponse>) {
  try {
    const eventId = req.params.eventId;
    const { comment, rating } = req.body;
    if (!eventId || !req.user?.id) {
      throw createError(400, "eventId and userId are required");
    }

    if (!comment && !rating) {
      throw createError(400, "At least one of comment or rating must be provided");
    }

    const updatedReview = await eventsService.updateReview(eventId, req.user.id, comment, rating);
    res.status(200).json({
      success: true,
      data: updatedReview,
      message: "Review updated successfully"
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || 'Error updating review'
    );
  }
}

async function deleteComment(req: AuthenticatedRequest, res: Response<DeleteReviewResponse>) {
  try {
    const eventId = req.params.eventId;
    const userId = req.params.userId;
    if (!eventId || !userId) {
      throw createError(400, "eventId and userId are required");
    }

    await eventsService.deleteComment(eventId, userId);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error deleting comment"
    );
  }
}

async function getAllReviewsByEvent(req: Request, res: Response<GetAllReviewsByEventResponse>) {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      throw createError(400, "eventId is required");
    }

    const reviews = await eventsService.getAllReviewsByEvent(eventId);
    
    res.status(200).json({
      success: true,
      data: reviews,
      message: "Reviews retrieved successfully"
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving reviews"
    );
  }
}

async function exportEventUsers(req: Request, res: Response) {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      throw createError(400, "eventId is required");
    }
    const xlxsData = await eventsService.exportEventUsersToXLXS(eventId);
    
 res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="event-${eventId}-attendees.xlsx"`
      );
      // Send the Excel file as the response (Response must only contain the file data)
       res.send(xlxsData);

  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error exporting event users"
    );
  }
}

const router = Router();

router.get(
  "/",
  applyRoleBasedFilters,
  authorizeRoles({
    userRoles: [
      UserRole.ADMINISTRATION,
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
      UserRole.VENDOR,
    ],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.STAFF,
      StaffPosition.TA,
    ],
  }),
  findAll
);

router.post(
  "/",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  createEvent
);

router.get(
  "/workshops",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION, UserRole.STAFF_MEMBER],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
    staffPositions: [StaffPosition.PROFESSOR],
  }),
  findAllWorkshops
);

router.delete(
  "/:eventId/reviews/:userId",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.ADMIN],
  }),
  deleteComment
);

router.post(
  "/:eventId/reviews",
  authorizeRoles({ 
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [StaffPosition.PROFESSOR, StaffPosition.STAFF, StaffPosition.TA] 
  }), 
  createReview
);

router.get(
  "/:eventId/reviews",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION,UserRole.STUDENT, UserRole.STAFF_MEMBER],
    adminRoles: [AdministrationRoleType.ADMIN, AdministrationRoleType.EVENTS_OFFICE],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.STAFF,
      StaffPosition.TA,
    ],
  }),
  getAllReviewsByEvent
);

router.patch(
  "/:eventId/reviews", 
  authorizeRoles({ 
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER], 
    staffPositions: [StaffPosition.PROFESSOR, StaffPosition.STAFF, StaffPosition.TA] 
  }), 
  updateReview
);

router.get(
  "/:id",
  authorizeRoles({
    userRoles: [
      UserRole.ADMINISTRATION,
      UserRole.STAFF_MEMBER,
      UserRole.STUDENT,
    ],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.STAFF,
      StaffPosition.TA,
    ],
  }),
  findOne
);

router.delete(
  "/:id",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  deleteEvent
);

router.patch(
  "/:id",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE],
  }),
  updateEvent
);

router.get(
  "/export/event/:eventId/attendees",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE]
  }),
  exportEventUsers
);

export default router;
