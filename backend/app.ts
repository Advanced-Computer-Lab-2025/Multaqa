import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { authSocketMiddleware } from "./middleware/authSocket.middleware";

export let io: Server;
import { OnlineUsersService } from "./services/onlineUsersService";

// Import routers
import eventRouter from "./routes/event.routes";
import vendorEventsRouter from "./routes/vendorEvents.routes";
import authRouter from "./routes/auth.routes";
import workshopsRouter from "./routes/workshops.routes";
import paymentRouter from "./routes/payment.routes";
import webhooksRouter from "./routes/webhooks.routes";
import userRouter from "./routes/user.routes";
import gymSessionsRouter from "./routes/gymSessions.routes";
import adminRouter from "./routes/admin.routes";
import courtRouter from "./routes/court.routes";
import uploadsRouter from "./routes/upload.routes";
import usheringRouter from "./routes/ushering.routes";
import bugReportRouter from "./routes/bugReport.routes";
import waitlistRouter from "./routes/waitlist.routes";

// Import base schemas first
import "./schemas/stakeholder-schemas/userSchema";

// Import discriminator schemas for users
import "./schemas/stakeholder-schemas/staffMemberSchema";
import "./schemas/stakeholder-schemas/studentSchema";
import "./schemas/stakeholder-schemas/vendorSchema";

// Import event schemas after user schemas are registered
import "./schemas/event-schemas/eventSchema";
import "./schemas/event-schemas/workshopEventSchema";
import "./schemas/event-schemas/bazaarEventSchema";
import "./schemas/event-schemas/platformBoothEventSchema";
import "./schemas/event-schemas/tripSchema";
import "./schemas/event-schemas/conferenceEventSchema";

// Import misc schemas
import "./schemas/misc/pollSchema";

import "./config/redisClient";
import "./config/cloudinary";

// Import event listeners to register them
import "./utils/eventListeners";

import verifyJWT from "./middleware/verifyJWT.middleware";
import { errorHandler, notFoundHandler } from "./config/errorHandler";
import { workshopScheduler } from "./services/workshopSchedulerService";
import { NotificationService } from "./services/notificationService";
import { eventScheduler } from "./services/eventSchedulerService";
import { waitlistScheduler } from "./services/waitlistSchedulerService";
import { usheringScheduler } from "./services/usheringSchedulerService";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// IMPORTANT: Mount webhook routes BEFORE json() middleware
// Stripe webhooks need raw body for signature verification
app.use("/webhooks", express.raw({ type: "application/json" }), webhooksRouter);

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount routers
app.use("/uploads", uploadsRouter);
app.use("/auth", authRouter);
app.use(verifyJWT); // Protect all routes below this middleware
app.use("/events", eventRouter);
app.use("/users", userRouter);
app.use("/waitlist", waitlistRouter);
app.use("/gymsessions", gymSessionsRouter);
app.use("/admins", adminRouter);
app.use("/vendorEvents", vendorEventsRouter);
app.use("/workshops", workshopsRouter);
app.use("/courts", courtRouter);
app.use("/payments", paymentRouter);
app.use("/ushering", usheringRouter)
app.use("/bugreports", bugReportRouter)

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.NEW_MONGO_URI || "mongodb://localhost:27017/MultaqaDB";

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    // Create HTTP server manually
    const server = http.createServer(app);

    // Attach Socket.io to the http server object
    io = new Server(server, {
      cors: { origin: "http://localhost:3000", credentials: true },
    });

    // Socket authentication
    io.use(authSocketMiddleware);

    // Handle socket connections -> executed ONLY when a socket tries to connect and stays active as long as the tab is open.
    io.on("connection", (socket) => {
      const userId = socket.data.userId;

      // Guard: Ensure userId exists (auth middleware should set this)
      if (!userId) {
        console.error("⚠️ Socket connection without userId - disconnecting");
        socket.emit("error", {
          message: "Authentication failed: User ID not found",
        });
        socket.disconnect(true);
        return;
      }

      OnlineUsersService.addSocket(userId, socket.id);

      // Listen for read notification event
      // The frontend sends: socket.emit("notification:read", { .. }), So the backend receives it:
      // This is user-initiated, unlike the others which are system-initiated events
      socket.on(
        "notification:read",
        async (payload: { notificationId: string }) => {
          try {
            console.log("Marking notification as read:", {
              userId,
              notificationId: payload.notificationId,
            });
            await NotificationService.changeReadStatus(
              socket.data.userId,
              payload.notificationId,
              true
            );
          } catch (error) {
            console.error("Error marking notification as read:", error);
            socket.emit("error", {
              message: "Failed to mark notification as read",
            });
          }
        }
      );

      socket.on(
        "notification:unread",
        async (payload: { notificationId: string }) => {
          try {
            console.log("Marking notification as unread:", {
              userId,
              notificationId: payload.notificationId,
            });
            await NotificationService.changeReadStatus(
              socket.data.userId,
              payload.notificationId,
              false
            );
          } catch (error) {
            console.error("Error marking notification as unread:", error);
            socket.emit("error", {
              message: "Failed to mark notification as unread",
            });
          }
        }
      );

      // Send undelievered notifications when user connects
      (async () => {
        try {
          await NotificationService.sendUndeliveredNotifications(
            socket.data.userId
          );
        } catch (error) {
          console.error("Error sending undelivered notifications:", error);
        }
      })();

      // Listen for delete notification event from the frontend
      socket.on(
        "notification:delete",
        async (payload: { notificationId: string }) => {
          try {
            await NotificationService.deleteNotification(
              socket.data.userId,
              payload.notificationId
            );
          } catch (error) {
            console.error("Error deleting notification:", error);
            socket.emit("error", { message: "Failed to delete notification" });
          }
        }
      );

      socket.on("disconnect", () => {
        try {
          OnlineUsersService.removeSocket(userId, socket.id);
        } catch (error) {
          console.error("Error removing socket:", error);
        }
      });
    });
    // Start server
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Start workshop scheduler
    workshopScheduler.start();

    // Start event scheduler
    eventScheduler.start();

    // Start waitlist scheduler
    waitlistScheduler.start();

    // Start ushering interview reminder scheduler
    usheringScheduler.start();
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
