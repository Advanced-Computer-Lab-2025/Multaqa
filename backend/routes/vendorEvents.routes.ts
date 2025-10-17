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
} from "../interfaces/responses/vendorEventsResponses.interface";
import { UserRole } from "../constants/user.constants";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { AdministrationRoleType } from "../constants/administration.constants";

const vendorEventsService = new VendorEventsService();

async function getVendorUpcomingEvents(
  req: Request,
  res: Response<GetVendorEventsResponse>
) {
  try {
    const vendorId = req.params.vendorId;
    // const vendorId = (req as any).user.id;

    const events = await vendorEventsService.getVendorUpcomingEvents(vendorId);
    if (!events || events.length === 0) {
      throw createError(404, "No events found for this vendor");
    }
    res.json({
      success: true,
      data: events,
      message: "Vendor events retrieved successfully",
    });
  } catch (error) {
    throw createError(500, (error as Error).message);
  }
}

async function applyToBooth(
  req: Request,
  res: Response<ApplyToBazaarOrBoothResponse>
) {
  const { vendorId, eventId } = req.params;
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
}

async function applyToBazaar(
  req: Request,
  res: Response<ApplyToBazaarOrBoothResponse>
) {
  const { vendorId, eventId } = req.params;
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
}

async function getVendorsRequests(
  req: Request,
  res: Response<GetVendorsRequestResponse>
) {
  try {
    const eventId = req.params.eventId;
    const requests = await vendorEventsService.getVendorsRequest(eventId);

    res.json({
      success: true,
      data: requests,
      message: "Vendor requests retrieved successfully",
    });
  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
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
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
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
    if (err.status || err.statusCode) {
      throw createError(err.status, err.message);
    }
    throw createError(500, err.message);
  }
}

const router = Router();

// Single parameter routes
router.get(
  "/:vendorId",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  getVendorUpcomingEvents
);

router.post(
  "/:vendorId/booth",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  applyToBooth
);

// Two parameter routes
router.get(
  "/:eventId/vendor-requests",
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
  "/:vendorId/:eventId/bazaar",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  applyToBazaar
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

export default router;
