import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import dotenv from "dotenv";
import eventRouter from "./routes/event.routes";
import vendorRouter from "./routes/vendors.routes";
import { errorHandler, notFoundHandler } from "./auth/errorHandler";
import userRouter from "./routes/user.routes";
import { Vendor } from "./schemas/stakeholder-schemas/vendorSchema";
dotenv.config();

const app = express();
app.use(json());
app.use(eventRouter);
app.use(userRouter);
app.use("/vendors", vendorRouter);

// Dummy route
app.get("/", (req, res) => {
  res.send("Backend initialized!");
});

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/MultaqaDB";

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    console.log("Connected to DB:", mongoose.connection.name);
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
