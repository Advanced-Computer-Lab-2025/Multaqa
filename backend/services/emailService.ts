import { gmailTransporter } from "../config/nodemailer";

export async function sendVerification(to: string, link: string) {
  const mailOptions = {
    from: `Multaqa Support Team <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Multaqa Account",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fb; padding: 40px 0;">
        <div style="max-width: 600px; background-color: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); overflow: hidden;">
          
          <div style="background-color: #2563eb; color: #ffffff; padding: 20px 30px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px;">Welcome to Multaqa!</h2>
          </div>

          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">
              Hi there 👋,<br><br>
              Thanks for joining <strong>Multaqa</strong>! To complete your registration, please verify your email address by clicking the button below.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" target="_blank" style="
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 16px;
                display: inline-block;
              ">
                Verify My Email
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              If you did not create an account on Multaqa, please ignore this email. <br>
              This verification link will expire soon for security reasons.
            </p>
          </div>

          <div style="background-color: #f1f5f9; color: #555; font-size: 12px; text-align: center; padding: 15px;">
            © ${new Date().getFullYear()} Multaqa. All rights reserved.
          </div>

        </div>
      </div>
    `,
  };

  await gmailTransporter.sendMail(mailOptions);
  console.log("📧 Verification email sent successfully to:", to);
}
