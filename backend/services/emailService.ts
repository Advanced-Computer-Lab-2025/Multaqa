import { sendEmail } from "../config/emailClient";
import {
  getVerificationEmailTemplate,
  getBlockUnblockEmailTemplate,
  getStaffRoleAssignmentTemplate,
  getCommentDeletionWarningTemplate,
  getPaymentReceiptTemplate,
  getCertificateOfAttendanceTemplate,
  getApplicationStatusTemplate,
  getExternalVisitorQREmailTemplate,
  getGymSessionNotificationTemplate,
  getEventAccessRemovedTemplate,
<<<<<<< HEAD
  getWaitlistJoinedTemplate,
  getWaitlistPromotionTemplate,
  getWaitlistDeadlineExpiredTemplate,
  getWaitlistAutoRegisteredTemplate,
  getWaitlistRemovedTemplate,
=======
  getBugReportTemplate,
>>>>>>> 6af2f75f (feature(bigReport):Add bug report email and PDF generation features)
} from "../utils/emailTemplates";

// Send verification email to new users
export const sendVerificationEmail = async (
  userEmail: string,
  username: string,
  verificationLink: string
) => {
  const html = getVerificationEmailTemplate(username, verificationLink);
  await sendEmail({
    to: userEmail,
    subject: "🎉 Welcome to Multaqa!",
    html,
  });
};

// Send block/unblock notification email
export const sendBlockUnblockEmail = async (
  userEmail: string,
  isBlocked: boolean,
  reason?: string
) => {
  const html = getBlockUnblockEmailTemplate(isBlocked, reason);
  const subject = isBlocked
    ? "⚠️ Your Multaqa Account Has Been Suspended"
    : "✅ Your Multaqa Account Has Been Restored";

  await sendEmail({
    to: userEmail,
    subject,
    html,
  });
};

// Send staff role assignment email
export const sendStaffRoleAssignmentEmail = async (
  userEmail: string,
  username: string,
  role: string,
  verificationLink: string
) => {
  const html = getStaffRoleAssignmentTemplate(username, role, verificationLink);
  await sendEmail({
    to: userEmail,
    subject: "🎉 New Staff Role Assigned - Multaqa",
    html,
  });
};

// Send comment deletion warning email
export const sendCommentDeletionWarningEmail = async (
  userEmail: string,
  username: string,
  commentText: string,
  deletionReason: string,
  eventName: string | undefined,
  warningCount: number
) => {
  const html = getCommentDeletionWarningTemplate(
    username,
    commentText,
    deletionReason,
    eventName,
    warningCount
  );
  await sendEmail({
    to: userEmail,
    subject: "⚠️ Content Moderation Warning - Multaqa",
    html,
  });
};

// Send payment receipt email
export const sendPaymentReceiptEmail = async (params: {
  userEmail: string;
  username: string;
  transactionId: string;
  amount: number;
  currency: string;
  itemName: string;
  itemType: string;
  paymentDate: Date;
  paymentMethod: string;
}) => {
  const html = getPaymentReceiptTemplate(
    params.username,
    params.transactionId,
    params.amount,
    params.currency,
    params.itemName,
    params.itemType,
    params.paymentDate,
    params.paymentMethod
  );
  await sendEmail({
    to: params.userEmail,
    subject: "✅ Payment Receipt - Multaqa",
    html,
  });
};

// Send certificate of attendance email
export const sendCertificateOfAttendanceEmail = async (
  userEmail: string,
  username: string,
  workshopName: string,
  certificateBuffer: Buffer
) => {
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();

  const html = getCertificateOfAttendanceTemplate(username, workshopName);
  await sendEmail({
    to: userEmail,
    subject: "🎓 Your Certificate of Attendance - Multaqa",
    html,
    attachments: [
      {
        filename: `Certificate_${username.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}_${workshopName.replace(/[^a-zA-Z0-9]/g, "_")}_${randomId}.pdf`,
        content: certificateBuffer,
        contentType: "application/pdf",
        disposition: "attachment",
      },
    ],
  });
};

// Send application status email (bazaar/booth)
export const sendApplicationStatusEmail = async (
  userEmail: string,
  username: string,
  applicationType: "bazaar" | "booth",
  applicationName: string,
  status: "accepted" | "rejected",
  rejectionReason: string | undefined,
  nextSteps: string | undefined,
  paymentDeadline?: Date
) => {
  const html = getApplicationStatusTemplate(
    username,
    applicationType,
    applicationName,
    status,
    rejectionReason,
    nextSteps,
    paymentDeadline
  );

  const typeLabel = applicationType === "bazaar" ? "Bazaar" : "Booth";
  const statusEmoji = status === "accepted" ? "✅" : "❌";
  const subject = `${statusEmoji} ${typeLabel} Application ${
    status === "accepted" ? "Accepted" : "Update"
  } - Multaqa`;

  await sendEmail({
    to: userEmail,
    subject,
    html,
  });
};

