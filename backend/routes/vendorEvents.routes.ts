import { Router, Request, Response } from "express";
import { VendorEventsService } from "../services/vendorEventsService";
import createError from "http-errors";
import { validateCreateApplicationData } from "../validation/validateCreateApplicationData.validation";
import {
  GetVendorEventsResponse,
  ApplyToBazaarOrBoothResponse,
  GetVendorsRequestResponse,
  GetVendorRequestDetailsResponse,
  RespondToVendorRequestResponse,
  getAvailableBoothsResponse,
} from "../interfaces/responses/vendorEventsResponses.interface";
import { UserRole } from "../constants/user.constants";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { AdministrationRoleType } from "../constants/administration.constants";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";
import { deleteCloudinaryFile } from "../utils/cloudinaryCleanup";
import { uploadFiles } from "../middleware/upload";
import { FileUploadResponse } from "../interfaces/responses/fileUploadResponse.interface";
import { loyaltyProgramSchema } from "../validation/validateLoyaltyProgram";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { GetEventsResponse } from "../interfaces/responses/eventResponses.interface";
import { StaffPosition } from "../constants/staffMember.constants";
import { asyncRouter } from "../config/errorHandler";
import { User } from "../schemas/stakeholder-schemas/userSchema";

const vendorEventsService = new VendorEventsService();

async function getVendorUpcomingEvents(
  req: AuthenticatedRequest,
  res: Response<GetVendorEventsResponse>
) {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) {
      throw createError(401, "Unauthorized: Vendor ID missing in token");
    }

    const events = await vendorEventsService.getVendorUpcomingEvents(vendorId);
    if (!events || events.length === 0) {
      throw createError(404, "No events found for this vendor");
    }
    res.json({
      success: true,
      data: events,
      message: "Vendor events retrieved successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error retrieving vendor events"
    );
  }
}

async function applyToBooth(
  req: AuthenticatedRequest,
  res: Response<ApplyToBazaarOrBoothResponse>
) {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) {
      throw createError(401, "Unauthorized: Vendor ID missing in token");
    }
    const validatedData = validateCreateApplicationData(req.body);

    // Handle validation errors
    if (validatedData.error) {
      throw createError(400, validatedData.error.message);
    }

    // Ensure this is a platform booth application
    if (validatedData.value.eventType !== "platform_booth") {
      throw createError(
        400,
        "Invalid event type. Expected platform booth application"
      );
    }

    const applicationResult = await vendorEventsService.applyToPlatformBooth(
      vendorId,
      validatedData
    );

    if (!applicationResult) {
      throw createError(400, "Platform booth application failed");
    }

    res.status(200).json({
      success: true,
      data: applicationResult,
      message: "Platform booth application successful",
    });
  } catch (error: any) {
    if (req.body.boothAttendees && Array.isArray(req.body.boothAttendees)) {
      for (const attendee of req.body.boothAttendees) {
        if (attendee.nationalId?.publicId) {
          console.log(
            "Deleting national ID with publicId:",
            attendee.nationalId.publicId
          );
          await deleteCloudinaryFile(attendee.nationalId.publicId);
        }
      }
    }

    throw createError(
      error.status || 500,
      error.message || "Error applying to booth"
    );
  }
}

async function applyToBazaar(
  req: AuthenticatedRequest,
  res: Response<ApplyToBazaarOrBoothResponse>
) {
  try {
    const { eventId } = req.params;
    const vendorId = req.user?.id;
    if (!vendorId) {
      throw createError(401, "Unauthorized: Vendor ID missing in token");
    }
    const validatedData = validateCreateApplicationData(req.body);

    // Handle validation errors
    if (validatedData.error) {
      throw createError(400, validatedData.error.message);
    }

    // Ensure this is a bazaar application
    if (validatedData.value.eventType !== "bazaar") {
      throw createError(400, "Invalid event type. Expected bazaar application");
    }

    const applicationResult = await vendorEventsService.applyToBazaar(
      vendorId,
      eventId,
      validatedData
    );

    if (!applicationResult) {
      throw createError(400, "Bazaar application failed");
    }

    res.status(200).json({
      success: true,
      data: applicationResult,
      message: "Bazaar application successful",
    });
  } catch (error: any) {
    if (req.body.boothAttendees && Array.isArray(req.body.boothAttendees)) {
      for (const attendee of req.body.boothAttendees) {
        if (attendee.nationalId?.publicId) {
          await deleteCloudinaryFile(attendee.nationalId.publicId);
        }
      }
    }
    throw createError(
      error.status || 500,
      error.message || "Error applying to bazaar"
    );
  }
}

