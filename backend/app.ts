import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import eventRouter from "./routes/event.routes";
import vendorEventsRouter from "./routes/vendorEvents.routes";
import authRouter from "./routes/auth.routes";
import workshopsRouter from "./routes/workshops.routes";

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
import "./schemas/event-schemas/tripEventSchema";
import "./schemas/event-schemas/conferenceEventSchema";
import "./config/redisClient";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/verifyJWT.middleware";
import { errorHandler, notFoundHandler } from "./auth/errorHandler";
import userRouter from "./routes/user.routes";
import gymSessionsRouter from "./routes/gymSessions.routes";
import adminRouter from "./routes/admin.routes";
import courtRouter from "./routes/court.routes";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(json());
app.use(cookieParser());

// Dummy route
app.get("/", (req, res) => {
  res.send("Backend initialized!");
});
app.use("/auth", authRouter);

app.use(verifyJWT); // Protect all routes below this middleware
app.use("/events", eventRouter);
app.use("/users", userRouter);
app.use("/gymsessions", gymSessionsRouter);
app.use("/admins", adminRouter);
app.use("/vendorEvents", vendorEventsRouter);
app.use("/eventsOffice", workshopsRouter);
app.use("/workshops", workshopsRouter);
app.use("/courts", courtRouter);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/MultaqaDB";

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI!);
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

app.use(errorHandler);
app.use(notFoundHandler);

startServer();
