import { gmailTransporter } from "../config/nodemailer";

export async function sendVerification(to: string, link: string) {
  const mailOptions = {
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Account",
    html: `
      <h3>Verify your account</h3>
      <p>Click below to verify your email:</p>
      <a href="${link}" target="_blank">Verify Now</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await gmailTransporter.sendMail(mailOptions);
  console.log(`Verification email sent to ${to}`);
}