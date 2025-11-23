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
import "./config/redisClient";
import "./config/cloudinary";

import verifyJWT from "./middleware/verifyJWT.middleware";
import { errorHandler, notFoundHandler } from "./config/errorHandler";
import { WorkshopScheduler } from "./services/workshopSchedulerService";
import { NotificationService } from "./services/notificationService";
import { EventScheduler } from "./services/eventSchedulerService";

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
app.use("/gymsessions", gymSessionsRouter);
app.use("/admins", adminRouter);
app.use("/vendorEvents", vendorEventsRouter);
app.use("/workshops", workshopsRouter);
app.use("/courts", courtRouter);
app.use("/payments", paymentRouter);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

const MONGO_URI = process.env.OLD_MONGO_URI || "mongodb://localhost:27017/MultaqaDB";
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    // Create HTTP server manually
    const server = http.createServer(app);

    // Attach Socket.io to the http server object
    io = new Server(server, {
      cors: { origin: "http://localhost:3000", credentials: true }
    });

    // Socket authentication
    io.use(authSocketMiddleware);

    // Handle socket connections
    // executed ONLY when a socket tries to connect.
    io.on("connection", (socket) => {
      const userId = socket.data.userId;
      OnlineUsersService.addSocket(userId, socket.id);

      // Listen for read notification event
      // The frontend sends: socket.emit("notification:read", { .. }), So the backend receives it:
      // This is user-initiated, unlike the others which are system-initiated events
      socket.on("notification:read", async (payload: { notificationId: string }) => {
        await NotificationService.markAsRead(socket.data.userId, payload.notificationId);
      });

      socket.on("disconnect", () => {
        OnlineUsersService.removeSocket(userId, socket.id);
      });
    });

    // Start server
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Start workshop scheduler
    const workshopScheduler = new WorkshopScheduler();
    workshopScheduler.start();

    // Start event scheduler
    const eventScheduler = new EventScheduler();
    eventScheduler.start();
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();