export const sendQRCodeEmail = async (
  email: string,
  name: string,
  eventName: string,
  qrCodeBuffer: Buffer
) => {
  const html = getExternalVisitorQREmailTemplate(name, eventName);
  await sendEmail({
    to: email,
    subject: `🎟️ Your QR Code for ${eventName} - Multaqa`,
    html,
    attachments: [
      {
        filename: `QR_Code_${eventName.replace(/[^a-zA-Z0-9]/g, "_")}.png`,
        content: qrCodeBuffer,
        contentType: "pdf",
        disposition: "attachment",
      },
    ],
  });
};

// Send event access removed email
export const sendEventAccessRemovedEmail = async (
  userEmail: string,
  username: string,
  eventName: string,
  allowedRolesAndPositions: string[],
  refundAmount?: number
) => {
  const html = getEventAccessRemovedTemplate(
    username,
    eventName,
    allowedRolesAndPositions,
    refundAmount
  );

  await sendEmail({
    to: userEmail,
    subject: `🚫 Event Registration Update - ${eventName}`,
    html,
  });
};

// Send waitlist removal notification email
export const sendWaitlistRemovedEmail = async (
  userEmail: string,
  username: string,
  eventName: string,
  allowedRolesAndPositions: string[]
) => {
  const html = getWaitlistRemovedTemplate(
    username,
    eventName,
    allowedRolesAndPositions
  );

  await sendEmail({
    to: userEmail,
    subject: `🚫 Waitlist Update - ${eventName}`,
    html,
  });
};

// Send gym session notification email (cancelled or edited)
export const sendGymSessionNotificationEmail = async (params: {
  userEmail: string;
  username: string;
  sessionName: string;
  actionType: "cancelled" | "edited";
  oldDetails: {
    date: Date;
    time: string;
    location: string;
    instructor?: string;
    duration?: number;
  };
  newDetails?: {
    date: Date;
    time: string;
    location: string;
    instructor?: string;
    duration?: number;
  };
}) => {
  const html = getGymSessionNotificationTemplate(
    params.username,
    params.sessionName,
    params.actionType,
    params.oldDetails,
    params.newDetails
  );

  const actionLabel =
    params.actionType === "cancelled" ? "Cancelled" : "Updated";
  const emoji = params.actionType === "cancelled" ? "❌" : "🔄";

  await sendEmail({
    to: params.userEmail,
    subject: `${emoji} Gym Session ${actionLabel} - Multaqa`,
    html,
  });
};
<<<<<<< HEAD

// Send waitlist joined confirmation email
export const sendWaitlistJoinedEmail = async (
  userEmail: string,
  username: string,
  eventName: string,
  eventDate: Date
) => {
  const html = getWaitlistJoinedTemplate(username, eventName, eventDate);
  await sendEmail({
    to: userEmail,
    subject: "📋 You're on the Waitlist - Multaqa",
    html,
  });
};

// Send waitlist promotion email (with payment deadline)
export const sendWaitlistPromotionEmail = async (
  userEmail: string,
  username: string,
  eventName: string,
  paymentDeadline: Date,
  eventId: string
) => {
  const html = getWaitlistPromotionTemplate(
    username,
    eventName,
    paymentDeadline,
    eventId
  );
  await sendEmail({
    to: userEmail,
    subject: "🎉 Great News! A Spot Opened Up - Multaqa",
    html,
  });
};

// Send waitlist deadline expired email
export const sendWaitlistDeadlineExpiredEmail = async (
  userEmail: string,
  username: string,
  eventName: string
) => {
  const html = getWaitlistDeadlineExpiredTemplate(username, eventName);
  await sendEmail({
    to: userEmail,
    subject: "⏰ Payment Deadline Expired - Multaqa",
    html,
  });
};

// Send waitlist auto-registration email (free events)
export const sendWaitlistAutoRegisteredEmail = async (
  userEmail: string,
  username: string,
  eventName: string,
  eventDate: Date,
  location: string
) => {
  const html = getWaitlistAutoRegisteredTemplate(
    username,
    eventName,
    eventDate,
    location
  );
  await sendEmail({
    to: userEmail,
    subject: "🎉 You're Registered! - Multaqa",
    html,
  });
=======
export const sendBugReportEmail = async (
    recipientEmail: string,
    reportTitle: string,
    pdfBuffer: Buffer
) => {
    const html = getBugReportTemplate(reportTitle);
    
    // Generate a clean filename for the attachment
    const cleanTitle = reportTitle.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    await sendEmail({
        to: recipientEmail,
        subject: `📋 New Bug Report Submitted: ${reportTitle}`,
        html,
        attachments: [
            {
                filename: `Bug_Report_${cleanTitle}_${today}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
                disposition: "attachment",
            },
        ],
    });
>>>>>>> 6af2f75f (feature(bigReport):Add bug report email and PDF generation features)
};
