// Base signup request (common fields)
export interface BaseSignupRequest {
  email: string;
  password: string;
}

// Student signup request
export interface StudentAndStaffSignupRequest extends BaseSignupRequest {
  firstName: string;
  lastName: string;
  gucId: string;
}

// Vendor signup request
export interface VendorSignupRequest extends BaseSignupRequest {
  companyName: string;
  taxCard: string;   
  logo: string;
}

// Administration signup request (admin/event office)
// created by super admin, not public signup
export interface CreateAdminRequest extends BaseSignupRequest {
  name: string;
  role: string;
}

// Union type for all signup requests
export type SignupRequest =
  | StudentAndStaffSignupRequest
  | VendorSignupRequest;
  
// Login request (for all users)
export interface LoginRequest {
  email: string;
  password: string;
}