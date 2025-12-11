import Stripe from "stripe";
import createError from "http-errors";
import { EventsService } from "./eventService";
import { UserService } from "./userService";
import { WaitlistService } from "./waitlistService";
import { EVENT_TYPES } from "../constants/events.constants";
import { IEvent } from "../interfaces/models/event.interface";
import { sendPaymentReceiptEmail } from "./emailService";
import { IUser } from "../interfaces/models/user.interface";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { Event_Request_Status } from "../constants/user.constants";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecretKey);

const DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";
const DEFAULT_SUCCESS_URL =
  process.env.STRIPE_SUCCESS_URL ||
  "http://localhost:3000/en/successfulPayment";
const DEFAULT_CANCEL_URL =
  process.env.STRIPE_CANCEL_URL || "http://localhost:3000/en/errorPayment";

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

export interface CreateVendorCheckoutParams {
  eventId: string;
  vendorId: string;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
}

export class PaymentService {
  private eventsService: EventsService;
  private userService: UserService;
  private waitlistService: WaitlistService;

  constructor() {
    this.eventsService = new EventsService();
    this.userService = new UserService();
    this.waitlistService = new WaitlistService();
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

    // Validate slot availability and waitlist priority
    await this.waitlistService.validateSlotAvailability(eventId, userId);

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

    // NOTE: Wallet deduction and transaction logging moved to webhook handler
    // to ensure they only happen after successful Stripe payment confirmation

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

    // Validate slot availability and waitlist priority
    await this.waitlistService.validateSlotAvailability(eventId, userId);

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

    // Register user for event (this also removes them from waitlist automatically)
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
    // remove event from user's registered events
    await this.userService.removeEventFromUserRegistrations(userId, eventId);

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

    // Promote next user from waitlist (1 spot freed up)
    await this.waitlistService.promoteFromWaitlist(eventId, 1);
  }

  /**
   * Create a Stripe checkout session for vendor participation fee
   * This is separate from event-based payments as vendors pay a participation fee
   * calculated internally based on event-specific logic
   * @param params - Vendor checkout parameters
   * @returns Checkout session details
   */
  async createVendorParticipationCheckout(
    params: CreateVendorCheckoutParams
  ): Promise<CreateCheckoutSessionResponse> {
    const { eventId, vendorId, customerEmail, metadata } = params;

    // Fetch event to validate it exists
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Validate that the vendor has applied to this event
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    // Check if vendor has a request for this event
    const vendorRequest = vendor.requestedEvents.find(
      (req) => req.event?.toString() === eventId.toString()
    );

    if (!vendorRequest) {
      throw createError(
        400,
        "Vendor has not applied to this event. Please submit an application first."
      );
    }

    // Validate that the request status is APPROVED and payment not yet completed
    if (vendorRequest.status !== Event_Request_Status.APPROVED) {
      throw createError(
        400,
        `Cannot process payment. Request status is ${vendorRequest.status}. Payment is only allowed when status is APPROVED.`
      );
    }
    // Check if vendor has already paid
    if ((vendorRequest as any).hasPaid === true) {
      throw createError(
        400,
        "Payment has already been completed for this event."
      );
    }

    // Check if payment deadline has passed
    const paymentDeadline = (vendorRequest as any).paymentDeadline;
    if (paymentDeadline && new Date() > new Date(paymentDeadline)) {
      throw createError(
        400,
        "Payment deadline has passed. Please contact support."
      );
    }

    // Retrieve participation fee from vendor's requestedEvents (calculated at application time)
    const participationFee = (vendorRequest as any).participationFee;

    // Validate participation fee exists
    if (!participationFee || participationFee <= 0) {
      throw createError(
        400,
        "Participation fee not found. Please contact support."
      );
    }

    // Build metadata
    const sanitizedMetadata: Record<string, string> = {
      eventId,
      eventType: event.type,
      vendorId,
      paymentType: "vendor_participation",
      participationFee: participationFee.toString(),
    };

    if (metadata && typeof metadata === "object") {
      for (const [key, value] of Object.entries(metadata)) {
        if (value === undefined || value === null) continue;
        sanitizedMetadata[key] = String(value);
      }
    }

    // Calculate amount in cents
    const unitAmount = Math.round(participationFee * 100);
    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      throw createError(500, "Invalid participation fee amount");
    }

    // Create line items using price_data (no product/price IDs needed)
    const lineItems: any[] = [
      {
        price_data: {
          currency: DEFAULT_CURRENCY,
          unit_amount: unitAmount,
          product_data: {
            name: `Event Participation Fee`,
            description: `Vendor participation fee for ${event.eventName}`,
          },
        },
        quantity: 1,
      },
    ];

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: DEFAULT_CURRENCY,
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${DEFAULT_SUCCESS_URL}?paymentType=vendor_participation&eventType=${event.type}`,
      cancel_url: DEFAULT_CANCEL_URL,
      metadata: sanitizedMetadata,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }
}
