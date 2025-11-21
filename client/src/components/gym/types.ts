export type GymSessionType = "YOGA" | "PILATES" | "AEROBICS" | "ZUMBA" | "CROSS_CIRCUIT" | "KICK_BOXING";

export type GymSession = {
  id: string;
  title: string;
  type: GymSessionType;
  instructor?: string;
  location?: string;
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  spotsTotal?: number;
  spotsTaken?: number;
};

export const SESSION_LABEL: Record<GymSessionType, string> = {
  YOGA: "Yoga",
  PILATES: "Pilates",
  AEROBICS: "Aerobics",
  ZUMBA: "Zumba",
  CROSS_CIRCUIT: "Cross Circuit",
  KICK_BOXING: "Kick-boxing",
};

export const SESSION_COLORS: Record<GymSessionType, string> = {
  YOGA: "#4caf50", // Green
  PILATES: "#2196f3", // Blue
  AEROBICS: "#e91e63", // Pink
  ZUMBA: "#e91e63", // Pink
  CROSS_CIRCUIT: "#9c27b0", // Purple
  KICK_BOXING: "#f44336", // Red
};
