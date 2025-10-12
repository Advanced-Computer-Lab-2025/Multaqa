import { Router, Request, Response } from "express";
import { VendorEventsService } from "../services/vendorEventsService";
import createError from "http-errors";
import { validateCreateApplicationData } from "../validation/validateCreateApplicationData.validation";
import { GetVendorEventsResponse, ApplyToBazaarOrBoothResponse, GetVendorsRequestResponse, GetVendorRequestDetailsResponse, RespondToVendorRequestResponse} from "../interfaces/responses/vendorEventsResponses.interface";

const vendorEventsService = new VendorEventsService();

async function getVendorUpcomingEvents(req: Request, res: Response<GetVendorEventsResponse>) {
  try {
    const vendorId = (req as any).user.id;
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

async function applyToBazaarOrBooth(req: Request, res: Response<ApplyToBazaarOrBoothResponse>) {
  const vendorId = (req as any).user.id;
  const { eventId } = req.params;
  const validatedData = validateCreateApplicationData(req.body);
  const applicationResult = await vendorEventsService.applyToBazaarOrBooth(
    vendorId,
    eventId,
    validatedData
  );

  if (!applicationResult) {
    throw createError(400, "Application failed");
  }

  res
    .status(200)
    .json({ 
      success: true,
      data: applicationResult,
      message: "Application successful"
    });
}

async function getVendorsRequests(req: Request, res: Response<GetVendorsRequestResponse>) {
  try {
    const eventId = req.params.id;
    const requests = await vendorEventsService.getVendorsRequest(eventId);

    res.json({
      success: true,
      data: requests,
      message: "Vendor requests retrieved successfully"
    });
  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
  }
}

async function getVendorRequestsDetails(req: Request, res: Response<GetVendorRequestDetailsResponse>) {
  try {
    const eventId = req.params.id;
    const vendorId = req.params.vendorid;
    const request = await vendorEventsService.getVendorsRequestsDetails(eventId, vendorId);

    res.json({
      success: true,
      data: request,
      message: "Vendor request retrieved successfully"
    });
  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw err;
    }
    throw createError(500, err.message);
  }
}

async function updateVendorRequest(req: Request, res: Response<RespondToVendorRequestResponse>) {
  try {
    const eventId = req.params.eventid;
    const vendorId = req.params.vendorid;
    const { status } = req.body;

    if (!eventId || !vendorId || !status) {
      throw createError(400, "Missing required fields")
    }

    await vendorEventsService.respondToVendorRequest(eventId, vendorId, req.body);

    res.json({
      success: true,
      message: "Vendor request updated successfully"
    });

  } catch (err: any) {
    if (err.status || err.statusCode) {
      throw createError(err.status, err.message);
    }
    throw createError(500, err.message);
  }
}

const router = Router();
router.get("/", getVendorUpcomingEvents);
router.post("/:eventId/applications", applyToBazaarOrBooth);
router.get("/:eventId/vendor-requests", getVendorsRequests);
router.get("/:eventId/vendor-requests/:vendorId", getVendorRequestsDetails);
router.patch("/:eventId/vendor-requests/:vendorId", updateVendorRequest);

export default router;
