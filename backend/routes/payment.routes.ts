import { Router, Response, NextFunction } from "express";
import Stripe from "stripe";
import createError from "http-errors";
import { EventsService } from "../services/eventService";
import { EVENT_TYPES } from "../constants/events.constants";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { UserRole } from "../constants/user.constants";
import { CreateCheckoutSessionResponse } from "../interfaces/responses/paymentResponses.interface";

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

const eventsService = new EventsService();
const router = Router();

interface CreateCheckoutSessionBody {
  quantity?: number;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
}

async function createCheckoutSessionForEvent(
  expectedType: EVENT_TYPES,
  req: AuthenticatedRequest,
  res: Response<CreateCheckoutSessionResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { eventId } = req.params as { eventId?: string };
    if (!eventId) {
      throw createError(400, "Missing eventId parameter");
    }

    const {
      quantity = 1,
      customerEmail,
      metadata,
    } = (req.body as CreateCheckoutSessionBody) || {};

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createError(400, "Quantity must be a positive integer");
    }

    const event = await eventsService.getEventById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (event.type !== expectedType) {
      throw createError(400, `Event is not a ${expectedType}`);
    }

    const price = typeof event.price === "number" ? event.price : undefined;
    if (!price || !Number.isFinite(price) || price <= 0) {
      throw createError(400, "Event price must be greater than zero");
    }

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

    const sanitizedMetadata: Record<string, string> = {
      eventId,
      eventType: expectedType,
    };

    if (req.user?.id) {
      sanitizedMetadata.userId = req.user.id;
    }

    if (metadata && typeof metadata === "object") {
      for (const [key, value] of Object.entries(metadata)) {
        if (value === undefined || value === null) continue;
        sanitizedMetadata[key] = String(value);
      }
    }

    const unitAmount = Math.round(price * 100);
    if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
      throw createError(500, "Invalid event pricing configuration");
    }

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

    res.status(201).json({
      success: true,
      message: "Checkout session created",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (err) {
    next(err);
  }
}

router.post(
  "/:eventId",
  authorizeRoles({
    userRoles: [
      UserRole.STUDENT,
      UserRole.STAFF_MEMBER,
      UserRole.ADMINISTRATION,
    ],
  }),
  (
    req: AuthenticatedRequest,
    res: Response<CreateCheckoutSessionResponse>,
    next: NextFunction
  ) => createCheckoutSessionForEvent(EVENT_TYPES.TRIP, req, res, next)
);

export default router;
