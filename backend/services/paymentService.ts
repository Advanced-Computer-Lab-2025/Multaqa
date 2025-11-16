import Stripe from "stripe";
import createError from "http-errors";
import { EventsService } from "./eventService";
import { UserService } from "./userService";
import { EVENT_TYPES } from "../constants/events.constants";
import { IEvent } from "../interfaces/models/event.interface";
import { sendPaymentReceiptEmail } from "./emailService";
import { IUser } from "../interfaces/models/user.interface";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);

const DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";
const DEFAULT_SUCCESS_URL =
  process.env.STRIPE_SUCCESS_URL ||
  "https://example.com/payments/success?session_id={CHECKOUT_SESSION_ID}";
const DEFAULT_CANCEL_URL =
  process.env.STRIPE_CANCEL_URL || "https://example.com/payments/cancel";

export interface CreateCheckoutSessionParams {
  eventId: string;
  userId: string;
  quantity?: number;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
  walletBalance?: number;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string | null;
}

export class PaymentService {
  private eventsService: EventsService;
  private userService: UserService;

  constructor() {
    this.eventsService = new EventsService();
    this.userService = new UserService();
  }

  /**
   * Validate if user can register for an event
   * @param event - Event to validate registration for
   * @param userId - User ID attempting to register
   * @throws Error if user cannot register
   */
  private validateUserRegistrationEligibility(
    event: IEvent,
    userId: string
  ): void {
    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      throw createError(400, "Registration deadline has passed for this event");
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.attendees?.some((attendee: any) => {
      const attendeeId = attendee._id || attendee;
      return attendeeId.toString() === userId.toString();
    });
    if (isAlreadyRegistered) {
      throw createError(409, "User already registered for this event");
    }
  }

  /**
   * Create a Stripe checkout session for an event
   * @param params - Checkout session parameters
   * @param expectedTypes - Array of allowed event types
   * @returns Checkout session details
   */
  async createCheckoutSessionForEvent(
    params: CreateCheckoutSessionParams,
    expectedTypes: EVENT_TYPES[]
  ): Promise<CreateCheckoutSessionResponse> {
    const {
      eventId,
      userId,
      quantity = 1,
      customerEmail,
      metadata,
      walletBalance = 0,
    } = params;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createError(400, "Quantity must be a positive integer");
    }

    // Fetch event
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Validate event type
    const eventType = event.type as EVENT_TYPES;
    if (!expectedTypes.includes(eventType)) {
      throw createError(
        400,
        `Event is not one of: ${expectedTypes.join(", ")}`
      );
    }

    // Validate user registration eligibility
    this.validateUserRegistrationEligibility(event, userId);

    // Validate event price
    const price = typeof event.price === "number" ? event.price : undefined;
    if (!price || !Number.isFinite(price) || price <= 0) {
      throw createError(400, "Event price must be greater than zero");
    }

    // Check event capacity
    const capacity =
      typeof (event as any).capacity === "number"
        ? ((event as any).capacity as number)
        : undefined;
    const attendeesCount = Array.isArray(event.attendees)
      ? event.attendees.length
      : 0;

    if (
      capacity !== undefined &&
      quantity > Math.max(0, capacity - attendeesCount)
    ) {
      throw createError(400, "Not enough spots available for this event");
    }

    // Calculate subtotal
    const subtotal = price * quantity;

    // Validate and apply wallet balance
    if (walletBalance < 0) {
      throw createError(400, "Wallet balance cannot be negative");
    }

    const amountToPay = Math.max(0, subtotal - walletBalance);

    // If amount to pay is 0, we might want to handle this differently
    // For now, we'll allow it but Stripe will need at least some amount
    if (amountToPay <= 0) {
      throw createError(
        400,
        "Wallet balance covers the entire amount. No payment needed"
      );
    }

    // Build metadata
    const sanitizedMetadata: Record<string, string> = {
      eventId,
      eventType: eventType,
      userId,
      walletBalanceApplied: walletBalance.toString(),
    };

    if (metadata && typeof metadata === "object") {
      for (const [key, value] of Object.entries(metadata)) {
        if (value === undefined || value === null) continue;
        sanitizedMetadata[key] = String(value);
      }
    }

