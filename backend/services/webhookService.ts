import Stripe from "stripe";
import { EventsService } from "./eventService";
import { UserService } from "./userService";
import { sendPaymentReceiptEmail } from "./emailService";
import { EVENT_TYPES } from "../constants/events.constants";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);

const DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";

export class WebhookService {
  private eventsService: EventsService;
  private userService: UserService;

  constructor() {
    this.eventsService = new EventsService();
    this.userService = new UserService();
  }

  /**
   * Verify Stripe webhook signature
   * @param body - Raw request body
   * @param signature - Stripe signature header
   * @param secret - Webhook secret
   * @returns Verified Stripe event
   */
  verifyWebhookSignature(
    body: any,
    signature: string,
    secret: string
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(body, signature, secret);
  }

  /**
   * Handle checkout.session.completed event
   * @param session - Stripe checkout session
   */
  async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const eventId = session.metadata?.eventId;
    const userId = session.metadata?.userId;
    const customerEmail =
      session.customer_details?.email || session.customer_email;

    if (!eventId || !userId || !customerEmail) {
      console.warn("⚠️ Missing required metadata in session:", session.id);
      return;
    }

    // Fetch event and user details
    const [eventDoc, user] = await Promise.all([
      this.eventsService.getEventById(eventId),
      this.userService.getUserById(userId),
    ]);

    if (!eventDoc || !user) {
      console.warn(`⚠️ Event or user not found for session ${session.id}:`, {
        eventId,
        userId,
      });
      return;
    }

    // Extract user name
    const username =
      (user as any).firstName && (user as any).lastName
        ? `${(user as any).firstName} ${(user as any).lastName}`
        : (user as any).email || "User";

    // Register user for the event
    await this.eventsService.registerUserForEvent(eventId, userId);
    console.log(
      `✅ User ${userId} registered for event ${eventId} after payment`
    );

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
  }

  /**
   * Process Stripe webhook event
   * @param event - Stripe event
   */
  async processEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      // Add more event types here as needed
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  }
}
