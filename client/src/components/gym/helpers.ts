import { GymSession, GymSessionType } from "./types";

export const ALLOWED = new Set(["YOGA", "PILATES", "AEROBICS", "ZUMBA", "CROSS_CIRCUIT", "KICK_BOXING"]);

export const mapServerToClient = (s: any): GymSession => {
  const start = new Date(s.eventStartDate);
  const startIso = start.toISOString();
  let endIso = startIso;
  if (s.eventEndTime) {
    const [h, m] = String(s.eventEndTime).split(":").map((n) => Number(n));
    if (!Number.isNaN(h)) {
      const d = new Date(start);
      d.setHours(h, Number.isNaN(m) ? 0 : m, 0, 0);
      endIso = d.toISOString();
    }
  }

  const normalized = String(s.sessionType ?? "").trim().toUpperCase().replace(/\s+|-/g, "_");
  const type = (ALLOWED.has(normalized) ? normalized : "YOGA") as GymSessionType;

  return {
    id: s._id ?? `${s.eventName}-${startIso}`,
    title: s.eventName ?? s.sessionType ?? "Gym Session",
    type,
    start: startIso,
    end: endIso,
    instructor: s.trainer ?? undefined,
    location: s.location ?? "Gym",
    spotsTotal: s.spotsTotal ?? 20,
    spotsTaken: s.spotsTaken ?? 0,
  } as GymSession;
};

export const FILTER_CHIPS = [
  { key: "ALL", label: "All" },
  { key: "YOGA", label: "YOGA" },
  { key: "PILATES", label: "PILATES" },
  { key: "AEROBICS", label: "AEROBICS" },
  { key: "ZUMBA", label: "ZUMBA" },
  { key: "CROSS_CIRCUIT", label: "CROSS_CIRCUIT" },
  { key: "KICK_BOXING", label: "KICK_BOXING" },
] as const;
