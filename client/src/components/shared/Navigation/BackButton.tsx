"use client";

import { IconButton, Typography, Stack, alpha } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
}

export default function BackButton({ label = "Back", onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    router.back();
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        onClick={handleClick}
        aria-label={label}
        sx={(theme) => ({
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
            transform: "translateX(-2px)",
          },
          transition: "all 0.25s ease",
          width: 42,
          height: 42,
        })}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      {label && (
        <Typography
          variant="body2"
          sx={(theme) => ({
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
            color: alpha(theme.palette.text.primary, 0.6),
          })}
        >
          {label}
        </Typography>
      )}
    </Stack>
  );
}


