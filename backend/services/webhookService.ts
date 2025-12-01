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

    // Verify payment was actually successful
    if (session.payment_status !== "paid") {
      console.warn(
        `⚠️ Session ${session.id} completed but payment_status is ${session.payment_status}, not 'paid'. Skipping.`
      );
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

    // Deduct wallet balance and log transaction (moved from payment service to ensure
    // they only happen after successful Stripe payment confirmation)
    const walletAmount = parseFloat(session.metadata?.walletBalanceApplied || "0");
    const cardAmount = (session.amount_total ?? 0) / 100;
    const totalAmount = walletAmount + cardAmount;

    // Deduct wallet if it was used for hybrid payment
    if (walletAmount > 0) {
      await this.userService.deductFromWallet(userId, walletAmount);
      console.log(
        `✅ Deducted ${walletAmount} from user ${userId}'s wallet after successful payment`
      );
    }

    // Log the complete transaction
    await this.userService.addTransaction(userId, {
      eventName: eventDoc.eventName,
      amount: totalAmount,
      walletAmount: walletAmount,
      cardAmount: cardAmount,
      type: "payment",
      date: new Date(),
    });

    console.log(
      `✅ Transaction logged for user ${userId}: ${totalAmount} (wallet: ${walletAmount}, card: ${cardAmount})`
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

    // Verify payment was actually successful
    if (session.payment_status !== "paid") {
      console.warn(
        `⚠️ Vendor payment session ${session.id} completed but payment_status is ${session.payment_status}, not 'paid'. Skipping.`
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

      // Mark payment as completed - set hasPaid to true
      (vendor.requestedEvents[requestIndex] as any).hasPaid = true;
      vendor.markModified("requestedEvents");
      await vendor.save();

      // Update the event based on type - SET hasPaid to true in event RequestData
      if (event.type === EVENT_TYPES.BAZAAR) {
        // Find vendor in event's vendors array - handle both populated and unpopulated vendor refs
        const vendorIndex = event.vendors?.findIndex((ve) => {
          // Handle populated vendor (object with _id) vs unpopulated (ObjectId string)
          const vendorRefId =
            typeof ve.vendor === "string"
              ? ve.vendor
              : (ve.vendor as any)?._id?.toString() || ve.vendor?.toString();
          return vendorRefId === vendorId.toString();
        });

        if (vendorIndex !== -1 && vendorIndex !== undefined && event.vendors) {
          // Set hasPaid to true in the event's RequestData
          event.vendors[vendorIndex].RequestData.hasPaid = true;
          event.markModified("vendors");
          await event.save();
        } else {
          console.error(
            `⚠️ Could not find vendor ${vendorId} in bazaar event ${eventId} vendors array`
          );
        }
      } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
        // For platform booth, set hasPaid to true in RequestData
        if (
          event.vendor?.toString() === vendorId.toString() &&
          event.RequestData
        ) {
          event.RequestData.hasPaid = true;

          // Set start date to 1 day after payment
          const startDate = new Date();
          startDate.setDate(startDate.getDate() + 1);
          event.eventStartDate = startDate;

          // Update end date based on duration
          if (event.RequestData.boothSetupDuration) {
            const durationInWeeks = event.RequestData.boothSetupDuration;
            const durationInMs = durationInWeeks * 7 * 24 * 60 * 60 * 1000;
            event.eventEndDate = new Date(startDate.getTime() + durationInMs);
          }

          event.markModified("RequestData");
          event.markModified("eventStartDate");
          event.markModified("eventEndDate");
          await event.save();
        } else {
          console.error(
            `⚠️ Vendor mismatch or missing RequestData for platform booth event ${eventId}`
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
