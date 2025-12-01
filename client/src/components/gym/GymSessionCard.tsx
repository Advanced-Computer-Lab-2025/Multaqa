"use client";

import React, { useState } from "react";
import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import type { StackProps } from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import ActionCard from "@/components/shared/cards/ActionCard";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CustomModal from "@/components/shared/modals/CustomModal";
import { GymSession, SESSION_COLORS, SESSION_LABEL } from "./types";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { registerForGymSession } from "./utils";
import { useAuth } from "@/hooks/useAuth"; // Assuming useAuth is available from a hooks directory

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
  onRegisterSuccess?: () => void;
};

export default function GymSessionCard({
  session,
  showSpots = true,
  layout = "compact",
  onRegisterSuccess,
}: Props) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { user } = useAuth();
  const [localIsRegistered, setLocalIsRegistered] = useState(session.isRegistered ?? false);
  const [spotsLeft, setSpotsLeft] = useState((session.spotsTotal ?? 0) - (session.spotsTaken ?? 0));
  const baseColor = SESSION_COLORS[session.type];
  const start = new Date(session.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(session.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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

  const handleRegister = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmModalOpen(true);
  };

  const confirmRegistration = async () => {
    if (!user) {
      alert("Please log in to register.");
      return;
    }
    try {
      setIsRegistering(true);
      await registerForGymSession(session.id);
      // Update local state to reflect registration
      setLocalIsRegistered(true);
      setSpotsLeft((prev) => Math.max(0, prev - 1));
      if (onRegisterSuccess) onRegisterSuccess();
      setIsConfirmModalOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to register for session";
      alert(msg);
    } finally {
      setIsRegistering(false);
    }
  };
  
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
    <Stack key="meta" spacing={0.5}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <AccessTimeIcon sx={{ fontSize: "0.9rem", color: "#9ca3af" }} />
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "#4b5563", fontSize: "0.85rem" }}
        >
          {start} – {end}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <LocationOnIcon sx={{ fontSize: "0.9rem", color: "#9ca3af" }} />
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "#4b5563", fontSize: "0.85rem" }}
        >
          {session.location ?? "Main Gym"}
        </Typography>
      </Stack>
    </Stack>,
  ];

  // Group spots and action button/status in a horizontal stack
  const bottomRow: React.ReactNode[] = [];

  // Only show spots for upcoming sessions that user is not registered for
  if (showSpots && isUpcoming && !localIsRegistered) {
    bottomRow.push(
      <Typography
        key="spots"
        variant="caption"
        sx={{ fontWeight: 700, color: baseColor }}
      >
        {spotsLeft} spots left
      </Typography>
    );
  }

  // Add status indicator or register button
  if (sessionStatus === "ended") {
    bottomRow.push(
      <Typography
        key="status"
        variant="caption"
        sx={{ 
          fontWeight: 600, 
          color: "#9ca3af",
          fontStyle: "italic"
        }}
      >
        Session Ended
      </Typography>
    );
  } else if (sessionStatus === "ongoing") {
    bottomRow.push(
      <Typography
        key="status"
        variant="caption"
        sx={{ 
          fontWeight: 600, 
          color: "#f59e0b",
        }}
      >
        Session Ongoing
      </Typography>
    );
  } else if (localIsRegistered) {
    // Show registered chip for upcoming sessions where user is already registered
    bottomRow.push(
      <Chip
        key="registered"
        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
        label="Registered"
        size="small"
        sx={{
          backgroundColor: alpha("#22c55e", 0.15),
          color: "#16a34a",
          fontWeight: 600,
          fontSize: "0.7rem",
          height: "24px",
          borderRadius: "6px",
          "& .MuiChip-icon": {
            color: "#16a34a",
          },
        }}
      />
    );
  } else {
    bottomRow.push(
      <CustomButton
        key="register"
        variant="contained"
        onClick={handleRegister}
        disabled={isRegistering}
        label={isRegistering ? "..." : "Register"}
        height="24px"
        sx={{
          backgroundColor: baseColor,
          borderColor: baseColor,
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.7rem",
          textTransform: "none",
          borderRadius: "6px",
          minWidth: "auto",
          boxShadow: `0 2px 4px ${alpha(baseColor, 0.3)}`,
          "&:hover": {
            backgroundColor: alpha(baseColor, 0.85),
            boxShadow: `0 3px 8px ${alpha(baseColor, 0.4)}`,
          },
          "&:disabled": {
            backgroundColor: alpha(baseColor, 0.5),
            color: "#fff",
          },
        }}
      />
    );
  }

  if (bottomRow.length > 0) {
    metaNodesArray.push(
      <Stack
        key="bottom-row"
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 1, width: "100%" }}
      >
        {bottomRow}
      </Stack>
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
          variant="caption"
          sx={{
            fontWeight: 400,
            color: "#6b7280",
            mb: 0.5,
            fontSize: "0.8rem",
            fontStyle: session.instructor ? "normal" : "italic",
          }}
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
    >
      <CustomModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Registration"
        description="Are you sure you want to register for this session?"
        modalType="confirm"
        buttonOption1={{
          label: "Confirm",
          onClick: confirmRegistration,
          variant: "contained",
          color: "primary",
        }}
        buttonOption2={{
          label: "Cancel",
          onClick: () => setIsConfirmModalOpen(false),
          variant: "outlined",
          color: "primary",
        }}
      />
    </ActionCard>
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
