"use client";

import React from "react";
import { Typography } from "@mui/material";
import ActionCard from "@/components/shared/cards/ActionCard";
import { GymSession, GymSessionType, SESSION_LABEL } from "./types";

type Props = {
  session: GymSession;
  showSpots?: boolean;
};

const typeColors: Record<GymSessionType, { bg: string; fg: string }> = {
  YOGA: { bg: "#c8e6c9", fg: "#1E1E1E" },
  PILATES: { bg: "#ffe0b2", fg: "#1E1E1E" },
  AEROBICS: { bg: "#bbdefb", fg: "#1E1E1E" },
  ZUMBA: { bg: "#f8bbd0", fg: "#1E1E1E" },
  CROSS_CIRCUIT: { bg: "#e6ee9c", fg: "#1E1E1E" },
  KICK_BOXING: { bg: "#ffccbc", fg: "#1E1E1E" },
};

export default function GymSessionCard({ session, showSpots = true }: Props) {
  const c = typeColors[session.type];
  const start = new Date(session.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const end = new Date(session.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const spotsLeft = (session.spotsTotal ?? 0) - (session.spotsTaken ?? 0);

  const tags: Array<{ label: React.ReactNode } & Partial<import("@mui/material").ChipProps>> = [
    { label: SESSION_LABEL[session.type], sx: { bgcolor: c.bg, color: c.fg, fontWeight: 600 } },
  ];

  return (
    <ActionCard
      title={`${SESSION_LABEL[session.type]} — ${session.title}`}
      tags={tags}
      subtitleNode={<Typography variant="body2" sx={{ color: "#6299d0" }}>{session.location ?? "Main Gym"}</Typography>}
      metaNodes={[
        <Typography key="time" variant="body2" sx={{ color: "#6b7280" }}>{start} – {end} · Instructor: {session.instructor ?? "TBA"}</Typography>,
        showSpots ? (
          <Typography key="spots" variant="caption" sx={{ color: "#6b7280" }}>{spotsLeft} spots left</Typography>
        ) : null,
      ].filter(Boolean) as React.ReactNode[]}
      borderColor={c.bg}
    />
  );
}
