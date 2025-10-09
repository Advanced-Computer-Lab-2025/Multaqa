import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const gmailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
