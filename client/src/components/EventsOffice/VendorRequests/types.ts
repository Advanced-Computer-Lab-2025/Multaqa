export type VendorRequestStatus = "pending" | "approved" | "rejected";

export type VendorEventKind = "bazaar" | "platform_booth" | "unknown";

export interface VendorContact {
  name?: string;
  email?: string;
  nationalIdUrl?: string;
  taxCardUrl?: string;
}

export interface VendorParticipationRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorLogo?: string;
  vendorRole?: string;
  eventId: string;
  eventName: string;
  eventType: VendorEventKind;
  location?: string;
  startDate?: string;
  endDate?: string;
  status: VendorRequestStatus;
  boothSize?: string;
  boothLocation?: string;
  boothSetupDurationWeeks?: number;
  attendees?: VendorContact[];
  submittedAt?: string;
  notes?: string;
  raw?: unknown;
}

export type StatusFilter = "ALL" | "pending" | "approved" | "rejected";
export type TypeFilter = "ALL" | "bazaar" | "platform_booth";
