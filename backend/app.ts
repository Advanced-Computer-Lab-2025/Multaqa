import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import dotenv from "dotenv";
import eventRouter from "./routes/event.routes";
import vendorRouter from "./routes/vendors.routes";
import authRouter from "./routes/auth.routes";
import "./config/redisClient";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/verifyJWT.middleware";
import { errorHandler, notFoundHandler } from "./auth/errorHandler";
import userRouter from "./routes/user.routes";
import gymSessionsRouter from "./routes/gymSessions.routes";
import { Vendor } from "./schemas/stakeholder-schemas/vendorSchema";
dotenv.config();

const app = express();
app.use(json());
app.use(cookieParser());

// Dummy route
app.get("/", (req, res) => {
  res.send("Backend initialized!");
});
app.use("/auth", authRouter);

app.use(verifyJWT); // Protect all routes below this middleware
app.use('/events', eventRouter);
app.use('/users', userRouter);
app.use('/gymsessions', gymSessionsRouter );
app.use(vendorRouter);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/MultaqaDB";

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB:", mongoose.connection.name);
    const PORT = process.env.PORT || 3000;
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
