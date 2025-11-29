"use client";

import React from "react";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import type { StackProps } from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import ActionCard from "@/components/shared/cards/ActionCard";
import { GymSession, SESSION_COLORS, SESSION_LABEL } from "./types";
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

export type GymSessionCardLayout = "compact" | "full";

type SessionStatus = "upcoming" | "ongoing" | "ended";

const getSessionStatus = (start: string, end: string): SessionStatus => {
  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);
  
  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "ongoing";
  return "ended";
};

type Props = {
  session: GymSession;
  showSpots?: boolean;
  layout?: GymSessionCardLayout;
};

export default function GymSessionCard({
  session,
  showSpots = true,
  layout = "compact",
}: Props) {
  const baseColor = SESSION_COLORS[session.type];
  const start = new Date(session.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(session.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const spotsLeft = (session.spotsTotal ?? 0) - (session.spotsTaken ?? 0);
  const Icon = SESSION_ICONS[session.type];
  const displayTitle =
    session.title.replace(/^Gym Session\s*-\s*/i, "").trim() ||
    SESSION_LABEL[session.type];
  const instructorLabel = session.instructor
    ? `by ${session.instructor}`
    : "Instructor update soon";
  const isCompact = layout === "compact";
  
  // Determine session status
  const sessionStatus = getSessionStatus(session.start, session.end);
  const isUpcoming = sessionStatus === "upcoming";
  
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
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 24, color: baseColor }} />
    </Box>
  );

  // Build meta nodes based on session status
  const metaNodesArray: React.ReactNode[] = [
    <Typography
      key="time"
      variant="body2"
      sx={{ fontWeight: 500, color: "#4b5563" }}
    >
      {start} – {end} · {session.location ?? "Main Gym"}
    </Typography>,
  ];

  // Only show spots for upcoming sessions
  if (showSpots && isUpcoming) {
    metaNodesArray.push(
      <Typography
        key="spots"
        variant="caption"
        sx={{ fontWeight: 700, color: baseColor, mt: 0.5 }}
      >
        {spotsLeft} spots left
      </Typography>
    );
  }

  // Add status indicator or register button
  if (sessionStatus === "ended") {
    metaNodesArray.push(
      <Typography
        key="status"
        variant="caption"
        sx={{ 
          fontWeight: 600, 
          color: "#9ca3af",
          mt: 0.5,
          fontStyle: "italic"
        }}
      >
        Session Ended
      </Typography>
    );
  } else if (sessionStatus === "ongoing") {
    metaNodesArray.push(
      <Typography
        key="status"
        variant="caption"
        sx={{ 
          fontWeight: 600, 
          color: "#f59e0b",
          mt: 0.5,
        }}
      >
        Session Ongoing
      </Typography>
    );
  } else {
    metaNodesArray.push(
      <Button
        key="register"
        variant="contained"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          // TODO: Implement registration logic
          console.log("Register clicked for session:", session.id);
        }}
        sx={{
          mt: 1,
          backgroundColor: baseColor,
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "none",
          borderRadius: "8px",
          px: 2,
          py: 0.5,
          minWidth: "80px",
          boxShadow: `0 2px 8px ${alpha(baseColor, 0.3)}`,
          "&:hover": {
            backgroundColor: alpha(baseColor, 0.85),
            boxShadow: `0 4px 12px ${alpha(baseColor, 0.4)}`,
          },
        }}
      >
        Register
      </Button>
    );
  }

  return (
    <ActionCard
      type="vendor"
      title={displayTitle}
      leftIcon={leftIcon}
      disableTitleEllipsis
      titleMaxLines={3}
      subtitleNode={
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "#111111", mb: 0.5 }}
        >
          {instructorLabel}
        </Typography>
      }
      metaNodes={metaNodesArray}
      borderColor={baseColor}
      background="#ffffff"
      sx={{
        width: isCompact ? 300 : "100%",
        minWidth: isCompact ? 300 : 0,
        flexShrink: isCompact ? 0 : 1,
        position: "relative",
        padding: "16px",
        borderRadius: "18px",
        border: `1.5px solid ${alpha(baseColor, 0.4)}`,
        boxShadow: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        minHeight: 160,
        maxHeight: "none",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${alpha(baseColor, 0.25)}`,
        },
      }}
      headerSx={{
        alignItems: "flex-start",
        flexDirection: isCompact ? "row" : { xs: "column", sm: "row" },
        gap: 1.75,
      }}
    />
  );
}

type SkeletonProps = {
  layout?: GymSessionCardLayout;
  showSpots?: boolean;
};

export function GymSessionCardSkeleton({
  layout = "compact",
  showSpots = true,
}: SkeletonProps) {
  const isCompact = layout === "compact";
  const headerDirection: StackProps["direction"] = isCompact
    ? "row"
    : { xs: "column", sm: "row" };

  return (
    <Box
      sx={{
        width: isCompact ? 300 : "100%",
        minWidth: isCompact ? 300 : 0,
        flexShrink: isCompact ? 0 : 1,
        position: "relative",
        padding: "16px",
        borderRadius: "18px",
        border: `1.5px solid ${alpha("#94a3b8", 0.4)}`,
        backgroundColor: "#fff",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        minHeight: 200,
        maxHeight: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 4px 12px ${alpha("#94a3b8", 0.2)}`,
        },
      }}
    >
      <Stack
        direction={headerDirection}
        spacing={1.75}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            backgroundColor: alpha("#94a3b8", 0.2),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Skeleton variant="circular" width={20} height={20} />
        </Box>
        <Stack spacing={0.5} sx={{ flex: 1, width: "100%" }}>
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
        </Stack>
      </Stack>
      <Stack spacing={0.75}>
        <Skeleton variant="text" width="90%" height={15} />
        <Skeleton variant="text" width="70%" height={13} />
        {showSpots && <Skeleton variant="text" width="45%" height={12} />}
      </Stack>
    </Box>
  );
}
