import { Router, Request, Response } from "express";
import { WebhookService } from "../services/webhookService";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const webhookService = new WebhookService();
const router = Router();

/**
 * Stripe webhook handler for payment events
 * This endpoint receives raw body for signature verification
 */
router.post("/stripe", async (req: Request, res: Response) => {
  if (!webhookSecret) {
    console.error("⚠️ STRIPE_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("⚠️ Missing stripe-signature header");
    return res.status(400).json({ error: "Missing signature" });
  }

  try {
    // Verify and construct event
    const event = webhookService.verifyWebhookSignature(
      req.body,
      sig as string,
      webhookSecret
    );

    // Process the event
    await webhookService.processEvent(event);
  } catch (err: any) {
    console.error("⚠️ Webhook processing failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  res.json({ received: true });
});

export default router;
