import { Router, Request, Response } from "express";
import { IVendor } from "../interfaces/vendor.interface";
import { VendorService } from "../services/vendorService";
import createError from "http-errors";
import { validateCreateApplicationData } from "../validation/validateCreateApplicationData.validation";

const vendorService = new VendorService();

async function getVendorEvents(req: Request, res: Response) {
  try {
    const events = await vendorService.getVendorEvents(req.params.id);
    if (!events || events.length === 0) {
      throw createError(404, "No events found for this vendor");
    }
    res.json(events);
  } catch (error) {
    throw createError(500, "Failed to retrieve vendor events");
  }
}

async function applyToBazaarOrBooth(req: Request, res: Response) {
  try {
    const vendorId = req.params.id;
    const { eventId, applicationData, eventType } = req.body;
    const validatedData = validateCreateApplicationData(applicationData);
    const applicationResult = await vendorService.applyToBazaarOrBooth(
      vendorId,
      eventId,
      validatedData,
      eventType
    );

    if (!applicationResult) {
      throw createError(400, "Application failed");
    }

    res
      .status(200)
      .json({ message: "Application successful", applicationResult });
  } catch (error) {
    throw createError(500, "Failed to apply to bazaar or booth");
  }
}

const router = Router();
router.get("/vendors/:id/events", getVendorEvents);
router.post("/vendors/:id/apply", applyToBazaarOrBooth);

export default router;
