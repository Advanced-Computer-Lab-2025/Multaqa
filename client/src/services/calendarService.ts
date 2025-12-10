import { api } from "@/api";
import { MeResponse } from "../../../backend/interfaces/responses/authResponses.interface";

export interface CalendarEvent {
  eventId: string;
  title: string;
  description?: string;
  startISO: string;
  endISO: string;
}

export const calendarService = {
  /**
   * Get the Google Calendar OAuth URL
   */
  async getAuthUrl(): Promise<string> {
    const response = await api.get("/calendar/auth/google/url");
    return response.data.url;
  },

  /**
   * Add an event to the user's Google Calendar
   */
  async addEvent(event: CalendarEvent): Promise<any> {
    const response = await api.post("/calendar/add-event", event);
    return response.data;
  },

  /**
   * Check if user has connected their Google Calendar
   */
  isCalendarConnected(user: any): boolean {
    return !!(user?.googleCalendar?.access_token);
  },

  /**
   * Open Google Calendar OAuth window
   */
  async connectGoogleCalendar(): Promise<void> {
    const url = await this.getAuthUrl();

    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        url,
        "Google Calendar",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === "CALENDAR_AUTH_SUCCESS") {
          window.removeEventListener("message", handleMessage);
          clearInterval(pollTimer);
          clearTimeout(timeoutId);

          // Refetch user data to get updated calendar tokens
          try {
            const meRes = await api.get<MeResponse>("/auth/me");
            // Import setUserFn from api to update user context
            const { setUserFn } = await import("@/api");
            if (setUserFn && meRes.data?.user) {
              setUserFn(meRes.data.user);
            }
          } catch (err) {
            console.error("Failed to refresh user after calendar auth:", err);
          }

          resolve();
        }
      };

      window.addEventListener("message", handleMessage);

      // Poll to check if popup is closed
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer);
          window.removeEventListener("message", handleMessage);
          // Wait a bit for the callback to complete
          setTimeout(() => {
            resolve();
          }, 1000);
        }
      }, 500);

      // Timeout after 5 minutes
      const timeoutId = setTimeout(() => {
        clearInterval(pollTimer);
        window.removeEventListener("message", handleMessage);
        if (popup && !popup.closed) {
          popup.close();
        }
        reject(new Error("Calendar connection timeout"));
      }, 5 * 60 * 1000);
    });
  },
};