    // Calculate amount in cents
    const unitAmount = Math.round(amountToPay * 100);
    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      throw createError(500, "Invalid pricing configuration");
    }

    // Build line items with proper pricing display
    const lineItems: any[] = [];

    if (walletBalance > 0) {
      // Show the discounted price (what user actually pays)
      lineItems.push({
        price_data: {
          currency: DEFAULT_CURRENCY,
          unit_amount: Math.round(amountToPay * 100),
          product_data: {
            name: event.eventName,
            description: event.description?.slice(0, 250),
          },
        },
        quantity: 1,
      });
    } else {
      // Use stripePriceId if available and no wallet balance
      if (event.stripePriceId) {
        lineItems.push({ price: event.stripePriceId, quantity });
      } else {
        lineItems.push({
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: Math.round(price * 100),
            product_data: {
              name: event.eventName,
              description: event.description?.slice(0, 250),
            },
          },
          quantity,
        });
      }
    }

    // Deduct wallet balance if being used for hybrid payment
    if (walletBalance > 0) {
      await this.userService.deductFromWallet(userId, walletBalance);
      console.log(
        `✅ Deducted ${walletBalance} from user ${userId}'s wallet for hybrid payment`
      );

      // Log transaction immediately with wallet and card breakdown
      await this.userService.addTransaction(userId, {
        eventName: event.eventName,
        amount: price,
        walletAmount: walletBalance,
        cardAmount: amountToPay,
        type: "payment",
        date: new Date(),
      });
      console.log(
        `✅ Transaction logged: ${price} (wallet: ${walletBalance}, card: ${amountToPay})`
      );
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: DEFAULT_CURRENCY,
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: DEFAULT_SUCCESS_URL,
      cancel_url: DEFAULT_CANCEL_URL,
      metadata: sanitizedMetadata,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  // Pay for event using wallet balance
  async payWithWallet(userId: string, eventId: string): Promise<IUser> {
    // Fetch event to get the price
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Validate user registration eligibility
    this.validateUserRegistrationEligibility(event, userId);

    // Check if event has a price
    if (event.price === undefined || event.price === null) {
      throw createError(400, "Event does not have a price");
    }

    // Deduct from wallet and get updated user
    const user = await this.userService.deductFromWallet(userId, event.price);

    // Log payment transaction (full amount paid with wallet)
    await this.userService.addTransaction(userId, {
      eventName: event.eventName,
      amount: event.price,
      walletAmount: event.price,
      cardAmount: 0,
      type: "payment",
      date: new Date(),
    });

    // Get user details for email
    const userDetails = await this.userService.getUserById(userId);
    const username =
      (userDetails as any).firstName && (userDetails as any).lastName
        ? `${(userDetails as any).firstName} ${(userDetails as any).lastName}`
        : userDetails.email;

    // Send payment receipt email
    await sendPaymentReceiptEmail({
      userEmail: userDetails.email,
      username,
      transactionId: `wallet_${userId}_${eventId}_${Date.now()}`,
      amount: event.price,
      currency: "USD",
      itemName: event.eventName,
      itemType: event.type === "trip" ? "Trip" : "Workshop",
      paymentDate: new Date(),
      paymentMethod: "Wallet",
    });

    await this.eventsService.registerUserForEvent(eventId, userId);

    return user;
  }

  async refundPayment(userId: string, eventId: string): Promise<void> {
    // Fetch event to get the price
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Check if event has a price
    if (event.price === undefined || event.price === null) {
      throw createError(400, "Event does not have a price");
    }

    const currentDate = new Date();
    const eventDate = event.eventStartDate;
    // Get number of days between current date and event date
    const timeDiff = eventDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Only allow refund if requested at least 14 days before event start date
    if (daysDiff < 14) {
      throw createError(
        400,
        "Refunds can only be processed at least 14 days before the event start date"
      );
    }
    //remove user from event attendees
    await this.eventsService.removeAttendeeFromEvent(eventId, userId);

    // Refund amount to user's wallet
    await this.userService.addToWallet(userId, event.price);

    // Log refund transaction
    await this.userService.addTransaction(userId, {
      eventName: event.eventName,
      amount: event.price,
      walletAmount: event.price,
      cardAmount: 0,
      type: "refund",
      date: new Date(),
    });
  }
}