async function getVendorsRequests(
  req: Request,
  res: Response<GetVendorsRequestResponse>
) {
  try {
    const requests = await vendorEventsService.getVendorsRequest();

    res.json({
      success: true,
      data: requests,
      message: "Vendor requests retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving vendor requests"
    );
  }
}

async function getVendorRequestsDetails(
  req: Request,
  res: Response<GetVendorRequestDetailsResponse>
) {
  try {
    const eventId = req.params.eventId;
    const vendorId = req.params.vendorId;
    const request = await vendorEventsService.getVendorsRequestsDetails(
      eventId,
      vendorId
    );

    res.json({
      success: true,
      data: request,
      message: "Vendor request retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving vendor requests"
    );
  }
}

async function updateVendorRequest(
  req: Request,
  res: Response<RespondToVendorRequestResponse>
) {
  try {
    const eventId = req.params.eventId;
    const vendorId = req.params.vendorId;
    const { status } = req.body;

    if (!eventId || !vendorId || !status) {
      throw createError(400, "Missing required fields");
    }

    await vendorEventsService.respondToVendorRequest(
      eventId,
      vendorId,
      req.body
    );

    res.json({
      success: true,
      message: "Vendor request updated successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error updating vendor request"
    );
  }
}

async function getAvailableBooths(
  req: Request,
  res: Response<getAvailableBoothsResponse>
) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw createError(
        400,
        "Missing required query parameters: startDate and endDate"
      );
    }

    const booths = await vendorEventsService.getAvailableBooths(
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: booths,
      message: "Available booths retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving available booths"
    );
  }
}
async function uploadNationalId(
  req: Request,
  res: Response<FileUploadResponse>
) {
  const nationalId: Express.Multer.File | undefined = req.file;
  try {
    if (!nationalId) {
      throw createError(400, "National ID is required for vendor signup");
    }
    res.status(200).json({
      success: true,
      data: {
        url: nationalId.path,
        publicId: nationalId.filename,
        originalName: nationalId.originalname,
        uploadedAt: new Date(),
      },
      message: "National ID uploaded successfully",
    });
  } catch (error: any) {
    if (nationalId && nationalId.filename) {
      await deleteCloudinaryFile(nationalId.filename);
    }
    throw createError(
      error.status || 500,
      error.message || "National ID upload failed"
    );
  }
}

async function cancelEventParticipation(
  req: AuthenticatedRequest,
  res: Response<{ success: boolean; message: string }>
) {
  try {
    const { eventId } = req.params;
    const vendorId = req.user?.id;

    if (!vendorId) {
      throw createError(401, "Unauthorized: Vendor ID missing in token");
    }

    if (!eventId) {
      throw createError(400, "Event ID is required");
    }

    await vendorEventsService.cancelEventParticipation(vendorId, eventId);

    res.status(200).json({
      success: true,
      message: "Event participation cancelled successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error cancelling event participation"
    );
  }
}

async function getEventsForQRCodeGeneration(req: Request, res: Response<GetEventsResponse>) {
  try {
    const events = await vendorEventsService.getEventsForQRCodeGeneration();
    res.json({
      success: true,
      data: events,
      message: "Events for QR code generation retrieved successfully",
    });
  } catch (err: any) {
    throw createError(
      err.status || 500,
      err.message || "Error retrieving events for QR code generation"
    );
  }
}

async function generateVendorEventQRCodes(
  req: Request,
  res: Response<{ success: boolean; message: string }>
) {
  const { eventId } = req.params
  try {
    if (!eventId) {
      throw createError(400, "Event ID and Vendor ID are required");
    }
    await vendorEventsService.generateVendorEventQRCodes(eventId);
    res.status(200).json({
      success: true,
      message: "QR codes generated successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error generating QR codes"
    );
  }
}

async function getAllLoyaltyPartners(req: Request, res: Response) {
  try {
    const partners = await vendorEventsService.getAllLoyaltyPartners();

    res.json({
      success: true,
      message: "Loyalty partners retrieved successfully",
      data: partners,
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error retrieving loyalty partners"
    );
  }
}

async function applyToLoyaltyProgram(req: AuthenticatedRequest, res: Response) {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) {
      throw createError(401, "Unauthorized: Vendor ID missing in token");
    }

    const { error, value } = loyaltyProgramSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }

    const updatedVendor = await vendorEventsService.applyToLoyaltyProgram(
      vendorId,
      value
    );

    res.status(201).json({
      success: true,
      message: "Successfully applied to loyalty program",
      data: {
        loyaltyProgram: updatedVendor.loyaltyProgram,
      },
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error applying to loyalty program"
    );
  }
}

async function cancelLoyaltyProgram(req: AuthenticatedRequest, res: Response) {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) {
      throw createError(401, "Unauthorized: Vendor ID missing in token");
    }

    await vendorEventsService.cancelLoyaltyProgram(vendorId);

    res.json({
      success: true,
      message: "Successfully cancelled loyalty program participation",
      data: null,
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error cancelling loyalty program"
    );
  }
}

