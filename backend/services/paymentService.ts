import Stripe from "stripe";
import createError from "http-errors";
import { EventsService } from "./eventService";
import { EVENT_TYPES } from "../constants/events.constants";
import { IEvent } from "../interfaces/models/event.interface";

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
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string | null;
}

export class PaymentService {
  private eventsService: EventsService;

  constructor() {
    this.eventsService = new EventsService();
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
    const { eventId, userId, quantity = 1, customerEmail, metadata } = params;

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

    // Build metadata
    const sanitizedMetadata: Record<string, string> = {
      eventId,
      eventType: eventType,
      userId,
    };

    if (metadata && typeof metadata === "object") {
      for (const [key, value] of Object.entries(metadata)) {
        if (value === undefined || value === null) continue;
        sanitizedMetadata[key] = String(value);
      }
    }

    // Calculate amount
    const unitAmount = Math.round(price * 100);
    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      throw createError(500, "Invalid event pricing configuration");
    }

    // Build line item
    const lineItem = event.stripePriceId
      ? { price: event.stripePriceId, quantity }
      : {
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: unitAmount,
            product_data: {
              name: event.eventName,
              description: event.description?.slice(0, 250),
            },
          },
          quantity,
        };

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: DEFAULT_CURRENCY,
      customer_email: customerEmail,
      line_items: [lineItem],
      success_url: DEFAULT_SUCCESS_URL,
      cancel_url: DEFAULT_CANCEL_URL,
      metadata: sanitizedMetadata,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }
}
