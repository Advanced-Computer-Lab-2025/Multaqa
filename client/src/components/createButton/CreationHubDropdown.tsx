"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import type { SvgIconComponent } from "@mui/icons-material";
import CustomButton from "@/components/shared/Buttons/CustomButton";

interface CreationHubOption {
  label: string;
  icon: SvgIconComponent;
  color: string;
  description?: string;
  onSelect: () => void;
}

interface CreationHubDropdownProps {
  options: CreationHubOption[];
  buttonLabel?: string;
  helperText?: string;
}

export default function CreationHubDropdown({
  options,
  buttonLabel = "Create New",
  helperText = "Choose what you would like to create",
}: CreationHubDropdownProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const closePanel = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (panelRef.current?.contains(target)) {
        return;
      }
      if (anchorEl?.contains(target as Node)) {
        return;
      }
      closePanel();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, anchorEl]);

  const layout = useMemo(() => {
    if (options.length === 0) {
      return { columns: "1fr", minWidth: 320, maxWidth: 400, gap: 2 };
    }

    if (options.length <= 3) {
      return {
        columns: `repeat(${options.length}, minmax(140px, 1fr))`,
        minWidth: 440,
        maxWidth: 560,
        gap: 2,
      };
    }

    return {
      columns: "repeat(2, minmax(180px, 1fr))",
      minWidth: 400,
      maxWidth: 480,
      gap: 2,
    };
  }, [options.length]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CustomButton
        onClick={handleToggle}
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        label={buttonLabel}
        sx={{
          fontWeight: 700,
          textTransform: "none",
          px: 3,
          py: 1,
          whiteSpace: "nowrap",
          boxShadow: open
            ? `0 10px 30px ${theme.palette.primary.main}33`
            : undefined,
        }}
      />

      {open && (
        <Paper
          ref={panelRef}
          elevation={10}
          sx={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            minWidth: layout.minWidth,
            maxWidth: layout.maxWidth,
            width: "max-content",
            p: 2.5,
            borderRadius: 3,
            border: `1px solid ${theme.palette.primary.light}`,
            boxShadow: "0 18px 40px rgba(24, 39, 75, 0.18)",
            backgroundColor: theme.palette.background.paper,
            zIndex: 12,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 600,
              textAlign: "left",
              color: theme.palette.tertiary.dark,
              mb: 1.5,
            }}
          >
            {helperText}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: layout.columns,
              gap: layout.gap,
            }}
          >
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <Box
                  key={option.label}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    option.onSelect();
                    closePanel();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      option.onSelect();
                      closePanel();
                    }
                  }}
                  sx={{
                    borderRadius: 3,
                    p: 1.75,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 1,
                    cursor: "pointer",
                    transition: "all 0.22s ease",
                    border: `2px solid transparent`,
                    backgroundColor: `${option.color}12`,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: `${option.color}55`,
                      boxShadow: `0 10px 24px ${option.color}33`,
                    },
                    "&:focus-visible": {
                      outline: `3px solid ${option.color}88`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: option.color,
                      backgroundColor: `${option.color}20`,
                    }}
                  >
                    <IconComponent fontSize="medium" />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "var(--font-poppins), system-ui, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {option.label}
                  </Typography>
                  {option.description && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily:
                          "var(--font-poppins), system-ui, sans-serif",
                        color: theme.palette.text.secondary,
                        lineHeight: 1.4,
                      }}
                    >
                      {option.description}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
