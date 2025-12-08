import { api } from "@/api";

export interface CalendarEvent {
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

      // Poll to check if popup is closed
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer);
          // Wait a bit for the callback to complete and user data to refresh
          setTimeout(() => {
            resolve();
          }, 1000);
        }
      }, 500);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollTimer);
        if (popup && !popup.closed) {
          popup.close();
        }
        reject(new Error("Calendar connection timeout"));
      }, 5 * 60 * 1000);
    });
  },
};
