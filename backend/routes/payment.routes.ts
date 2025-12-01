import { Router, Response, NextFunction, Request } from "express";
import createError from "http-errors";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { UserRole } from "../constants/user.constants";
import { CreateCheckoutSessionResponse } from "../interfaces/responses/paymentResponses.interface";
import { EVENT_TYPES } from "../constants/events.constants";
import { PaymentService } from "../services/paymentService";
import { UserService } from "../services/userService";
import { StaffPosition } from "../constants/staffMember.constants";
import { PayWithWalletResponse } from "../interfaces/responses/userResponses.interface";

const paymentService = new PaymentService();
const router = Router();

async function createCheckoutSession(
  req: AuthenticatedRequest,
  res: Response<CreateCheckoutSessionResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { eventId } = req.params as { eventId?: string };
    if (!eventId) {
      throw createError(400, "Missing eventId parameter");
    }

    const { quantity, customerEmail, metadata, amount } = req.body || {};

    const sessionData = await paymentService.createCheckoutSessionForEvent(
      {
        eventId,
        userId: req.user?.id || "",
        quantity,
        customerEmail,
        metadata,
        walletBalance: amount || 0,
      },
      [EVENT_TYPES.TRIP, EVENT_TYPES.WORKSHOP]
    );

    res.status(201).json({
      success: true,
      message: "Checkout session created",
      data: {
        sessionId: sessionData.sessionId,
        url: sessionData.url,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Pay for event using wallet balance
async function payWithWallet(
  req: AuthenticatedRequest,
  res: Response<PayWithWalletResponse>,
  next: any
) {
  try {
    const eventId = req.params.eventId;
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized: missing user in token");
    }

    if (!eventId) {
      throw createError(400, "Missing eventId in params");
    }

    // Get event price before payment
    const { Event } = await import("../schemas/event-schemas/eventSchema");
    const event = await Event.findById(eventId);

    if (!event) {
      throw createError(404, "Event not found");
    }

    const amountPaid = event.price || 0;

    // Process payment
    const updatedUser = await paymentService.payWithWallet(userId, eventId);

    res.json({
      success: true,
      message: "Payment successful",
      data: {
        walletBalance: (updatedUser as any).walletBalance || 0,
        amountPaid: amountPaid,
      },
    });
  } catch (err: any) {
    next(err);
  }
}

async function refundPayment(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { eventId } = req.params || {};
    const userId = req.user?.id;

    if (!eventId) {
      throw createError(400, "Missing eventId in request params");
    }

    await paymentService.refundPayment(userId || "", eventId);

    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
    });
  } catch (err) {
    next(err);
  }
}

// Create vendor participation checkout session
async function createVendorCheckoutSession(
  req: AuthenticatedRequest,
  res: Response<CreateCheckoutSessionResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { eventId } = req.params as { eventId?: string };
    if (!eventId) {
      throw createError(400, "Missing eventId parameter");
    }

    const { customerEmail, metadata } = req.body || {};

    const vendorId = req.user?.id;
    if (!vendorId) {
      throw createError(401, "Unauthorized: missing vendor in token");
    }

    const sessionData = await paymentService.createVendorParticipationCheckout({
      eventId,
      vendorId,
      customerEmail,
      metadata,
    });

    res.status(201).json({
      success: true,
      message: "Vendor checkout session created",
      data: {
        sessionId: sessionData.sessionId,
        url: sessionData.url,
      },
    });
  } catch (err) {
    next(err);
  }
}

router.patch(
  "/:eventId/wallet",
  authorizeRoles({
    userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  payWithWallet
);

router.post(
  "/:eventId/refund",
  authorizeRoles({
    userRoles: [UserRole.STAFF_MEMBER, UserRole.STUDENT],
  }),
  refundPayment
);

router.post(
  "/:eventId",
  authorizeRoles({
    userRoles: [
      UserRole.STUDENT,
      UserRole.STAFF_MEMBER,
      UserRole.ADMINISTRATION,
    ],
    staffPositions: [
      StaffPosition.PROFESSOR,
      StaffPosition.TA,
      StaffPosition.STAFF,
    ],
  }),
  createCheckoutSession
);

router.post(
  "/vendor/:eventId",
  authorizeRoles({
    userRoles: [UserRole.VENDOR],
  }),
  createVendorCheckoutSession
);

export default router;
