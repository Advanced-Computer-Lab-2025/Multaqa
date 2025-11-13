import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
const GMAIL_USER = process.env.GMAIL_USER!;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
    disposition?: string;
  }>;
}

// Helper function to encode subject line
const encodeSubject = (subject: string): string => {
  return `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
};

export const sendEmail = async ({ to, subject, html, attachments }: EmailOptions) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const boundary = "boundary_" + Date.now();

    // Create email message in RFC 2822 format with proper encoding
    const message = [
      `From: Multaqa <${GMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${encodeSubject(subject)}`,
      "MIME-Version: 1.0",
       `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(html).toString("base64"),
    ]

     // Add attachments if they exist
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const content = Buffer.isBuffer(attachment.content)
          ? attachment.content
          : Buffer.from(attachment.content);

        message.push(
          `--${boundary}`,
          `Content-Type: ${attachment.contentType || 'application/octet-stream'}`,
          `Content-Disposition: ${attachment.disposition || 'attachment'}; filename="${attachment.filename}"`,
          "Content-Transfer-Encoding: base64",
          "",
          content.toString("base64")
        );
      }
    }

    message.push(`--${boundary}--`);

    // Encode the message in base64url format
    const encodedMessage = Buffer.from(message.join("\r\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send the email using Gmail API
    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("✅ Email sent successfully:", result.data.id);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
