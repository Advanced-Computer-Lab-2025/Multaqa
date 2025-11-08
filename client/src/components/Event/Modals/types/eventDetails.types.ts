export interface BaseEventDetails {
  color: string;
}

export interface ConferenceDetails extends BaseEventDetails {
  location: string;
  virtualLink?: string;
  agenda?: Array<{
    time: string;
    activity: string;
  }>;
  speakers?: Array<{
    name: string;
    role: string;
    topic?: string;
  }>;
}

export interface WorkshopDetails extends BaseEventDetails {
  capacity: number;
  duration: string;
  prerequisites?: string;
  skills?: string[];
  instructors?: Array<{
    name: string;
    expertise: string;
  }>;
}

export interface BazaarDetails extends BaseEventDetails {
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  vendorCount: string;
}

export interface BoothDetails extends BaseEventDetails {
  setupDuration: string;
  boothSize: string;
  location: string;
  people: { name: string; email: string }[] 
}

export interface TripDetails extends BaseEventDetails {
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: string;
  capacity: number;
  spotsLeft: number;
}