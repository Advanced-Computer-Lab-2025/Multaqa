import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(json());

// Dummy route
app.get("/", (req, res) => {
  res.send("Backend initialized!");
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/multaqa";

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();