// get all vendors requesting to set up booths in the same location during the same durations
async function getVendorsWithOverlappingBooths(req: Request, res: Response) {
  try {
    const requests = await vendorEventsService.getVendorsWithOverlappingBooths();
    res.json({
      success: true,
      data: requests,
      message: "Vendors with overlapping booth requests retrieved successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error retrieving vendors with overlapping booth requests"
    );
  }
}

async function getAllPolls(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const polls = await vendorEventsService.getAllPolls(userId);
    res.json({
      success: true,
      data: polls,
      message: "Polls retrieved successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error retrieving polls"
    );
  }
}

async function createPoll(req: Request, res: Response) {
  try {
    const pollData = req.body;
    const newPoll = await vendorEventsService.createPoll(pollData);
    res.status(201).json({
      success: true,
      data: newPoll,
      message: "Poll created successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error creating poll"
    );
  }
}

async function voteInPoll(req: AuthenticatedRequest, res: Response) {
  try {
    const { pollId, vendorId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw createError(401, "User not authenticated");
    }
    
    const updatedPoll = await vendorEventsService.voteInPoll(pollId, vendorId, userId);
    res.json({
      success: true,
      data: updatedPoll,
      message: "Vote recorded successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error voting in poll"
    );
  }
}

async function getBoothsHavingPolls(req: AuthenticatedRequest, res: Response) {
  try {
    const boothIds = await vendorEventsService.getBoothsHavingPolls();
    res.json({
      success: true,
      data: boothIds,
      message: "Booths with active polls retrieved successfully",
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || "Error retrieving booths with active polls"
    );
  }
}

const router = asyncRouter();

router.get(
  "/",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  getVendorUpcomingEvents
);

router.get(
  "/overlapping-booth-requests",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE
    ],
  }),
  getVendorsWithOverlappingBooths
);

// Get all polls
router.get(
  "/polls",
  authorizeRoles({ 
    userRoles: [
      UserRole.ADMINISTRATION, UserRole.STUDENT, UserRole.STAFF_MEMBER
    ], 
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE
    ], 
    staffPositions: [
      StaffPosition.PROFESSOR, 
      StaffPosition.TA, 
      StaffPosition.STAFF
    ] 
  }),
  getAllPolls
);

router.post(
  "/polls",
  authorizeRoles({ 
    userRoles: [
      UserRole.ADMINISTRATION
    ], 
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE
    ]
  }),
  createPoll
);

router.post(
  "/polls/:pollId/vote/:vendorId",
  authorizeRoles({ 
    userRoles: [
      UserRole.STUDENT, 
      UserRole.STAFF_MEMBER
    ], 
    staffPositions: [
      StaffPosition.PROFESSOR, 
      StaffPosition.TA, 
      StaffPosition.STAFF] 
    }),
  voteInPoll
);

router.get(
  "/booths-with-active-polls",
  authorizeRoles({ 
    userRoles: [
      UserRole.ADMINISTRATION
    ], 
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE
    ]
  }),
  getBoothsHavingPolls
);

router.get(
  "/loyalty-partners",
  authorizeRoles({
    userRoles: [
      UserRole.STUDENT,
      UserRole.STAFF_MEMBER,
      UserRole.ADMINISTRATION,
    ],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
  }),
  getAllLoyaltyPartners
);

router.get(
  "/vendor-requests",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
  }),
  getVendorsRequests
);

router.post(
  "/booth",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  applyToBooth
);

router.get(
  "/QRcodes",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE]
  }),
  getEventsForQRCodeGeneration
);

router.post(
  "/:eventId/generateQRCodes",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [AdministrationRoleType.EVENTS_OFFICE]
  }),
  generateVendorEventQRCodes
);

router.post(
  "/:eventId/bazaar",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  applyToBazaar
);

router.post(
  "/uploadNationalId",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  uploadFiles.single("nationalId"),
  uploadNationalId
);

router.delete(
  "/:eventId/cancel",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  cancelEventParticipation
);

router.delete(
  "/loyalty-program",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  cancelLoyaltyProgram
);

// Two parameters with complex paths
router.get(
  "/:eventId/vendor-requests/:vendorId",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
  }),
  getVendorRequestsDetails
);

router.patch(
  "/:eventId/vendor-requests/:vendorId",
  authorizeRoles({
    userRoles: [UserRole.ADMINISTRATION],
    adminRoles: [
      AdministrationRoleType.EVENTS_OFFICE,
      AdministrationRoleType.ADMIN,
    ],
  }),
  updateVendorRequest
);

router.post(
  "/loyalty-program",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  applyToLoyaltyProgram
);

export default router;
