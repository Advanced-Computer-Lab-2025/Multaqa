import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { calendarService, CalendarEvent } from "@/services/calendarService";
import { toast } from "react-toastify";

export const useGoogleCalendar = () => {
  const { user, setUser } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = calendarService.isCalendarConnected(user);

  const connectCalendar = useCallback(async () => {
    setIsConnecting(true);
    try {
      await calendarService.connectGoogleCalendar();
      
      toast.success("Google Calendar connected successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
      
      return true;
    } catch (error: any) {
      console.error("Failed to connect Google Calendar:", error);
      toast.error(error.message || "Failed to connect Google Calendar", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const addEventToCalendar = useCallback(
    async (event: CalendarEvent) => {
      try {
        const result = await calendarService.addEvent(event);
        
        toast.success("Event added to Google Calendar!", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
        });
        
        return result;
      } catch (error: any) {
        console.error("Failed to add event to calendar:", error);
        toast.error(
          error.response?.data?.message || "Failed to add event to calendar",
          {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
        throw error;
      }
    },
    []
  );

  const ensureCalendarConnected = useCallback(async () => {
    if (!isConnected) {
      return await connectCalendar();
    }
    return true;
  }, [isConnected, connectCalendar]);

  return {
    isConnected,
    isConnecting,
    connectCalendar,
    addEventToCalendar,
    ensureCalendarConnected,
  };
};
