import { api } from "@/api";

export interface WaitlistStatusResponse {
  success: boolean;
  data: {
    isOnWaitlist: boolean;
    status?: "waitlist" | "pending_payment";
    paymentDeadline?: string;
    joinedAt?: string;
  };
}

export interface WaitlistActionResponse {
  success: boolean;
  message: string;
}

/**
 * Join the waitlist for an event (Trip or Workshop)
 * @param eventId - The ID of the event to join waitlist for
 */
export const joinWaitlist = async (eventId: string): Promise<WaitlistActionResponse> => {
  const res = await api.post<WaitlistActionResponse>(`/waitlist/${eventId}`);
  return res.data;
};

/**
 * Leave the waitlist for an event
 * @param eventId - The ID of the event to leave waitlist for
 */
export const leaveWaitlist = async (eventId: string): Promise<WaitlistActionResponse> => {
  const res = await api.delete<WaitlistActionResponse>(`/waitlist/${eventId}`);
  return res.data;
};

/**
 * Get waitlist status for current user on an event
 * @param eventId - The ID of the event to check status for
 */
export const getWaitlistStatus = async (eventId: string): Promise<WaitlistStatusResponse> => {
  const res = await api.get<WaitlistStatusResponse>(`/waitlist/${eventId}`);
  return res.data;
};
