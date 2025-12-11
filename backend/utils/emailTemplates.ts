const baseStyles = {
  container:
    "font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fb; padding: 40px 0;",
  card: "max-width: 600px; background-color: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); overflow: hidden;",
  header:
    "background-color: #2563eb; color: #ffffff; padding: 20px 30px; text-align: center;",
  headerDanger:
    "background-color: #dc2626; color: #ffffff; padding: 20px 30px; text-align: center;",
  headerSuccess:
    "background-color: #16a34a; color: #ffffff; padding: 20px 30px; text-align: center;",
  headerWarning:
    "background-color: #ea580c; color: #ffffff; padding: 20px 30px; text-align: center;",
  content: "padding: 30px;",
  button:
    "background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;",
  buttonSuccess:
    "background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;",
  footer:
    "background-color: #f1f5f9; color: #555; font-size: 12px; text-align: center; padding: 15px;",
  infoBox:
    "background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;",
  warningBox:
    "background-color: #fef3c7; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; border-radius: 4px;",
  successBox:
    "background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px;",
  dangerBox:
    "background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;",
};

// Verification Email Template
export const getVerificationEmailTemplate = (
  username: string,
  verificationLink: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.header}">
          <h2 style="margin: 0; font-size: 22px;">Welcome to Multaqa!</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username} 👋,<br><br>
            Thanks for joining <strong>Multaqa</strong>! To complete your registration, please verify your email address by clicking the button below.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" target="_blank" style="${
    baseStyles.button
  }">
              Verify My Email
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">
            If you did not create an account on Multaqa, please ignore this email.<br>
            This verification link will expire soon for security reasons.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Block/Unblock User Email Template
export const getBlockUnblockEmailTemplate = (
  isBlocked: boolean,
  reason?: string
): string => {
  const headerStyle = isBlocked
    ? baseStyles.headerDanger
    : baseStyles.headerSuccess;
  const title = isBlocked ? "Account Suspended" : "Account Restored";
  const emoji = isBlocked ? "⚠️" : "✅";

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${headerStyle}">
          <h2 style="margin: 0; font-size: 22px;">${emoji} ${title}</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi,<br><br>
            ${
              isBlocked
                ? "We regret to inform you that your Multaqa account has been suspended."
                : "Good news! Your Multaqa account has been restored and you can now access all platform features."
            }
          </p>
          ${
            isBlocked
              ? `<div style="${baseStyles.dangerBox}">
                <strong style="color: #dc2626;">Reason for suspension:</strong><br>
                <p style="margin: 10px 0 0 0; color: #333;">${
                  reason || "Violation of platform policies"
                }</p>
              </div>
              <p style="font-size: 14px; color: #555;">
                If you believe this action was taken in error or would like to appeal, please contact our support team.
              </p>`
              : `<div style="${baseStyles.successBox}">
                <p style="margin: 0; color: #333;">
                  You can now log in and continue using all Multaqa services. We appreciate your cooperation and adherence to our community guidelines.
                </p>
              </div>`
          }
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Staff Role Assignment Email Template
export const getStaffRoleAssignmentTemplate = (
  username: string,
  role: string,
  verificationLink: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerSuccess}">
          <h2 style="margin: 0; font-size: 22px;">🎉 New Staff Role Assigned</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            Congratulations! You have been assigned a new staff role on the Multaqa platform.
          </p>
          <div style="${baseStyles.successBox}">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Role:</td>
                <td style="padding: 8px 0; color: #333;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Assigned By:</td>
                <td style="padding: 8px 0; color: #333;">Admin</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          <div style="${baseStyles.warningBox}">
            <p style="margin: 0; color: #333;">
              <strong style="color: #ea580c;">⚠️ Action Required:</strong><br><br>
              To activate your new staff role and access the staff dashboard, please verify and accept this assignment by clicking the button below.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" target="_blank" style="${
    baseStyles.buttonSuccess
  }">
              Accept Staff Role
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">
            This verification link will expire in 48 hours. If you did not expect this role assignment or believe it was sent in error, please contact our support team immediately.<br><br>
            Once verified, you'll be able to log in to your account and access your new staff dashboard and responsibilities.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Comment Deletion Warning Email Template
export const getCommentDeletionWarningTemplate = (
  username: string,
  commentText: string,
  deletionReason: string,
  eventName: string | undefined,
  warningCount: number
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerWarning}">
          <h2 style="margin: 0; font-size: 22px;">⚠️ Content Moderation Warning</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            One of your comments has been removed for violating our community guidelines.
          </p>
          ${
            eventName
              ? `<p style="font-size: 14px; color: #666;">
                <strong>Event:</strong> ${eventName}
              </p>`
              : ""
          }
          <div style="${baseStyles.warningBox}">
            <strong style="color: #ea580c;">Deleted Comment:</strong>
            <p style="margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 4px; color: #333; font-style: italic;">
              "${
                commentText.length > 200
                  ? commentText.substring(0, 200) + "..."
                  : commentText
              }"
            </p>
          </div>
          <div style="${baseStyles.dangerBox}">
            <strong style="color: #dc2626;">Reason for Deletion:</strong>
            <p style="margin: 10px 0 0 0; color: #333;">${deletionReason}</p>
          </div>
          <div style="${baseStyles.infoBox}">
            <p style="margin: 0; color: #333;">
              <strong>Warning Count:</strong> ${warningCount}/3<br><br>
              ${
                warningCount >= 3
                  ? '⚠️ <strong style="color: #dc2626;">Your account may be subject to suspension.</strong>'
                  : "Please ensure future comments comply with our community guidelines to avoid account suspension."
              }
            </p>
          </div>
          <p style="font-size: 14px; color: #555;">
            We encourage respectful and constructive communication within our community. 
            Please review our community guidelines to understand what content is acceptable.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Payment Receipt Email Template
