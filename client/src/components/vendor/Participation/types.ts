export type VendorEventType = 'BAZAAR' | 'PLATFORM_BOOTH';

export type VendorRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface VendorParticipationItem {
  id: string;
  title: string;
  type: VendorEventType;
  location: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string for bazaars spanning days
  setupDurationWeeks?: number; // for platform booth
}

export interface VendorRequestItem extends VendorParticipationItem {
  status: VendorRequestStatus;
  submittedAt: string; // ISO
  notes?: string;
  eventId?:string;
}
