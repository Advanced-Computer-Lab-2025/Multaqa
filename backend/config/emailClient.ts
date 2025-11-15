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


// Helper functions

// Encode email subject in base64 for UTF-8 support
const encodeSubject = (subject: string): string => {
  return `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
};

// Convert string to quoted-printable encoding for email body to handle special characters
const encodeQuotedPrintable = (str: string): string => {
  return str
    .replace(/[^\x20-\x7E\r\n\t]|[=]/g, (char) => {
      const hex = char.charCodeAt(0).toString(16).toUpperCase();
      return `=${hex.padStart(2, '0')}`;
    })
    .split('\n')
    .map(line => {
      const chunks = [];
      while (line.length > 75) { // split long lines as per email standard
        let splitAt = 75;
        if (line[splitAt - 1] === '=') splitAt -= 1;
        if (line[splitAt - 2] === '=') splitAt -= 2;
        chunks.push(line.substring(0, splitAt) + '=');
        line = line.substring(splitAt);
      }
      chunks.push(line);
      return chunks.join('\r\n');
    })
    .join('\r\n');
};

// Convert HTML to plain text for clients that don't support HTML
const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
};

export const sendEmail = async ({ to, subject, html, attachments }: EmailOptions) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const hasAttachments = attachments && attachments.length > 0;

    // ------------------------------
    // Case: WITH ATTACHMENTS
    // ------------------------------
    if (hasAttachments) {
      /*
        Boundary strings separate different parts of a MIME email.
        multipart/mixed → top-level container that allows attachments.
        multipart/alternative → nested container for plain text + HTML versions of the email body.
        Each boundary must be unique to avoid conflicts in parsing.

        multipart/mixed
        ├─ multipart/alternative (body)
        │   ├─ text/plain
        │   └─ text/html
        └─ attachment1
        └─ attachment2

      */
      const mixedBoundary = `mixed_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const alternativeBoundary = `alt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Build MIME message as an array of strings
      const message = [
        // Standard headers
        `From: Multaqa <${GMAIL_USER}>`,
        `To: ${to}`,
        `Reply-To: ${GMAIL_USER}`,
        `Subject: ${encodeSubject(subject)}`,
        `Message-ID: <${Date.now()}.${Math.random().toString(36).substring(2)}@${GMAIL_USER.split('@')[1]}>`,
        `Date: ${new Date().toUTCString()}`,
        "MIME-Version: 1.0",
        "X-Priority: 3",
        "X-MSMail-Priority: Normal",
        "Importance: Normal",
        `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
        "",
        // Start multipart/alternative (plain text + HTML)
        `--${mixedBoundary}`,
        `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`,
        "",
        // Plain text version
        `--${alternativeBoundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "Content-Transfer-Encoding: quoted-printable",
        "",
        encodeQuotedPrintable(htmlToPlainText(html)),
        "",
        // HTML version
        `--${alternativeBoundary}`,
        "Content-Type: text/html; charset=utf-8",
        "Content-Transfer-Encoding: quoted-printable",
        "",
        encodeQuotedPrintable(html),
        "",
        `--${alternativeBoundary}--`,
        ""
      ];

      for (const attachment of attachments) {
        const content = Buffer.isBuffer(attachment.content)
          ? attachment.content
          : Buffer.from(attachment.content);

        // Sanitize filename
        let safeFilename = attachment.filename
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9._-]/g, '')
          .replace(/_{2,}/g, '_')
          .replace(/\.{2,}/g, '.')
          .substring(0, 100);

        // Force .pdf extension if not present
        if (!safeFilename.endsWith('.pdf')) {
          safeFilename = safeFilename.replace(/\.[^.]*$/, '') + '.pdf';
        }

        const contentType = safeFilename.endsWith('.pdf')
          ? 'application/pdf'
          : (attachment.contentType || 'application/octet-stream');

        // Add attachment to message
        message.push(
          `--${mixedBoundary}`,
          `Content-Type: ${contentType}; name="${safeFilename}"`,
          `Content-Disposition: attachment; filename="${safeFilename}"`,
          `Content-Transfer-Encoding: base64`,
          "",
          content.toString("base64").match(/.{1,76}/g)?.join("\r\n") || content.toString("base64"),
          ""
        );
      }

      // Close mixed boundary
      message.push(`--${mixedBoundary}--`);

      // Encode entire message in base64url format
      const encodedMessage = Buffer.from(message.join("\r\n"))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const result = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: encodedMessage },
      });

      console.log("✅ Email sent successfully:", result.data.id);
      return result;

    } else {
      // ------------------------------
      // Case: WITHOUT ATTACHMENTS
      // ------------------------------
      const message = [
        `From: Multaqa <${GMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${encodeSubject(subject)}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=utf-8",
        "Content-Transfer-Encoding: base64",
        "",
        Buffer.from(html).toString("base64"),
      ].join("\r\n");

      const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const result = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: encodedMessage },
      });

      console.log("✅ Email sent successfully:", result.data.id);
      return result;
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
