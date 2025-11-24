import Stripe from "stripe";
import { EventsService } from "./eventService";
import { UserService } from "./userService";
import { VendorEventsService } from "./vendorEventsService";
import { sendPaymentReceiptEmail } from "./emailService";
import { EVENT_TYPES } from "../constants/events.constants";
import { Event_Request_Status } from "../constants/user.constants";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);

const DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";

export class WebhookService {
  private eventsService: EventsService;
  private userService: UserService;
  private vendorEventsService: VendorEventsService;

  constructor() {
    this.eventsService = new EventsService();
    this.userService = new UserService();
    this.vendorEventsService = new VendorEventsService();
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
   * Handle vendor participation fee payment completion
   * @param session - Stripe checkout session
   */
  async handleVendorParticipationPayment(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const eventId = session.metadata?.eventId;
    const vendorId = session.metadata?.vendorId;
    const paymentType = session.metadata?.paymentType;

    // Verify this is a vendor participation payment
    if (paymentType !== "vendor_participation") {
      console.warn(`⚠️ Not a vendor participation payment: ${session.id}`);
      return;
    }

    if (!eventId || !vendorId) {
      console.warn(
        "⚠️ Missing eventId or vendorId in vendor payment session:",
        session.id
      );
      return;
    }

    try {
      // Find the vendor
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        console.error(`⚠️ Vendor not found: ${vendorId}`);
        return;
      }

      // Fetch the event
      const event = await this.eventsService.getEventById(eventId);
      if (!event) {
        console.error(`⚠️ Event not found: ${eventId}`);
        return;
      }

      // Find the vendor's request for this event
      const requestIndex = vendor.requestedEvents.findIndex(
        (req) => req.event?.toString() === eventId.toString()
      );

      if (requestIndex === -1) {
        console.error(
          `⚠️ Vendor ${vendorId} has not applied to event ${eventId}`
        );
        return;
      }

      // Update the status to APPROVED in vendor's requestedEvents
      vendor.requestedEvents[requestIndex].status =
        Event_Request_Status.APPROVED;
      vendor.markModified("requestedEvents");
      await vendor.save();

      console.log(
        `✅ Vendor ${vendorId} participation approved for event ${eventId} after payment`
      );

      // Update the event based on type
      if (event.type === EVENT_TYPES.BAZAAR) {
        // Find vendor in event's vendors array
        const vendorIndex = event.vendors?.findIndex(
          (ve) => ve.vendor?.toString() === vendorId.toString()
        );

        if (vendorIndex !== -1 && vendorIndex !== undefined && event.vendors) {
          event.vendors[vendorIndex].RequestData.status =
            Event_Request_Status.APPROVED;
          event.markModified("vendors");
          await event.save();
          console.log(
            `✅ Updated bazaar event ${eventId} vendor status to APPROVED`
          );
        }
      } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
        // For platform booth, update the single vendor's RequestData
        if (
          event.vendor?.toString() === vendorId.toString() &&
          event.RequestData
        ) {
          event.RequestData.status = Event_Request_Status.APPROVED;
          event.markModified("RequestData");
          await event.save();
          console.log(
            `✅ Updated platform booth event ${eventId} vendor status to APPROVED`
          );
        }
      }

      // Send confirmation email to vendor
      if (vendor.email) {
        const customerEmail =
          session.customer_details?.email ||
          session.customer_email ||
          vendor.email;

        await sendPaymentReceiptEmail({
          userEmail: customerEmail,
          username: vendor.companyName,
          transactionId: session.payment_intent as string,
          amount: (session.amount_total ?? 0) / 100,
          currency: (session.currency || DEFAULT_CURRENCY).toUpperCase(),
          itemName: `${event.eventName} - Vendor Participation`,
          itemType: "Vendor Participation Fee",
          paymentDate: new Date(),
          paymentMethod: "Card",
        });

        console.log(
          `✅ Vendor payment receipt sent for session ${session.id} to ${customerEmail}`
        );
      }
    } catch (error) {
      console.error(
        `⚠️ Error processing vendor participation payment for session ${session.id}:`,
        error
      );
    }
  }

  /**
   * Process Stripe webhook event
   * @param event - Stripe event
   */
  async processEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentType = session.metadata?.paymentType;

        // Route to appropriate handler based on payment type
        if (paymentType === "vendor_participation") {
          await this.handleVendorParticipationPayment(session);
        } else {
          await this.handleCheckoutSessionCompleted(session);
        }
        break;
      // Add more event types here as needed
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  }
}
