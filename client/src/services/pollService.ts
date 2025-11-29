import { Poll, CreatePollDTO } from "@/types/poll";
import { api } from "@/api";

// Interface for registered vendor from backend
export interface RegisteredVendor {
  vendorId: string;
  companyName: string;
  logo?: {
    url?: string;
    publicId?: string;
  };
}

// Interface for overlapping vendor from backend
export interface OverlappingVendor {
  vendorId: string;
  companyName: string;
  eventId: string;
  eventName: string;
  boothLocation: string;
  boothSize?: string;
  boothSetupDuration?: number;
  logo?: {
    url?: string;
    publicId?: string;
  };
}

// Interface for a clash group (vendors competing for the same location)
export interface VendorClashGroup {
  location: string;
  vendorCount: number;
  vendors: OverlappingVendor[];
}

// Interface for poll from backend API
interface BackendPoll {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  deadlineDate: string;
  options: Array<{
    vendorId: string;
    vendorName: string;
    vendorLogo?: string;
    voteCount: number;
  }>;
  votes: Array<{
    userId: string;
    vendorId: string;
    votedAt: string;
  }>;
  isActive: boolean;
  createdAt: string;
  hasVoted?: boolean;
}

// Transform backend poll to frontend poll format
const transformPoll = (backendPoll: BackendPoll): Poll & { hasVoted?: boolean } => ({
  id: backendPoll._id,
  title: backendPoll.title,
  description: backendPoll.description,
  startDate: backendPoll.startDate,
  endDate: backendPoll.deadlineDate,
  options: backendPoll.options,
  isActive: backendPoll.isActive,
  createdAt: backendPoll.createdAt,
  hasVoted: backendPoll.hasVoted,
});

/**
 * Get all registered vendors for poll creation (Events Office only)
 */
export const getRegisteredVendors = async (): Promise<RegisteredVendor[]> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: RegisteredVendor[];
      message: string;
    }>("/vendorEvents/registered-vendors");
    
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch registered vendors:", error);
    throw error;
  }
};

/**
 * Get vendors with overlapping booth requests for poll creation (Events Office only)
 * Returns vendors who have pending booth requests for the same location, grouped by clash
 */
export const getOverlappingVendors = async (): Promise<VendorClashGroup[]> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        location: string;
        vendorCount: number;
        vendors: Array<{
          eventId: string;
          eventName: string;
          vendor: {
            _id: string;
            companyName: string;
            logo?: { url?: string; publicId?: string };
            email?: string;
          };
          boothSize?: string;
          boothSetupDuration?: number;
        }>;
      }>;
      message: string;
    }>("/vendorEvents/overlapping-booth-requests");
    
    // Transform into clash groups
    const clashGroups: VendorClashGroup[] = response.data.data.map(group => ({
      location: group.location,
      vendorCount: group.vendorCount,
      vendors: group.vendors.map(v => ({
        vendorId: v.vendor._id,
        companyName: v.vendor.companyName,
        eventId: v.eventId,
        eventName: v.eventName,
        boothLocation: group.location,
        boothSize: v.boothSize,
        boothSetupDuration: v.boothSetupDuration,
        logo: v.vendor.logo,
      })),
    }));
    
    return clashGroups;
  } catch (error: any) {
    console.error("Failed to fetch overlapping vendors:", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch vendors";
    throw new Error(errorMessage);
  }
};

/**
 * Create a new poll (Events Office only)
 */
export const createPoll = async (data: CreatePollDTO): Promise<Poll> => {
  try {
    const response = await api.post<{
      success: boolean;
      data: BackendPoll;
      message: string;
    }>("/vendorEvents/polls", {
      title: data.title,
      description: data.description,
      deadlineDate: data.endDate.toISOString(),
      vendorIds: data.vendorRequestIds, // These are now vendor IDs, not request IDs
    });
    
    return transformPoll(response.data.data);
  } catch (error: any) {
    console.error("Failed to create poll:", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to create poll";
    throw new Error(errorMessage);
  }
};

/**
 * Get all polls (Events Office only - for management)
 */
export const getAllPolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: BackendPoll[];
      message: string;
    }>("/vendorEvents/polls");
    
    return response.data.data.map(transformPoll);
  } catch (error) {
    console.error("Failed to fetch all polls:", error);
    throw error;
  }
};

/**
 * Get active polls (for students/staff to vote)
 * Includes hasVoted field for each poll
 */
export const getActivePolls = async (): Promise<(Poll & { hasVoted?: boolean })[]> => {
  try {
    const response = await api.get<{
      success: boolean;
      data: BackendPoll[];
      message: string;
    }>("/vendorEvents/polls");
    
    // Filter for active polls only
    const activePolls = response.data.data.filter(poll => poll.isActive);
    
    return activePolls.map(transformPoll);
  } catch (error) {
    console.error("Failed to fetch active polls:", error);
    throw error;
  }
};

/**
 * Vote in a poll
 * @param pollId The poll ID
 * @param vendorId The vendor ID to vote for
 */
export const votePoll = async (pollId: string, vendorId: string): Promise<Poll> => {
  try {
    const response = await api.post<{
      success: boolean;
      data: BackendPoll;
      message: string;
    }>(`/vendorEvents/polls/${pollId}/vote/${vendorId}`);
    
    return transformPoll(response.data.data);
  } catch (error: any) {
    // Re-throw with user-friendly message
    const message = error.response?.data?.message || "Failed to submit vote";
    throw new Error(message);
  }
};