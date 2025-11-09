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
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  cost: string;
  capacity: number;
  spotsLeft: number;
  faculty:string,
  resources:string,
  funding:string,
  budget:string,
  professors:string[];
}

interface Vendor {
  companyName: string;
  email: string;
  id?: string;
  _id?: string;
  role?: string;
  logo?: string;
}

export interface BazaarDetails extends BaseEventDetails {
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  vendors: Vendor[];
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