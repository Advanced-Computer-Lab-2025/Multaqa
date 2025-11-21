const baseStyles = {
  container: "font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8f9fb; padding: 40px 0;",
  card: "max-width: 600px; background-color: #ffffff; margin: auto; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); overflow: hidden;",
  header: "background-color: #2563eb; color: #ffffff; padding: 20px 30px; text-align: center;",
  headerDanger: "background-color: #dc2626; color: #ffffff; padding: 20px 30px; text-align: center;",
  headerSuccess: "background-color: #16a34a; color: #ffffff; padding: 20px 30px; text-align: center;",
  headerWarning: "background-color: #ea580c; color: #ffffff; padding: 20px 30px; text-align: center;",
  content: "padding: 30px;",
  button: "background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;",
  buttonSuccess: "background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;",
  footer: "background-color: #f1f5f9; color: #555; font-size: 12px; text-align: center; padding: 15px;",
  infoBox: "background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;",
  warningBox: "background-color: #fef3c7; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; border-radius: 4px;",
  successBox: "background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px;",
  dangerBox: "background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;",
};

// Verification Email Template
export const getVerificationEmailTemplate = (username: string, verificationLink: string): string => {
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
            <a href="${verificationLink}" target="_blank" style="${baseStyles.button}">
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
export const getBlockUnblockEmailTemplate = (isBlocked: boolean, reason?: string): string => {
  const headerStyle = isBlocked ? baseStyles.headerDanger : baseStyles.headerSuccess;
  const title = isBlocked ? 'Account Suspended' : 'Account Restored';
  const emoji = isBlocked ? '⚠️' : '✅';

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${headerStyle}">
          <h2 style="margin: 0; font-size: 22px;">${emoji} ${title}</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi,<br><br>
            ${isBlocked
      ? 'We regret to inform you that your Multaqa account has been suspended.'
      : 'Good news! Your Multaqa account has been restored and you can now access all platform features.'}
          </p>
          ${isBlocked
      ? `<div style="${baseStyles.dangerBox}">
                <strong style="color: #dc2626;">Reason for suspension:</strong><br>
                <p style="margin: 10px 0 0 0; color: #333;">${reason || 'Violation of platform policies'}</p>
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
export const getStaffRoleAssignmentTemplate = (username: string, role: string, verificationLink: string): string => {
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
            <a href="${verificationLink}" target="_blank" style="${baseStyles.buttonSuccess}">
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
          ${eventName
      ? `<p style="font-size: 14px; color: #666;">
                <strong>Event:</strong> ${eventName}
              </p>`
      : ''
    }
          <div style="${baseStyles.warningBox}">
            <strong style="color: #ea580c;">Deleted Comment:</strong>
            <p style="margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 4px; color: #333; font-style: italic;">
              "${commentText.length > 200 ? commentText.substring(0, 200) + '...' : commentText}"
            </p>
          </div>
          <div style="${baseStyles.dangerBox}">
            <strong style="color: #dc2626;">Reason for Deletion:</strong>
            <p style="margin: 10px 0 0 0; color: #333;">${deletionReason}</p>
          </div>
          <div style="${baseStyles.infoBox}">
            <p style="margin: 0; color: #333;">
              <strong>Warning Count:</strong> ${warningCount}/3<br><br>
              ${warningCount >= 3
      ? '⚠️ <strong style="color: #dc2626;">Your account may be subject to suspension.</strong>'
      : 'Please ensure future comments comply with our community guidelines to avoid account suspension.'}
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
                <td style="padding: 15px 0 8px 0; color: #16a34a; font-weight: bold; font-size: 18px;">${currency} ${amount.toFixed(2)}</td>
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
  applicationType: 'bazaar' | 'booth',
  applicationName: string,
  status: 'accepted' | 'rejected',
  rejectionReason: string | undefined,
  nextSteps: string | undefined,
): string => {
  const isAccepted = status === 'accepted';
  const headerStyle = isAccepted ? baseStyles.headerSuccess : baseStyles.headerDanger;
  const title = isAccepted ? 'Application Accepted' : 'Application Status Update';
  const emoji = isAccepted ? '✅' : '❌';
  const typeLabel = applicationType === 'bazaar' ? 'Bazaar' : 'Booth';

  return `
    <div style="${baseStyles.container}">
      <div style="${baseStyles.card}">
        <div style="${headerStyle}">
          <h2 style="margin: 0; font-size: 22px;">${emoji} ${title}</h2>
        </div>
        <div style="${baseStyles.content}">
          <p style="font-size: 16px; color: #333;">
            Hi ${username},<br><br>
            We have reviewed your application to ${applicationType === 'bazaar' ? 'join the bazaar' : 'apply for a booth'}.
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
                <td style="padding: 8px 0; color: ${isAccepted ? '#16a34a' : '#dc2626'}; font-weight: bold; text-transform: uppercase;">
                  ${status}
                </td>
              </tr>
            </table>
          </div>
          ${isAccepted
      ? `<div style="${baseStyles.successBox}">
                <p style="margin: 0; color: #333;">
                  <strong style="color: #16a34a;">Congratulations!</strong><br><br>
                  Your application has been approved. We're excited to have you participate in our ${typeLabel.toLowerCase()}.
                </p>
              </div>
              ${nextSteps
        ? `<div style="${baseStyles.infoBox}">
                    <strong style="color: #2563eb;">Next Steps:</strong>
                    <p style="margin: 10px 0 0 0; color: #333;">${nextSteps}</p>
                  </div>`
        : ''
      }`
      : `<div style="${baseStyles.dangerBox}">
                <strong style="color: #dc2626;">Application Not Approved</strong>
                <p style="margin: 10px 0 0 0; color: #333;">
                  We regret to inform you that your application was not approved at this time.
                </p>
              </div>
              ${rejectionReason
        ? `<div style="${baseStyles.warningBox}">
                    <strong style="color: #ea580c;">Reason:</strong>
                    <p style="margin: 10px 0 0 0; color: #333;">${rejectionReason}</p>
                  </div>`
        : ''
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

export const getGymSessionNotificationTemplate = (
  username: string,
  sessionName: string,
  actionType: "cancelled" | "edited",
  oldDetails?: {
    date: Date;
    time: string;
    location: string;
    instructor?: string;
  },
  newDetails?: {
    date: Date;
    time: string;
    location: string;
    instructor?: string;
  }
) => {
  const actionMessage = actionType === "cancelled" 
    ? `<p style="color: #dc3545; font-weight: bold;">This session has been cancelled.</p>`
    : `<p style="color: #ffc107; font-weight: bold;">This session has been updated with new details.</p>`;

  const detailsSection = actionType === "cancelled"
    ? `
      <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #721c24; margin-top: 0;">Cancelled Session Details:</h3>
        <p><strong>Date:</strong> ${oldDetails?.date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${oldDetails?.time}</p>
        <p><strong>Location:</strong> ${oldDetails?.location}</p>
        ${oldDetails?.instructor ? `<p><strong>Instructor:</strong> ${oldDetails.instructor}</p>` : ''}
      </div>
      <p>We apologize for any inconvenience. Please check our schedule for alternative sessions.</p>
    `
    : `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0;">Original Details:</h3>
        <p><strong>Date:</strong> ${oldDetails?.date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${oldDetails?.time}</p>
        <p><strong>Location:</strong> ${oldDetails?.location}</p>
        ${oldDetails?.instructor ? `<p><strong>Instructor:</strong> ${oldDetails.instructor}</p>` : ''}
      </div>
      <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #155724; margin-top: 0;">New Details:</h3>
        <p><strong>Date:</strong> ${newDetails?.date.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${newDetails?.time}</p>
        <p><strong>Location:</strong> ${newDetails?.location}</p>
        ${newDetails?.instructor ? `<p><strong>Instructor:</strong> ${newDetails.instructor}</p>` : ''}
      </div>
      <p>Your registration has been automatically transferred to the updated session.</p>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏋️ Gym Session ${actionType === "cancelled" ? "Cancelled" : "Updated"}</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${username}</strong>,</p>
          ${actionMessage}
          <p>The gym session "<strong>${sessionName}</strong>" that you registered for has been ${actionType}.</p>
          ${detailsSection}
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>The Multaqa Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Multaqa. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};