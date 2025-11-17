"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  ClickAwayListener,
} from "@mui/material";
import { keyframes, useTheme } from "@mui/material/styles";
import {
  SelfImprovement as YogaIcon,
  FitnessCenter as PilatesIcon,
  DirectionsRun as AerobicsIcon,
  MusicNote as ZumbaIcon,
  Timer as CircuitIcon,
  Sports as KickboxingIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import CustomButton from "../shared/Buttons/CustomButton";
import { GymSessionType, SESSION_LABEL } from "./types";

interface SessionTypeDropdownProps {
  onSessionTypeSelect: (sessionType: GymSessionType) => void;
}

const sessionTypeConfig = [
  {
    type: "YOGA" as GymSessionType,
    icon: YogaIcon,
    color: "#4caf50", // Green
    label: "Yoga",
  },
  {
    type: "PILATES" as GymSessionType,
    icon: PilatesIcon,
    color: "#2196f3", // Blue
    label: "Pilates",
  },
  {
    type: "AEROBICS" as GymSessionType,
    icon: AerobicsIcon,
    color: "#e91e63", // Pink
    label: "Aerobics",
  },
  {
    type: "ZUMBA" as GymSessionType,
    icon: ZumbaIcon,
    color: "#e91e63", // Pink
    label: "Zumba",
  },
  {
    type: "CROSS_CIRCUIT" as GymSessionType,
    icon: CircuitIcon,
    color: "#9c27b0", // Purple
    label: "Cross Circuit",
  },
  {
    type: "KICK_BOXING" as GymSessionType,
    icon: KickboxingIcon,
    color: "#f44336", // Red
    label: "Kick-boxing",
  },
];

export default function SessionTypeDropdown({
  onSessionTypeSelect,
}: SessionTypeDropdownProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log("Create New button clicked");
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    console.log("Closing dropdown");
    setOpen(false);
    setAnchorEl(null);
  };

  const handleSessionTypeClick = (sessionType: GymSessionType) => {
    console.log("Session type selected:", sessionType);
    onSessionTypeSelect(sessionType);
    handleClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        paperRef.current &&
        !paperRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const floatIn = keyframes`
    0% {
      transform: translateY(28px) scale(0.9, 0.96);
      opacity: 0;
      filter: blur(10px);
    }
    55% {
      transform: translateY(-6px) scale(1.03, 1.01);
      opacity: 1;
      filter: blur(0px);
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  `;

  const haloPulse = keyframes`
    0% {
      opacity: 0.3;
      transform: scale(0.82);
    }
    70% {
      opacity: 0.1;
      transform: scale(1.04);
    }
    100% {
      opacity: 0;
      transform: scale(1.08);
    }
  `;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CustomButton
        ref={buttonRef}
        label="Create New"
        variant="contained"
        color="primary"
        onClick={handleClick}
        startIcon={<AddIcon />}
        sx={{
          fontWeight: 600,
          textTransform: "none",
          position: "relative",
        }}
      />

      {open && (
        <Paper
            elevation={8}
            ref={paperRef}
            sx={{
              position: "absolute",
              top: "100%",
              right: 0,
              mt: 1,
              p: 2,
              borderRadius: "16px",
              backgroundColor: "white",
              border: `1px solid ${theme.palette.primary.light}`,
              boxShadow: "0 18px 40px rgba(24, 39, 75, 0.18)",
              zIndex: 1300,
              minWidth: "280px",
              maxWidth: "320px",
              transformOrigin: "top right",
              animation: `${floatIn} 500ms cubic-bezier(0.19, 1, 0.22, 1)` ,
              overflow: "visible",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-14px",
                borderRadius: "28px",
                border: `1px solid ${theme.palette.primary.light}66`,
                pointerEvents: "none",
                animation: `${haloPulse} 700ms ease-out forwards`,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                fontWeight: 600,
                color: theme.palette.tertiary.dark,
                mb: 2,
                textAlign: "center",
              }}
            >
              Choose Session Type
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.5,
              }}
            >
              {sessionTypeConfig.map((config) => {
                const IconComponent = config.icon;
                return (
                  <Box
                    key={config.type}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      // console.log("Box mouseDown for:", config.type);
                      handleSessionTypeClick(config.type);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // console.log("Box clicked for:", config.type);
                      handleSessionTypeClick(config.type);
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "2px solid transparent",
                      "&:hover": {
                        backgroundColor: `${config.color}15`,
                        borderColor: `${config.color}40`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${config.color}30`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: `${config.color}20`,
                        color: config.color,
                        mb: 1,
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: `${config.color}30`,
                        },
                      }}
                    >
                      <IconComponent sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily:
                          "var(--font-poppins), system-ui, sans-serif",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {config.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                color: theme.palette.text.secondary,
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
              }}
            >
              Click on a session type to create
            </Typography>
          </Paper>
      )}
    </Box>
  );
}