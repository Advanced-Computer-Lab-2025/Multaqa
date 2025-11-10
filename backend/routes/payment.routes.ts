import { Router, Response, NextFunction, Request } from "express";
import createError from "http-errors";
import { AuthenticatedRequest } from "../middleware/verifyJWT.middleware";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware";
import { UserRole } from "../constants/user.constants";
import { CreateCheckoutSessionResponse } from "../interfaces/responses/paymentResponses.interface";
import { EVENT_TYPES } from "../constants/events.constants";
import { PaymentService } from "../services/paymentService";

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

    const { quantity, customerEmail, metadata } = req.body || {};

    const sessionData = await paymentService.createCheckoutSessionForEvent(
      {
        eventId,
        userId: req.user?.id || "",
        quantity,
        customerEmail,
        metadata,
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

router.post(
  "/:eventId",
  authorizeRoles({
    userRoles: [
      UserRole.STUDENT,
      UserRole.STAFF_MEMBER,
      UserRole.ADMINISTRATION,
    ],
  }),
  createCheckoutSession
);

export default router;