export const getPaymentReceiptTemplate = (
  username: string,
  transactionId: string,
  amount: number,
  currency: string,
  itemName: string,
  itemType: string,
  paymentDate: Date,
  paymentMethod: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerSuccess}">
          <h2 style="margin: 0; font-size: 22px;">✅ Payment Successful</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            Thank you for your payment! Your transaction has been processed successfully.
          </p>
          <div style="${baseStyles.successBox}">
            <h3 style="margin: 0 0 15px 0; color: #16a34a;">Receipt Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold; width: 40%;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${paymentDate.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0; color: #333;">${paymentMethod}</td>
              </tr>
            </table>
          </div>
          <div style="${baseStyles.infoBox}">
            <h3 style="margin: 0 0 15px 0; color: #2563eb;">Purchase Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Item Type:</td>
                <td style="padding: 8px 0; color: #333;">${itemType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Item Name:</td>
                <td style="padding: 8px 0; color: #333;">${itemName}</td>
              </tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 15px 0 8px 0; color: #555; font-weight: bold; font-size: 18px;">Total Amount:</td>
                <td style="padding: 15px 0 8px 0; color: #16a34a; font-weight: bold; font-size: 18px;">${currency} ${amount.toFixed(
    2
  )}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 14px; color: #555;">
            This email serves as your official receipt. Please keep it for your records.<br>
            If you have any questions about this transaction, please contact our support team.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

//Certificate of Attendance Email Template
export const getCertificateOfAttendanceTemplate = (
  username: string,
  workshopName: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerSuccess}">
          <h2 style="margin: 0; font-size: 22px;"> Congratulations!</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            Congratulations on successfully completing the workshop! We're pleased to present you with your Certificate of Attendance.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" download style="${baseStyles.buttonSuccess}">
              You'll find your certificate attached to this email.
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">
            We hope you found the workshop valuable and informative. Thank you for being part of the Multaqa community!
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Application Status (Bazaar/Booth) Email Template
export const getApplicationStatusTemplate = (
  username: string,
  applicationType: "bazaar" | "booth",
  applicationName: string,
  status: "accepted" | "rejected",
  rejectionReason: string | undefined,
  nextSteps: string | undefined,
  paymentDeadline?: Date
): string => {
  const isAccepted = status === "accepted";
  const headerStyle = isAccepted
    ? baseStyles.headerSuccess
    : baseStyles.headerDanger;
  const title = isAccepted
    ? "Application Accepted"
    : "Application Status Update";
  const emoji = isAccepted ? "✅" : "❌";
  const typeLabel = applicationType === "bazaar" ? "Bazaar" : "Booth";

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${headerStyle}">
          <h2 style="margin: 0; font-size: 22px;">${emoji} ${title}</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            We have reviewed your application to ${
              applicationType === "bazaar"
                ? "join the bazaar"
                : "apply for a booth"
            }.
          </p>
          <div style="${baseStyles.infoBox}">
            <h3 style="margin: 0 0 15px 0; color: #2563eb;">Application Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Type:</td>
                <td style="padding: 8px 0; color: #333;">${typeLabel} Application</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${applicationName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: ${
                  isAccepted ? "#16a34a" : "#dc2626"
                }; font-weight: bold; text-transform: uppercase;">
                  ${status}
                </td>
              </tr>
            </table>
          </div>
          ${
            isAccepted
              ? `<div style="${baseStyles.successBox}">
                <p style="margin: 0; color: #333;">
                  <strong style="color: #16a34a;">Congratulations!</strong><br><br>
                  Your application has been approved. We're excited to have you participate in our ${typeLabel.toLowerCase()}.
                </p>
              </div>
              ${
                paymentDeadline
                  ? `<div style="${baseStyles.warningBox}">
                    <strong style="color: #ea580c;">⏰ Payment Required:</strong>
                    <p style="margin: 10px 0 0 0; color: #333;">
                      Please complete your participation fee payment by <strong>${paymentDeadline.toLocaleDateString()} at ${paymentDeadline.toLocaleTimeString()}</strong>.
                      <br><br>
                      Failure to complete payment by this deadline may result in your application being cancelled.
                    </p>
                  </div>`
                  : ""
              }
              ${
                nextSteps
                  ? `<div style="${baseStyles.infoBox}">
                    <strong style="color: #2563eb;">Next Steps:</strong>
                    <p style="margin: 10px 0 0 0; color: #333;">${nextSteps}</p>
                  </div>`
                  : ""
              }`
              : `<div style="${baseStyles.dangerBox}">
                <strong style="color: #dc2626;">Application Not Approved</strong>
                <p style="margin: 10px 0 0 0; color: #333;">
                  We regret to inform you that your application was not approved at this time.
                </p>
              </div>
              ${
                rejectionReason
                  ? `<div style="${baseStyles.warningBox}">
                    <strong style="color: #ea580c;">Reason:</strong>
                    <p style="margin: 10px 0 0 0; color: #333;">${rejectionReason}</p>
                  </div>`
                  : ""
              }
              <p style="font-size: 14px; color: #555;">
                You're welcome to reapply in the future. If you have questions about this decision, please contact our support team.
              </p>`
          }
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// External Visitor QR Email Template
export const getExternalVisitorQREmailTemplate = (
  companyName: string,
  eventName: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        
        <div style="${baseStyles.headerSuccess}">
          <h2 style="margin: 0; font-size: 22px;">&#x1F39F;&#xFE0F; Your Event Entry Pass</h2>
        </div>

        <div style="${baseStyles.content}">
          
          <p style="font-size: 16px; color: #333;">
            Dear <strong>${companyName}</strong> Team,<br><br>
            Thank you for registering to participate in <strong>${eventName}</strong>. We are delighted to welcome you to the event.
          </p>

          <div style="${baseStyles.successBox}">
            <h3 style="margin: 0 0 15px 0; color: #16a34a; text-align: center;">Your Digital Pass is Attached</h3>
            <p style="text-align: center; font-size: 14px; color: #333; margin: 10px 0;">
              Your QR entry pass is included as a PDF attachment in this email.
            </p>
          </div>

          <p style="font-size: 14px; color: #555; text-align: center;">
            We look forward to having you at <strong>${eventName}</strong>.<br>
            If you have any questions, please contact our support team.
          </p>

        </div>

        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>

      </div>
    </div>
  `;
};
/**
 * Helper function to format the restriction reason message
 * @param allowedRolesAndPositions - Array of allowed roles and positions
 * @returns A simple formatted string stating the event has been restricted
 */
const formatRestrictionReason = (
  allowedRolesAndPositions: string[]
): string => {
  if (allowedRolesAndPositions.length === 0) {
    return "The event access has been restricted.";
  }

  const formattedRoles = allowedRolesAndPositions
    .map((role) => role.toLowerCase().replace(/_/g, " "))
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1) + "s");

  if (formattedRoles.length === 1) {
    return `The event has been restricted to ${formattedRoles[0]} only.`;
  } else if (formattedRoles.length === 2) {
    return `The event has been restricted to ${formattedRoles[0]} and ${formattedRoles[1]} only.`;
  } else {
    const lastRole = formattedRoles.pop();
    return `The event has been restricted to ${formattedRoles.join(
      ", "
    )}, and ${lastRole} only.`;
  }
};

// Waitlist Removal Email Template
export const getWaitlistRemovedTemplate = (
  username: string,
  eventName: string,
  allowedRolesAndPositions: string[]
): string => {
  const restrictionMessage = formatRestrictionReason(allowedRolesAndPositions);

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerWarning}">
          <h2 style="margin: 0; font-size: 22px;">🚫 Waitlist Update</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Dear ${username},<br><br>
            We regret to inform you that you have been removed from the waitlist for <strong>${eventName}</strong> due to updated access restrictions.
          </p>
          
          <div style="${baseStyles.warningBox}">
            <h3 style="margin: 0 0 10px 0; color: #ea580c;">Reason for Removal</h3>
            <p style="margin: 0; color: #333;">
              ${restrictionMessage}
            </p>
          </div>
          
          <div style="${baseStyles.infoBox}">
            <p style="margin: 0; color: #333;">
              <strong style="color: #2563eb;">What's Next?</strong><br><br>
              You can browse other available events that match your profile. Since you were on the waitlist and had not yet registered, no payment or refund is involved.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #555;">
            If you believe this removal was made in error or have any questions, please don't hesitate to contact the Events Office or our support team.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Event Access Removed Email Template
export const getEventAccessRemovedTemplate = (
  username: string,
  eventName: string,
  allowedRolesAndPositions: string[],
  refundAmount?: number
): string => {
  const restrictionMessage = formatRestrictionReason(allowedRolesAndPositions);

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerWarning}">
          <h2 style="margin: 0; font-size: 22px;">🚫 Event Registration Update</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Dear ${username},<br><br>
            We regret to inform you that your registration for <strong>${eventName}</strong> has been cancelled due to updated access restrictions.
          </p>
          
          <div style="${baseStyles.warningBox}">
            <h3 style="margin: 0 0 10px 0; color: #ea580c;">Reason for Removal</h3>
            <p style="margin: 0; color: #333;">
              ${restrictionMessage}
            </p>
          </div>
          
          ${
            refundAmount
              ? `
          <div style="${baseStyles.successBox}">
            <h3 style="margin: 0 0 10px 0; color: #16a34a;">💰 Refund Processed</h3>
            <p style="margin: 0; color: #333;">
              A refund of <strong>$${refundAmount.toFixed(
                2
              )}</strong> has been automatically added to your wallet.
              You can use this balance for future event registrations.
            </p>
          </div>
          `
              : ""
          }
          
          <div style="${baseStyles.infoBox}">
            <p style="margin: 0; color: #333;">
              <strong style="color: #2563eb;">What's Next?</strong><br><br>
              You can browse other available events that match your profile. We apologize for any inconvenience this may cause.
              ${
                refundAmount
                  ? "<br><br>Your wallet balance has been updated and is ready to use for other events."
                  : ""
              }
            </p>
          </div>
          
          <p style="font-size: 14px; color: #555;">
            If you believe this removal was made in error or have any questions, please don't hesitate to contact the Events Office or our support team.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

export const getGymSessionNotificationTemplate = (
  username: string,
  sessionName: string,
  actionType: "cancelled" | "edited",
  oldDetails?: {
    date: Date;
    time: string;
    location: string;
    instructor?: string;
    duration?: number;
  },
  newDetails?: {
    date: Date;
    time: string;
    location: string;
    instructor?: string;
    duration?: number;
  }
) => {
  const isCancelled = actionType === "cancelled";
  const headerStyle = isCancelled
    ? baseStyles.headerDanger
    : baseStyles.headerWarning;
  const title = isCancelled ? "Gym Session Cancelled" : "Gym Session Updated";
  const emoji = isCancelled ? "❌" : "⚠️";

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${headerStyle}">
          <h2 style="margin: 0; font-size: 22px;">${emoji} ${title}</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            The gym session "<strong>${sessionName}</strong>" that you registered for has been ${actionType}.
          </p>
          
          ${
            isCancelled
              ? `<div style="${baseStyles.dangerBox}">
                <h3 style="margin: 0 0 10px 0; color: #dc2626;">Cancelled Session Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Date:</td>
                    <td style="padding: 5px 0; color: #333;">${oldDetails?.date.toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Time:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      oldDetails?.time
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Duration:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      oldDetails?.duration
                        ? oldDetails.duration + " mins"
                        : "N/A"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Location:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      oldDetails?.location
                    }</td>
                  </tr>
                  ${
                    oldDetails?.instructor
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Instructor:</td>
                    <td style="padding: 5px 0; color: #333;">${oldDetails.instructor}</td>
                  </tr>`
                      : ""
                  }
                </table>
               </div>
               <p style="font-size: 14px; color: #555;">
                 We apologize for any inconvenience. Please check our schedule for alternative sessions.
               </p>`
              : `<div style="${baseStyles.warningBox}">
                <h3 style="margin: 0 0 10px 0; color: #ea580c;">Original Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Date:</td>
                    <td style="padding: 5px 0; color: #333;">${oldDetails?.date.toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Time:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      oldDetails?.time
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Duration:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      oldDetails?.duration
                        ? oldDetails.duration + " mins"
                        : "N/A"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Location:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      oldDetails?.location
                    }</td>
                  </tr>
                  ${
                    oldDetails?.instructor
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Instructor:</td>
                    <td style="padding: 5px 0; color: #333;">${oldDetails.instructor}</td>
                  </tr>`
                      : ""
                  }
                </table>
               </div>
               
               <div style="${baseStyles.successBox}">
                <h3 style="margin: 0 0 10px 0; color: #16a34a;">New Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Date:</td>
                    <td style="padding: 5px 0; color: #333;">${newDetails?.date.toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Time:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      newDetails?.time
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Duration:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      newDetails?.duration
                        ? newDetails.duration + " mins"
                        : "N/A"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Location:</td>
                    <td style="padding: 5px 0; color: #333;">${
                      newDetails?.location
                    }</td>
                  </tr>
                  ${
                    newDetails?.instructor
                      ? `
                  <tr>
                    <td style="padding: 5px 0; color: #555; font-weight: bold;">Instructor:</td>
                    <td style="padding: 5px 0; color: #333;">${newDetails.instructor}</td>
                  </tr>`
                      : ""
                  }
                </table>
               </div>
               <p style="font-size: 14px; color: #555;">
                 Your registration has been automatically transferred to the updated session.
               </p>`
          }
          
          <p style="font-size: 14px; color: #555;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

export const getBugReportTemplate = (reportTitle: string) => {
    const title = "Action Required: New Bug Report";
    

    return `
        <div style="${baseStyles.container}">
            <div style="${baseStyles.card}">
                <div style="${baseStyles.header}">
                    <h2 style="margin: 0; font-size: 22px;"> ${title}</h2>
                </div>
                <div style="${baseStyles.content}">
                    <p style="font-size: 16px; color: #333;">
                        Dear Multaqa Operations Team,<br><br>
                        A new bug report has been successfully submitted by a user. Please review the details and update us when resolved.
                    </p>
                    
                    <div style="${baseStyles.infoBox}">
                        <h3 style="margin: 0 0 10px 0; color: #4C63B6;">Report Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #555; font-weight: bold; width: 120px;">Reported Title:</td>
                                <td style="padding: 5px 0; color: #333;"><strong>${reportTitle}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #555; font-weight: bold;">Submission Date:</td>
                                <td style="padding: 5px 0; color: #333;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        </table>
                    </div>

                    <p style="font-size: 16px; color: #333; margin-top: 20px;">
                        The full details are available in the attached PDF file.
                    </p>
                    
                   

                    </div>
                <div style="${baseStyles.footer}">
                    © ${new Date().getFullYear()} Multaqa. All rights reserved.
                </div>
            </div>
        </div>
    `;
// Waitlist Joined Confirmation Email Template
export const getWaitlistJoinedTemplate = (
  username: string,
  eventName: string,
  eventDate: Date
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.header}">
          <h2 style="margin: 0; font-size: 22px;">📋 You're on the Waitlist!</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username} 👋,<br><br>
            You've been successfully added to the waitlist for <strong>${eventName}</strong>.
          </p>
          <div style="${baseStyles.infoBox}">
            <strong style="color: #2563eb;">Event Details:</strong><br>
            <p style="margin: 10px 0 0 0; color: #333;">
              📅 <strong>Date:</strong> ${new Date(
                eventDate
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}<br>
              🎯 <strong>Event:</strong> ${eventName}
            </p>
          </div>
          <p style="font-size: 14px; color: #555;">
            We'll notify you immediately if a spot becomes available. If someone cancels their registration, you'll receive an email with payment instructions.
          </p>
          <p style="font-size: 14px; color: #555;">
            <strong>What happens next?</strong><br>
            • You'll be notified if a spot opens up<br>
            • You can leave the waitlist anytime from your dashboard<br>
            • The waitlist operates on a first-come, first-served basis
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Waitlist Promotion Email Template (With Payment Deadline)
export const getWaitlistPromotionTemplate = (
  username: string,
  eventName: string,
  paymentDeadline: Date,
  eventId: string
): string => {
  const eventUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/events/${eventId}`;
  const hoursUntilDeadline = Math.round(
    (paymentDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60)
  );

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerSuccess}">
          <h2 style="margin: 0; font-size: 22px;">🎉 Great News! A Spot Opened Up!</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username} 👋,<br><br>
            Exciting news! A spot has become available for <strong>${eventName}</strong>, and you're next in line from the waitlist!
          </p>
          <div style="${baseStyles.successBox}">
            <strong style="color: #16a34a;">✓ Your Spot is Reserved</strong><br>
            <p style="margin: 10px 0 0 0; color: #333;">
              You now have a reserved spot for this event. Complete your payment to secure your registration.
            </p>
          </div>
          <div style="${baseStyles.warningBox}">
            <strong style="color: #ea580c;">⏰ Action Required - Payment Deadline</strong><br>
            <p style="margin: 10px 0 0 0; color: #333;">
              <strong>Deadline:</strong> ${paymentDeadline.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )} at ${paymentDeadline.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}<br>
              <strong>Time Remaining:</strong> Approximately ${hoursUntilDeadline} hours
            </p>
          </div>
          <p style="font-size: 14px; color: #555;">
            Please complete your payment within <strong>3 days</strong> to confirm your registration. If payment is not received by the deadline, your spot will be offered to the next person on the waitlist.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${eventUrl}" target="_blank" style="${
    baseStyles.buttonSuccess
  }">
              Complete Payment Now
            </a>
          </div>
          <p style="font-size: 12px; color: #888; text-align: center;">
            Or copy this link: <a href="${eventUrl}" style="color: #2563eb;">${eventUrl}</a>
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Waitlist Deadline Expired Email Template
export const getWaitlistDeadlineExpiredTemplate = (
  username: string,
  eventName: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerWarning}">
          <h2 style="margin: 0; font-size: 22px;">⏰ Payment Deadline Expired</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username} 👋,<br><br>
            We regret to inform you that the payment deadline for <strong>${eventName}</strong> has passed.
          </p>
          <div style="${baseStyles.dangerBox}">
            <strong style="color: #dc2626;">Registration Not Completed</strong><br>
            <p style="margin: 10px 0 0 0; color: #333;">
              Since payment was not received within the 3-day deadline, your reserved spot has been released and you have been <strong>removed from the waitlist</strong>. Your spot has been offered to the next person in line.
            </p>
          </div>
          <p style="font-size: 14px; color: #555;">
            <strong>What you can do:</strong><br>
            • Check if new spots are available and register directly<br>
            • Join the waitlist again (you'll be placed at the back of the queue)<br>
            • Browse other upcoming events you might be interested in
          </p>
          <p style="font-size: 14px; color: #555;">
            We understand that circumstances can change. You're welcome to register again if spots become available!
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};

// Waitlist Auto-Registration Email Template (Free Events)
export const getWaitlistAutoRegisteredTemplate = (
  username: string,
  eventName: string,
  eventDate: Date,
  location: string
): string => {
  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${baseStyles.headerSuccess}">
          <h2 style="margin: 0; font-size: 22px;">🎉 You're Registered!</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username} 👋,<br><br>
            Great news! A spot opened up for <strong>${eventName}</strong>, and you've been automatically registered!
          </p>
          <div style="${baseStyles.successBox}">
            <strong style="color: #16a34a;">✓ Registration Confirmed</strong><br>
            <p style="margin: 10px 0 0 0; color: #333;">
              You were promoted from the waitlist and your registration is now complete. No payment required!
            </p>
          </div>
          <div style="${baseStyles.infoBox}">
            <strong style="color: #2563eb;">Event Details:</strong><br>
            <p style="margin: 10px 0 0 0; color: #333;">
              📅 <strong>Date:</strong> ${new Date(
                eventDate
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}<br>
              📍 <strong>Location:</strong> ${location}<br>
              🎯 <strong>Event:</strong> ${eventName}
            </p>
          </div>
          <p style="font-size: 14px; color: #555;">
            You'll receive a reminder closer to the event date. We look forward to seeing you there!
          </p>
          <p style="font-size: 14px; color: #555;">
            If you can no longer attend, please cancel your registration so others on the waitlist can take your spot.
          </p>
        </div>
        <div style="${baseStyles.footer}">
          © ${new Date().getFullYear()} Multaqa. All rights reserved.
        </div>
      </div>
    </div>
  `;
};
