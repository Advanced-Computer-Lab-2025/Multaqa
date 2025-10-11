import { Router, Request, Response, NextFunction } from "express";
import { VendorService } from "../services/vendorService";
import createError from "http-errors";
import { validateCreateApplicationData } from "../validation/validateCreateApplicationData.validation";
import { GetVendorEventsResponse, ApplyToBazaarOrBoothResponse} from "../interfaces/responses/vendorResponses.interface";

const vendorService = new VendorService();

async function getVendorEvents(req: Request, res: Response<GetVendorEventsResponse>) {
  try {
    const events = await vendorService.getVendorEvents(req.params.id);
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
  const { id, eventId } = req.params;
  const validatedData = validateCreateApplicationData(req.body);
  const applicationResult = await vendorService.applyToBazaarOrBooth(
    id,
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

const router = Router();
router.get("/:vendorId/events", getVendorEvents);
router.post("/:vendorId/events/:eventId/applications", applyToBazaarOrBooth);

export default router;
