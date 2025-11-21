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
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { GetEventsResponse } from "../interfaces/responses/eventResponses.interface";

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
    if (!eventId ) {
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

const router = Router();

router.get(
  "/",
  authorizeRoles({ userRoles: [UserRole.VENDOR] }),
  getVendorUpcomingEvents
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
