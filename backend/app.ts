import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import eventRouter from "./routes/event.routes";
import vendorEventsRouter from "./routes/vendorEvents.routes";
import authRouter from "./routes/auth.routes";
import workshopsRouter from "./routes/workshops.routes";
import "./config/redisClient";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/verifyJWT.middleware";
import { errorHandler, notFoundHandler } from "./auth/errorHandler";
import userRouter from "./routes/user.routes";
import gymSessionsRouter from "./routes/gymSessions.routes";
import adminRouter from "./routes/admin.routes";
import courtRouter from "./routes/court.routes";
import cors from "cors";
dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(json());
app.use(cookieParser());
app.use(cors());

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
  process.env.MONGO_URI;

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
