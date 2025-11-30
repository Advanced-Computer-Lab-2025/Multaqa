"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import theme from "@/themes/lightTheme";
import GymSessionCard, { GymSessionCardSkeleton } from "./GymSessionCard";
import {
  GymSession,
  GymSessionType,
  SESSION_LABEL,
  SESSION_COLORS,
} from "./types";
import { fetchMyRegisteredSessions } from "./utils";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";
import ContentWrapper from "../shared/containers/ContentWrapper";

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

type SessionStatus = "upcoming" | "ongoing" | "past";

const getSessionStatus = (start: string, end: string): SessionStatus => {
  const now = new Date();
  const startTime = new Date(start);
  const endTime = new Date(end);
  
  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "ongoing";
  return "past";
};

export default function MyRegisteredSessions() {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<GymSessionType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "ALL">("ALL");

  // Fetch registered sessions from API
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyRegisteredSessions();
        if (mounted) setSessions(data);
      } catch {
        if (mounted)
          setError("Failed to load your registered sessions. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter by type
  const filteredByType = useMemo(
    () =>
      filter === "ALL" ? sessions : sessions.filter((s) => s.type === filter),
    [sessions, filter]
  );

  // Filter by status
  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return filteredByType;
    return filteredByType.filter((s) => getSessionStatus(s.start, s.end) === statusFilter);
  }, [filteredByType, statusFilter]);

  // Group sessions by day
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

  // Refresh sessions after registration changes
  const handleRefresh = async () => {
    try {
      const data = await fetchMyRegisteredSessions();
      setSessions(data);
    } catch {
      // Silent fail on refresh
    }
  };

  type FilterKey = GymSessionType | "ALL";
  const filterChips: Array<{ key: FilterKey; label: string }> = [
    { key: "ALL", label: "All Types" },
    { key: "YOGA", label: SESSION_LABEL.YOGA },
    { key: "PILATES", label: SESSION_LABEL.PILATES },
    { key: "AEROBICS", label: SESSION_LABEL.AEROBICS },
    { key: "ZUMBA", label: SESSION_LABEL.ZUMBA },
    { key: "CROSS_CIRCUIT", label: SESSION_LABEL.CROSS_CIRCUIT },
    { key: "KICK_BOXING", label: SESSION_LABEL.KICK_BOXING },
  ];

  const statusChips: Array<{ key: SessionStatus | "ALL"; label: string; color: string }> = [
    { key: "ALL", label: "All Status", color: "#6299d0" },
    { key: "upcoming", label: "Upcoming", color: "#22c55e" },
    { key: "ongoing", label: "Ongoing", color: "#f59e0b" },
    { key: "past", label: "Past", color: "#9ca3af" },
  ];

  return (
    <ContentWrapper
      title="My Registered Sessions"
      description="View and manage your registered gym sessions."
      headerMarginBottom={2}
    >
      {/* Status Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.secondary, mb: 1 }}
        >
          Filter by Status
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {statusChips.map(({ key, label, color }) => {
            const isActive = statusFilter === key;

            return (
              <Chip
                key={key}
                label={label}
                size="medium"
                onClick={() => setStatusFilter(key)}
                variant="outlined"
                sx={{
                  fontFamily: "var(--font-poppins)",
                  fontWeight: isActive ? 600 : 500,
                  borderRadius: "28px",
                  px: 1.75,
                  height: 28,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: color,
                  color: color,
                  backgroundColor: alpha(color, isActive ? 0.12 : 0.08),
                  boxShadow: isActive
                    ? `0 6px 16px ${alpha(color, 0.28)}`
                    : `0 1px 3px ${alpha(color, 0.18)}`,
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Type Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.secondary, mb: 1 }}
        >
          Filter by Type
        </Typography>
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
                  fontWeight: isActive ? 600 : 500,
                  borderRadius: "28px",
                  px: 1.75,
                  height: 28,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: baseColor,
                  color: baseColor,
                  backgroundColor: alpha(baseColor, isActive ? 0.12 : 0.08),
                  boxShadow: isActive
                    ? `0 6px 16px ${alpha(baseColor, 0.28)}`
                    : `0 1px 3px ${alpha(baseColor, 0.18)}`,
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Day groups */}
      <Stack spacing={2}>
        {loading ? (
          <GymSessionsSkeleton />
        ) : error ? (
          <ErrorState
            title="Failed to load your sessions"
            description={
              error ??
              "An error has occurred while loading your registered sessions. Please try again later."
            }
            onCtaClick={() => window.location.reload()}
          />
        ) : byDay.length === 0 ? (
          <EmptyState
            title={
              sessions.length === 0
                ? "No registered sessions yet"
                : "No sessions match your filters"
            }
            description={
              sessions.length === 0
                ? "You haven't registered for any gym sessions yet. Browse available sessions and register to get started!"
                : "Try adjusting your filters to see more sessions."
            }
            imageAlt="No sessions illustration"
          />
        ) : (
          byDay.map(([day, list], index) => (
            <React.Fragment key={day}>
              {index !== 0 && <Divider sx={{ my: 3 }} />}
              {/* Day container with glow */}
              <Box
                sx={() => {
                  // Use blue (#6299d0) when "All" is selected, otherwise use the session type color
                  const accent =
                    filter === "ALL" ? "#6299d0" : SESSION_COLORS[list[0].type];
                  return {
                    p: { xs: 2, md: 3 },
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(accent, 0.35)}`,
                    boxShadow: `0 0 0 1px ${alpha(
                      accent,
                      0.35
                    )}, 0 4px 14px ${alpha(accent, 0.2)}, 0 0 22px ${alpha(
                      accent,
                      0.18
                    )}`,
                  };
                }}
              >
                {/* Day Header */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 2,
                    fontFamily: "var(--font-jost)",
                  }}
                >
                  {new Date(day).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>

                {/* Session Cards - Horizontal scroll */}
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
                    <GymSessionCard 
                      key={s.id} 
                      session={s} 
                      showSpots 
                      onRegisterSuccess={handleRefresh}
                    />
                  ))}
                </Box>
              </Box>
            </React.Fragment>
          ))
        )}
      </Stack>
    </ContentWrapper>
  );
}
