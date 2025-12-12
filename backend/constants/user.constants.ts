export enum UserRole {
  STUDENT = "student",
  STAFF_MEMBER = "staffMember",
  VENDOR = "vendor",
  ADMINISTRATION = "administration",
  USHER_ADMIN = "usherAdmin",
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export enum Event_Request_Status {
  PENDING = "pending",
  AWAITING_REVIEW = "awaiting_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum NotificationType {
  WORKSHOP_REQUEST_SUBMITTED = "WORKSHOP_REQUEST_SUBMITTED",
  WORKSHOP_STATUS_CHANGED = "WORKSHOP_STATUS_CHANGED",
  EVENT_NEW = "EVENT_NEW",
  EVENT_REMINDER = "EVENT_REMINDER",
  LOYALTY_NEW_PARTNER = "LOYALTY_NEW_PARTNER",
  VENDOR_PENDING_REQUEST = "VENDOR_PENDING_REQUEST",
  BUG_RESOLVED = "BUG_RESOLVED",
  COMMENT_FLAGGED = "COMMENT_FLAGGED",
  BUG_RESOLVED = "BUG_RESOLVED",
}