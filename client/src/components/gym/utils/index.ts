import { api } from "@/api";
import { AxiosError } from "axios";
import { GymSession, GymSessionType } from "../types";
import {
  CreateGymSessionResponse,
  GetAllGymSessionsResponse,
} from "../../../../../backend/interfaces/responses/gymSessionsResponses.interface";
import { GYM_SESSION_TYPES } from "../../../../../backend/constants/gymSessions.constants";

// Map frontend session type to backend session type
const mapSessionTypeToBackend = (type: GymSessionType): string => {
  const mapping: Record<GymSessionType, string> = {
    YOGA: GYM_SESSION_TYPES.YOGA,
    PILATES: GYM_SESSION_TYPES.PILATES,
    AEROBICS: GYM_SESSION_TYPES.AEROBICS,
    ZUMBA: GYM_SESSION_TYPES.ZUMBA,
    CROSS_CIRCUIT: GYM_SESSION_TYPES.CROSS_CIRCUIT,
    KICK_BOXING: GYM_SESSION_TYPES.KICK_BOXING,
  };
  return mapping[type];
};

// Map backend session type to frontend session type
const mapSessionTypeToFrontend = (backendType: string): GymSessionType => {
  const mapping: Record<string, GymSessionType> = {
    [GYM_SESSION_TYPES.YOGA]: "YOGA",
    [GYM_SESSION_TYPES.PILATES]: "PILATES",
    [GYM_SESSION_TYPES.AEROBICS]: "AEROBICS",
    [GYM_SESSION_TYPES.ZUMBA]: "ZUMBA",
    [GYM_SESSION_TYPES.CROSS_CIRCUIT]: "CROSS_CIRCUIT",
    [GYM_SESSION_TYPES.KICK_BOXING]: "KICK_BOXING",
  };
  return mapping[backendType] || "YOGA";
};

