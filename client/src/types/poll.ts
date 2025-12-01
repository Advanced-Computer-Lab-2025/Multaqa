export interface PollOption {
  vendorId: string;
  vendorName: string;
  vendorLogo?: string;
  voteCount: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO Date string
  endDate: string;   // ISO Date string
  options: PollOption[];
  isActive: boolean;
  createdAt: string;
  hasVoted?: boolean; // Whether the current user has voted in this poll
}

export interface CreatePollDTO {
  title: string;
  description: string;
  endDate: Date;
  vendorData: Array<{ vendorId: string; boothId: string }>; // Vendor IDs with their booth/event IDs
}
