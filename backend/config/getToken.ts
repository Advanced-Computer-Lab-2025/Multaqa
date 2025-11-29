import { google } from "googleapis";
import readline from "readline";
import dotenv from "dotenv";
import path from "path";

// Load .env from the backend root directory
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// To run in terminal: cd config && npx ts-node getToken.ts

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI 
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // important for getting refresh token
  scope: SCOPES,
  prompt: "consent", // force consent to get refresh token every time
});

console.log("Authorize this app by visiting this URL:\n", authUrl);

rl.question("Enter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\n✅ Tokens received:\n", tokens);
    console.log("\n👉 Save this refresh_token in your .env file as GOOGLE_REFRESH_TOKEN.");
  } catch (error) {
    console.error("Error retrieving tokens:", error);
  } finally {
    rl.close();
  }
});
