import { sendEmail } from "../config/emailClient";
import {
  getVerificationEmailTemplate,
  getBlockUnblockEmailTemplate,
  getStaffRoleAssignmentTemplate,
  getCommentDeletionWarningTemplate,
  getPaymentReceiptTemplate,
  getCertificateOfAttendanceTemplate,
  getApplicationStatusTemplate
} from "../utils/emailTemplates";

// Send verification email to new users
export const sendVerificationEmail = async (userEmail: string, username: string, verificationLink: string) => {
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
  verificationLink: string,
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
export const sendPaymentReceiptEmail = async (
  userEmail: string,
  username: string,
  transactionId: string,
  amount: number,
  currency: string,
  itemName: string,
  itemType: string,
  paymentDate: Date,
  paymentMethod: string
) => {
  const html = getPaymentReceiptTemplate(
    username,
    transactionId,
    amount,
    currency,
    itemName,
    itemType,
    paymentDate,
    paymentMethod
  );
  await sendEmail({
    to: userEmail,
    subject: "✅ Payment Receipt - Multaqa",
    html,
  });
};

// Send certificate of attendance email
export const sendCertificateOfAttendanceEmail = async (
  userEmail: string,
  username: string,
  workshopName: string,
  workshopDate: Date,
  duration: string,
  instructor: string | undefined,
  certificateId: string,
  downloadLink?: string
) => {
  const html = getCertificateOfAttendanceTemplate(
    username,
    workshopName,
    workshopDate,
    duration,
    instructor,
    certificateId,
    downloadLink
  );
  await sendEmail({
    to: userEmail,
    subject: "🎓 Your Certificate of Attendance - Multaqa",
    html,
  });
};

// Send application status email (bazaar/booth)
export const sendApplicationStatusEmail = async (
  userEmail: string,
  username: string,
  applicationType: 'bazaar' | 'booth',
  applicationName: string,
  status: 'accepted' | 'rejected',
  rejectionReason: string | undefined,
  nextSteps: string | undefined,
  applicationDate: Date
) => {
  const html = getApplicationStatusTemplate(
    username,
    applicationType,
    applicationName,
    status,
    rejectionReason,
    nextSteps,
    applicationDate
  );

  const typeLabel = applicationType === 'bazaar' ? 'Bazaar' : 'Booth';
  const statusEmoji = status === 'accepted' ? '✅' : '❌';
  const subject = `${statusEmoji} ${typeLabel} Application ${status === 'accepted' ? 'Accepted' : 'Update'} - Multaqa`;

  await sendEmail({
    to: userEmail,
    subject,
    html,
  });
};