// Format time from Date to HH:MM string
const formatTimeToHHMM = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Combine date and time strings to create ISO timestamp
const combineDateTime = (dateStr: string, timeStr: string): string => {
  const date = new Date(dateStr);
  const [hours, minutes] = timeStr.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// Fetch all gym sessions
export const fetchGymSessions = async (date?: Date): Promise<GymSession[]> => {
  try {
    console.log("📋 Fetching gym sessions...", date ? `for ${date.toISOString()}` : "");

    // Build query params
    const params = date ? { date: date.toISOString() } : {};

    const response = await api.get<GetAllGymSessionsResponse>("/gymsessions", { params });
    const sessions = response.data.data;

    console.log(`✅ Found ${sessions.length} gym session(s)`);

    // Map backend data to GymSession interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sessions.map((session: any) => {
      const startDateTime = combineDateTime(
        session.eventStartDate,
        session.eventStartTime
      );
      const endDateTime = combineDateTime(
        session.eventEndDate || session.eventStartDate,
        session.eventEndTime
      );

      return {
        id: session._id,
        title: session.eventName || `${session.sessionType} Session`,
        type: mapSessionTypeToFrontend(session.sessionType),
        instructor: session.trainer || undefined,
        location: session.location || "Gym",
        start: startDateTime,
        end: endDateTime,
        spotsTotal: session.capacity || 0,
        spotsTaken: session.attendees?.length || 0,
      };
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("❌ Failed to fetch gym sessions:", errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error("❌ Failed to fetch gym sessions:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch gym sessions");
  }
};

// Create a new gym session
export const createGymSession = async (
  sessionData: {
    startDateTime: Date;
    duration: number;
    type: GymSessionType;
    maxParticipants: number;
    trainer?: string;
  }
): Promise<GymSession> => {
  try {
    console.log("🏋️ Creating gym session...", sessionData);

    // Extract date and time from startDateTime
    const sessionDate = new Date(sessionData.startDateTime);
    const time = formatTimeToHHMM(sessionDate);

    // Prepare backend payload
    const payload = {
      date: sessionDate.toISOString(),
      time: time,
      duration: sessionData.duration,
      sessionType: mapSessionTypeToBackend(sessionData.type),
      capacity: sessionData.maxParticipants,
      ...(sessionData.trainer && { trainer: sessionData.trainer }),
    };

    console.log("📤 Sending payload:", payload);

    const response = await api.post<CreateGymSessionResponse>(
      "/gymsessions",
      payload
    );

    const createdSession = response.data.data;

    console.log("✅ Gym session created successfully:", response.data.message);

    // Map backend response to frontend format
    const startDateTime = combineDateTime(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (createdSession as any).eventStartDate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (createdSession as any).eventStartTime
    );
    const endDateTime = combineDateTime(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (createdSession as any).eventEndDate || (createdSession as any).eventStartDate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (createdSession as any).eventEndTime
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (createdSession as any)._id || (createdSession as any).id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: (createdSession as any).eventName || `${sessionData.type} Session`,
      type: sessionData.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instructor: (createdSession as any).trainer || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      location: (createdSession as any).location || "Gym",
      start: startDateTime,
      end: endDateTime,
      spotsTotal: sessionData.maxParticipants,
      spotsTaken: 0,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("❌ Failed to create gym session:", errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error("❌ Failed to create gym session:", error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to create gym session");
  }
};

export const editGymSession = async (
  sessionId: string,
  sessionData: {
    startDateTime: Date;
    duration: number; // in minutes
    type: GymSessionType;
    maxParticipants: number;
    trainer?: string;
    title?: string;
    location?: string;
  }
): Promise<GymSession> => {
  try {
    console.log(`✏️ Updating gym session ${sessionId}...`, sessionData);

    // 1. Extract date and time from startDateTime
    const sessionDate = new Date(sessionData.startDateTime);
    const time = formatTimeToHHMM(sessionDate);

    // 2. Prepare backend payload (ensuring to map frontend names to backend names)
    const payload = {
      // Backend expects 'date' and 'time' fields for the start
      date: sessionDate.toISOString(), 
      time: time,
      duration: sessionData.duration,
    };

    console.log("📤 Sending update payload:", payload);

    // 3. Send PATCH request using the correct RESTful endpoint structure
    // NOTE: Using '/gymsessions/' (plural, no hyphen) to resolve the 404 error
    const response = await api.patch(
      `/gymsessions/${sessionId}`,
      payload
    );

    const updatedSession = response.data.data;
    console.log("✅ Gym session updated successfully:", response.data.message);

    // 4. Map the backend response back to the GymSession interface (similar to fetch logic)
    // NOTE: This complex mapping ensures the returned object is compatible with your list state
    const startDateTime = combineDateTime(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedSession as any).eventStartDate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedSession as any).eventStartTime
    );
    const endDateTime = combineDateTime(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedSession as any).eventEndDate || (updatedSession as any).eventStartDate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updatedSession as any).eventEndTime
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (updatedSession as any)._id || (updatedSession as any).id,
      title: sessionData.title || updatedSession.eventName, // Use frontend title if available
      type: sessionData.type,
      instructor: sessionData.trainer || updatedSession.trainer,
      location: sessionData.location || updatedSession.location || "Gym",
      start: startDateTime,
      end: endDateTime,
      spotsTotal: sessionData.maxParticipants,
      spotsTaken: updatedSession.attendees?.length || 0,
    };

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error(`❌ Failed to update gym session ${sessionId}:`, errorMessage);
      throw new Error(errorMessage);
    }
    // Handle generic errors
    if (error instanceof Error) {
      console.error(`❌ Failed to update gym session ${sessionId}:`, error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to update gym session");
  }
};

export const cancelGymSession = async (sessionId: string): Promise<void> => {
  try {
    console.log(`🗑️ Deleting gym session ${sessionId}...`);

    // Use DELETE method on the RESTful endpoint /gymsessions/:id
    const response = await api.delete(`/gymsessions/${sessionId}`);

    console.log("✅ Gym session deleted successfully:", response.data.message);
    
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      // The backend should return a 401/404/400 error with a specific message
      const errorMessage = error.response?.data?.error || error.message;
      console.error(`❌ Failed to cancel gym session ${sessionId}:`, errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error(`❌ Failed to cancel gym session ${sessionId}:`, error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to cancel gym session");
  }
};

export const registerForGymSession = async (sessionId: string): Promise<void> => {
  try {
    console.log(`📝 Registering for gym session ${sessionId}...`);

    const response = await api.post(`/gymsessions/${sessionId}/register`);

    console.log("✅ Successfully registered for gym session:", response.data.message);
    
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error(`❌ Failed to register for gym session ${sessionId}:`, errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error(`❌ Failed to register for gym session ${sessionId}:`, error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to register for gym session");
  }
};

