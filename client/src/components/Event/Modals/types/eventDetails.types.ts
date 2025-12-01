export interface BaseEventDetails {
  color: string;
}
  
export interface ConferenceDetails extends BaseEventDetails {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  link?: string;
  resources:string,
  funding:string,
  budget:string,
  
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
  userRole?: string;
}
export interface VendorLogo {
  url: string;
  publicId: string;
  originalName: string;
  uploadedAt: string; // Typically an ISO 8601 string
}

interface Vendor {
  companyName: string;
  email: string;
  id?: string;
  _id?: string;
  role?: string;
  logo?: VendorLogo;
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
  userRole?: string;
  eventId: string;
}

export interface BoothDetails extends BaseEventDetails {
  setupDuration: string;
  boothSize: string;
  location: string;
  people: { name: string; email: string }[] 
  userRole?: string;
  eventId: string;
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
  userRole?: string;
}