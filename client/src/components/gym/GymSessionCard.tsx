"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ActionCard from "@/components/shared/cards/ActionCard";
import { GymSession, SESSION_COLORS } from "./types";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsMmaIcon from "@mui/icons-material/SportsMma";

const SESSION_ICONS: Record<GymSession["type"], React.ElementType> = {
  YOGA: SelfImprovementIcon,
  PILATES: AccessibilityNewIcon,
  AEROBICS: DirectionsRunIcon,
  ZUMBA: MusicNoteIcon,
  CROSS_CIRCUIT: FitnessCenterIcon,
  KICK_BOXING: SportsMmaIcon,
};

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
  const Icon = SESSION_ICONS[session.type];
  const displayTitle = session.title.replace(/^Gym Session\s*-\s*/i, "").trim() || SESSION_LABEL[session.type];
  const instructorLabel = session.instructor ? `by ${session.instructor}` : "Instructor update soon";
  const leftIcon = (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: "14px",
        backgroundColor: alpha(baseColor, 0.18),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon sx={{ fontSize: 24, color: baseColor }} />
    </Box>
  );

  return (
    <ActionCard
      type="vendor"
      title={displayTitle}
      leftIcon={leftIcon}
      disableTitleEllipsis
      titleMaxLines={3}
      subtitleNode={
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#111111", mb: 0.5 }}>
          {instructorLabel}
        </Typography>
      }
      metaNodes={[
        <Typography key="time" variant="body2" sx={{ fontWeight: 500, color: "#4b5563" }}>
          {start} – {end} · {session.location ?? "Main Gym"}
        </Typography>,
        showSpots ? (
          <Typography
            key="spots"
            variant="caption"
            sx={{ fontWeight: 700, color: baseColor, mt: 0.5 }}
          >
            {spotsLeft} spots left
          </Typography>
        ) : null,
      ].filter(Boolean) as React.ReactNode[]}
      borderColor={baseColor}
      background="#ffffff"
      sx={{
        width: 240,
        flexShrink: 0,
        position: "relative",
        padding: "16px",
        borderRadius: "18px",
        border: `1.5px solid ${alpha(baseColor, 0.4)}`,
        boxShadow: "none",
        transition: "transform 0.3s ease",
        display: "flex",
        minHeight: "auto",
        maxHeight: "none",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
      headerSx={{
        alignItems: "center",
        flexDirection: "row",
        gap: 1.75,
      }}
    />
  );
}
