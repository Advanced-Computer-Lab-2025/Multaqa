import { Router, Request, Response, NextFunction } from "express";
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
    // forward error to express error handler so its status/message are preserved
    throw createError(500, (error as Error).message);
  }
}

async function applyToBazaarOrBooth(req: Request, res: Response) {
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
    .json({ message: "Application successful", applicationResult });
}

const router = Router();
router.get("/:id/events", getVendorEvents);
router.post("/:id/events/:eventId", applyToBazaarOrBooth);

export default router;
