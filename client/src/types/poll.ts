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
}

export interface CreatePollDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  vendorRequestIds: string[]; // IDs of the vendor requests to include in the poll
}
