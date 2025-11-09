import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { EventsService } from "../services/eventService";
import { UserService } from "../services/userService";
import { sendPaymentReceiptEmail } from "../services/emailService";
import { EVENT_TYPES } from "../constants/events.constants";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";

const eventsService = new EventsService();
const userService = new UserService();
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

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      webhookSecret
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const eventId = session.metadata?.eventId;
      const userId = session.metadata?.userId;
      const customerEmail =
        session.customer_details?.email || session.customer_email;

      if (!eventId || !userId || !customerEmail) {
        console.warn("⚠️ Missing required metadata in session:", session.id);
        return res.json({ received: true, skipped: "missing metadata" });
      }

      // Fetch event and user details
      const [eventDoc, user] = await Promise.all([
        eventsService.getEventById(eventId),
        userService.getUserById(userId),
      ]);

      if (!eventDoc || !user) {
        console.warn(`⚠️ Event or user not found for session ${session.id}:`, {
          eventId,
          userId,
        });
        return res.json({ received: true, skipped: "event or user not found" });
      }

      const username =
        (user as any).firstName && (user as any).lastName
          ? `${(user as any).firstName} ${(user as any).lastName}`
          : (user as any).email || "User";

      // Send payment receipt email
      await sendPaymentReceiptEmail({
        userEmail: customerEmail,
        username,
        transactionId: session.payment_intent as string,
        amount: (session.amount_total ?? 0) / 100,
        currency: (session.currency || DEFAULT_CURRENCY).toUpperCase(),
        itemName: eventDoc.eventName,
        itemType: eventDoc.type === EVENT_TYPES.TRIP ? "Trip" : "Workshop",
        paymentDate: new Date(),
        paymentMethod: "Card",
      });

      console.log(
        `✅ Payment receipt sent for session ${session.id} to ${customerEmail}`
      );
    } catch (err: any) {
      console.error(
        `❌ Failed to send payment receipt for session ${session.id}:`,
        err.message
      );
      // Return 200 to prevent Stripe from retrying non-recoverable errors
    }
  }

  res.json({ received: true });
});

export default router;
