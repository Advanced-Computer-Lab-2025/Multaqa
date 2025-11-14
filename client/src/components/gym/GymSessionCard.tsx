"use client";

import React from "react";
import { Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ActionCard from "@/components/shared/cards/ActionCard";
import { GymSession, SESSION_LABEL, SESSION_COLORS } from "./types";

type Props = {
  session: GymSession;
  showSpots?: boolean;
};

export default function GymSessionCard({ session, showSpots = true }: Props) {
  const baseColor = SESSION_COLORS[session.type];
  const chipBackground = alpha(baseColor, 0.08);
  const chipBorder = alpha(baseColor, 0.4);
  const start = new Date(session.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const end = new Date(session.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const spotsLeft = (session.spotsTotal ?? 0) - (session.spotsTaken ?? 0);

  const tags: Array<{ label: React.ReactNode } & Partial<import("@mui/material").ChipProps>> = [
    {
      label: SESSION_LABEL[session.type],
      variant: "outlined",
      sx: {
        backgroundColor: chipBackground,
        color: baseColor,
        fontWeight: 700,
        fontFamily: "var(--font-poppins)",
        letterSpacing: 0.4,
        borderRadius: "999px",
        border: `1px solid ${chipBorder}`,
        height: 24,
        "& .MuiChip-label": {
          px: 1.25,
        },
        "&:hover": {
          backgroundColor: alpha(baseColor, 0.16),
          borderColor: baseColor,
        },
      },
    },
  ];

  return (
    <ActionCard
      title={`${SESSION_LABEL[session.type]} — ${session.title}`}
      tags={tags}
      subtitleNode={
        <Typography
          variant="body2"
          sx={{ color: alpha(baseColor, 0.8), fontWeight: 600 }}
        >
          {session.location ?? "Main Gym"}
        </Typography>
      }
      metaNodes={[
        <Typography key="time" variant="body2" sx={{ color: alpha(baseColor, 0.8) }}>
          {start} – {end} · Instructor: {session.instructor ?? "TBA"}
        </Typography>,
        showSpots ? (
          <Typography key="spots" variant="caption" sx={{ color: alpha(baseColor, 0.65), fontWeight: 600 }}>
            {spotsLeft} spots left
          </Typography>
        ) : null,
      ].filter(Boolean) as React.ReactNode[]}
      borderColor={alpha(baseColor, 0.3)}
      background={alpha(baseColor, 0.04)}
    />
  );
}
