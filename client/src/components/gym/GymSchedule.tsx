"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Divider, Stack, Typography, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import theme from "@/themes/lightTheme";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import GymSessionCard, { GymSessionCardSkeleton } from "./GymSessionCard";
import {
  GymSession,
  GymSessionType,
  SESSION_LABEL,
  SESSION_COLORS,
} from "./types";
import { fetchGymSessions } from "./utils";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";

// colors handled by `GymSessionCard`

type Props = {
  month?: Date; // initial month
  sessions?: GymSession[]; // optional external data, else use demo
};

// Skeleton Loading Component (matches GymSessionCard layout)
const GymSessionsSkeleton = () => {
  const accentKeys = Object.keys(SESSION_COLORS) as Array<
    keyof typeof SESSION_COLORS
  >;
  return (
    <Stack spacing={2}>
      {[0, 1, 2].map((item) => {
        const accent = SESSION_COLORS[accentKeys[item % accentKeys.length]];
        return (
          <Box
            key={item}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              position: "relative",
              backgroundColor: "#fff",
              border: `1px solid ${alpha(accent, 0.35)}`,
              boxShadow: `0 0 0 1px ${alpha(accent, 0.35)}, 0 4px 14px ${alpha(
                accent,
                0.2
              )}, 0 0 22px ${alpha(accent, 0.18)}`,
            }}
          >
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 1.5 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1.5,
                overflowX: "auto",
                py: 1,
                scrollSnapType: "x mandatory",
                "& > *": { scrollSnapAlign: "start" },
                "&::-webkit-scrollbar": { height: 8 },
                "&::-webkit-scrollbar-track": {
                  background: alpha(theme.palette.grey[200], 0.6),
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: alpha(theme.palette.primary.main, 0.45),
                  borderRadius: 4,
                },
              }}
            >
              {[0, 1, 2].map((card) => (
                <GymSessionCardSkeleton key={`${item}-${card}`} />
              ))}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};

export default function GymSchedule({ month, sessions }: Props) {
  const [current, setCurrent] = useState<Date>(month ?? new Date());
  const [filter, setFilter] = useState<GymSessionType | "ALL">("ALL");
  const [fetched, setFetched] = useState<GymSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sessions from API (students like Browse Events)
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGymSessions();
        if (mounted) setFetched(data);
      } catch {
        if (mounted)
          setError("Failed to load gym sessions. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [current]);

  // Prefer prop sessions when provided (tests/SSR), else use fetched
  const all = useMemo(() => sessions ?? fetched, [sessions, fetched]);

  // Filter by selected calendar month
  const inMonth = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    return all.filter((s) => {
      const d = new Date(s.start);
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [all, current]);

  // Filter by type
  const filtered = useMemo(
    () =>
      filter === "ALL" ? inMonth : inMonth.filter((s) => s.type === filter),
    [inMonth, filter]
  );

  const byDay = useMemo(() => {
    const groups = new Map<string, GymSession[]>();
    filtered.forEach((s) => {
      const d = new Date(s.start);
      const key = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
      ).toDateString();
      const arr = groups.get(key) ?? [];
      arr.push(s);
      groups.set(key, arr);
    });
    // sort groups by date asc and sessions by start time
    const entries = Array.from(groups.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
    entries.forEach(([, arr]) =>
      arr.sort(
        (x, y) => new Date(x.start).getTime() - new Date(y.start).getTime()
      )
    );
    return entries;
  }, [filtered]);

  const monthLabel = current.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const goPrev = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  type FilterKey = GymSessionType | "ALL";
  const filterChips: Array<{ key: FilterKey; label: string }> = [
    { key: "ALL", label: "All" },
    { key: "YOGA", label: SESSION_LABEL.YOGA },
    { key: "PILATES", label: SESSION_LABEL.PILATES },
    { key: "AEROBICS", label: SESSION_LABEL.AEROBICS },
    { key: "ZUMBA", label: SESSION_LABEL.ZUMBA },
    { key: "CROSS_CIRCUIT", label: SESSION_LABEL.CROSS_CIRCUIT },
    { key: "KICK_BOXING", label: SESSION_LABEL.KICK_BOXING },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "transparent",
        minHeight: "100vh",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Gym Sessions
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#757575",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
          }}
        >
          Browse sessions by month and filter by type.
        </Typography>
      </Box>

      {/* Filters and Date Switcher */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {filterChips.map(({ key, label }) => {
            const isActive = filter === key;
            const isAll = key === "ALL";

            // All button uses sidebar blue (#6299d0)
            // Other buttons keep their session colors
            const baseColor = isAll ? "#6299d0" : SESSION_COLORS[key];

            return (
              <Chip
                key={key}
                label={label}
                size="medium"
                onClick={() => setFilter(key)}
                variant="outlined"
                sx={{
                  fontFamily: "var(--font-poppins)",
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  borderRadius: "24px",
                  px: 1.75,
                  height: 36,
                  borderWidth: isActive ? 3 : 1,
                  borderColor: baseColor,
                  color: baseColor,
                  backgroundColor: alpha(baseColor, isActive ? 0.12 : 0.08),
                  boxShadow: isActive
                    ? `0 6px 16px ${alpha(baseColor, 0.28)}`
                    : `0 1px 3px ${alpha(baseColor, 0.18)}`,
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
                  transform: isActive ? "translateY(-1px)" : "none",
                  "&:hover": {
                    backgroundColor: alpha(baseColor, 0.16),
                    borderWidth: isActive ? 3 : 2,
                    transform: "translateY(-1px)",
                  },
                }}
              />
            );
          })}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <CustomButton
            variant="contained"
            onClick={goPrev}
            width="42px"
            height="42px"
            aria-label="Previous month"
            sx={{
              minWidth: "42px",
              width: 42,
              height: 42,
              borderRadius: "999px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#000" }} />
          </CustomButton>

          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {monthLabel}
          </Typography>

          <CustomButton
            variant="contained"
            onClick={goNext}
            width="42px"
            height="42px"
            aria-label="Next month"
            sx={{
              minWidth: "42px",
              width: 42,
              height: 42,
              borderRadius: "999px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" sx={{ color: "#000" }} />
          </CustomButton>
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Day groups */}
      <Stack spacing={2}>
        {loading ? (
          <GymSessionsSkeleton />
        ) : error ? (
          <ErrorState
            title="Failed to load gym sessions"
            description={
              error ??
              "An error has occured on our end while loading the gym sessions. Please try again later."
            }
            onCtaClick={() => window.location.reload()}
          />
        ) : byDay.length === 0 ? (
          <EmptyState
            title="No sessions for the selected activity for this month"
            description="There are no gym sessions scheduled for the selected month or activity. Please check back later or try a different month or activity."
            imageAlt="No sessions illustration"
          />
        ) : (
          byDay.map(([day, list], index) => (
            <React.Fragment key={day}>
              {index !== 0 && <Divider sx={{ my: 3 }} />}{" "}
              {/* divider between days */}
              {/** Day container with glow (moved from individual cards) */}
              <Box
                sx={() => {
                  // Use blue (#6299d0) when "All" is selected, otherwise use the session type color
                  const accent =
                    filter === "ALL" ? "#6299d0" : SESSION_COLORS[list[0].type];
                  return {
                    p: { xs: 2, md: 3 },
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: alpha(accent, 0.075),
                    border: `1px solid ${alpha(accent, 0.35)}`,
                    boxShadow: `0 0 0 1px ${alpha(
                      accent,
                      0.35
                    )}, 0 4px 14px ${alpha(accent, 0.2)}, 0 0 22px ${alpha(
                      accent,
                      0.18
                    )}`,
                    transition:
                      "box-shadow 0.35s ease, transform 0.35s ease, background-color 0.35s ease",
                    "&:hover": {
                      backgroundColor: alpha(accent, 0.1),
                      boxShadow: `0 0 0 2px ${alpha(
                        accent,
                        0.55
                      )}, 0 6px 18px ${alpha(accent, 0.28)}, 0 0 28px ${alpha(
                        accent,
                        0.28
                      )}`,
                      transform: "translateY(-3px)",
                    },
                  };
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {day}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1.5,
                    overflowX: "auto",
                    py: 1,
                    scrollSnapType: "x mandatory",
                    "& > *": { scrollSnapAlign: "start" },
                    "&::-webkit-scrollbar": { height: 8 },
                    "&::-webkit-scrollbar-track": {
                      background: alpha(theme.palette.grey[200], 0.6),
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: alpha(theme.palette.primary.main, 0.45),
                      borderRadius: 4,
                    },
                  }}
                >
                  {list.map((s) => (
                    <GymSessionCard key={s.id} session={s} showSpots />
                  ))}
                </Box>
              </Box>
            </React.Fragment>
          ))
        )}
      </Stack>
    </Box>
  );
}
