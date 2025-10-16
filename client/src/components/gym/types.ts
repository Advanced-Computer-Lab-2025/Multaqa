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
