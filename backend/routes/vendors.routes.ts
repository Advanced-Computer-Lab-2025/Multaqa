import { Router, Request, Response } from "express";
import { IVendor } from "../interfaces/vendor.interface";
import { VendorService } from "../services/vendorService";
import createError from "http-errors";

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

const router = Router();
router.get("/vendors/:id/events", getVendorEvents);

export default router;
