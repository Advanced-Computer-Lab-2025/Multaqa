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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
