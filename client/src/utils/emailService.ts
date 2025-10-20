import emailjs from "@emailjs/browser";

// Email service configuration with single template approach
const EMAIL_CONFIG = {
  serviceId: "service_multaqa",
  publicKey: "S5dYOurfrnbzUL03S",
  templateId: "template_qimqs4r",
  backendUrl: "http://localhost:4000",
  platformUrl: "http://localhost:3000",
  supportEmail: "support@multaqa.com",
};

// Export configuration status for external use
export const getEmailServiceStatus = () => ({
  config: {
    hasServiceId: !!EMAIL_CONFIG.serviceId,
    hasPublicKey: !!EMAIL_CONFIG.publicKey,
    hasTemplateId: !!EMAIL_CONFIG.templateId,
    singleTemplateMode: true,
    backendUrl: EMAIL_CONFIG.backendUrl,
    platformUrl: EMAIL_CONFIG.platformUrl,
    supportEmail: EMAIL_CONFIG.supportEmail,
  }
});

// Generic email sending function
async function sendEmail(templateParams: Record<string, any>) {

  console.log('🔍 Runtime Email Config Check:', {
    serviceId: EMAIL_CONFIG.serviceId ? `${EMAIL_CONFIG.serviceId.substring(0, 10)}...` : 'missing',
    publicKey: EMAIL_CONFIG.publicKey ? `${EMAIL_CONFIG.publicKey.substring(0, 5)}...` : 'missing',
    templateId: EMAIL_CONFIG.templateId || 'missing'
  });

  // Check for missing config
  if (!EMAIL_CONFIG.serviceId) {
    const error = new Error('EmailJS Service ID is missing or contains placeholder value.');
    console.error("❌ Cannot send email:", error.message);
    throw error;
  }

  if (!EMAIL_CONFIG.publicKey) {
    const error = new Error('EmailJS Public Key is missing or invalid.');
    console.error("❌ Cannot send email:", error.message);
    throw error;
  }

  if (!EMAIL_CONFIG.templateId) {
    const error = new Error('EmailJS Template ID is missing or invalid.');
    console.error("❌ Cannot send email:", error.message);
    throw error;
  }

  // Always use the configured template ID for single template approach
  const actualTemplateId = EMAIL_CONFIG.templateId;

  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      actualTemplateId,
      templateParams,
      EMAIL_CONFIG.publicKey
    );

    console.log("✅ Email sent successfully:", response.status);
    return response;
  } catch (error: any) {
    console.error("❌ Failed to send email:", {
      error: error.message,
      templateId: actualTemplateId,
      serviceId: EMAIL_CONFIG.serviceId ? 'configured' : 'missing',
      publicKey: EMAIL_CONFIG.publicKey ? 'configured' : 'missing'
    });
    throw error;
  }
}

// Send verification email
export async function sendVerificationEmail(toEmail: string, verifyLink: string) {
  try {
    const templateParams = {
      to_email: String(toEmail),
      to_name: "Student",
      platform_name: "Multaqa",
      email_subject: "Please verify your Multaqa account",
      message_body: "Thank you for joining Multaqa! Please verify your email address to activate your account.",
      verification_link: String(verifyLink),
      button_text: "Verify Account",
      support_email: "support@multaqa.com",
      current_year: new Date().getFullYear().toString(),
    };

    const response = await sendEmail(templateParams);
    return response;
  } catch (error) {
    throw error;
  }
}

// Send role assignment notification email
export async function sendRoleAssignmentEmail(
  toEmail: string,
  staffName: string,
  assignedRole: string,
  verifyLink: string
) {
  try {
    const templateParams =
    {
      to_email: String(toEmail),
      to_name: staffName,
      platform_name: "Multaqa",
      email_subject: "Your role has been updated - Multaqa Platform",
      Message_body: `Your role has been updated to ${assignedRole}. Please verify your account to complete the process.`,
      verification_link: String(verifyLink),
      button_text: "Verify Account",
      support_email: "support@multaqa.com",
      current_year: new Date().getFullYear().toString(),
    };

    const response = await sendEmail(templateParams);

    console.log("✅ Role assignment email sent:", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ Failed to send role assignment email:", error);
    throw error;
  }
}

// // Send account block notification email
// export async function sendAccountBlockedEmail(
//   toEmail: string,
//   userName: string,
//   reason?: string
// ) {
//   try {
//     const templateParams = {
//       to_email: String,
//       to_name: userName,
//       platform_name: "Multaqa",
//       email_subject: "Account status update - Multaqa Platform",
//       Message_body: `Your account has been blocked. Please contact support for more information.`,
//       reason: reason || "No reason provided",
//       support_email: "support@multaqa.com",
//       current_year: new Date().getFullYear().toString(),
//     };

//     const response = await sendEmail(templateParams);

//     console.log("✅ Account blocked email sent:", response.status, response.text);
//     return response;
//   } catch (error) {
//     console.error("❌ Failed to send account blocked email:", error);
//     throw error;
//   }
// }

// // Send account unblock notification email
// export async function sendAccountUnblockedEmail(
//   toEmail: string,
//   userName: string
// ) {
//   try {
//     const templateParams = {
//       to_email: String(toEmail),
//       to_name: userName,
//       platform_name: "Multaqa",
//       email_subject: "Welcome back to Multaqa Platform",
//       message_body: `Your account has been unblocked. You can now access your account.`,
//       verification_link: `${EMAIL_CONFIG.platformUrl}/login`, 
//       button_text: "Access Your Account",
//       support_email: "support@multaqa.com",
//       current_year: new Date().getFullYear().toString(),
//     };

//     const response = await sendEmail(templateParams);

//     console.log("✅ Account unblocked email sent:", response.status, response.text);
//     return response;
//   } catch (error) {
//     console.error("❌ Failed to send account unblocked email:", error);
//     throw error;
//   }
// }

// // Convenience function for block/unblock status change
// export async function sendAccountStatusChangeEmail(
//   toEmail: string,
//   userName: string,
//   status: 'blocked' | 'unblocked',
//   reason?: string
// ) {
//   if (status === 'blocked') {
//     return await sendAccountBlockedEmail(toEmail, userName, reason);
//   } else {
//     return await sendAccountUnblockedEmail(toEmail, userName);
//   }
// }

export default sendEmail;