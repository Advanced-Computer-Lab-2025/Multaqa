"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
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
import FilterPanel from "@/components/shared/FilterCard/FilterPanel";
import { FilterGroup } from "@/components/shared/FilterCard/types";

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

const getFilterGroups = (): FilterGroup[] => [
  {
    id: "status",
    title: "Status",
    type: "chip",
    options: [
      { label: "All", value: "ALL" },
      { label: "Upcoming", value: "upcoming" },
      { label: "Ongoing", value: "ongoing" },
      { label: "Past", value: "past" },
    ],
  },
  {
    id: "type",
    title: "Type",
    type: "chip",
    options: [
      { label: "All", value: "ALL" },
      { label: SESSION_LABEL.YOGA, value: "YOGA" },
      { label: SESSION_LABEL.PILATES, value: "PILATES" },
      { label: SESSION_LABEL.AEROBICS, value: "AEROBICS" },
      { label: SESSION_LABEL.ZUMBA, value: "ZUMBA" },
      { label: SESSION_LABEL.CROSS_CIRCUIT, value: "CROSS_CIRCUIT" },
      { label: SESSION_LABEL.KICK_BOXING, value: "KICK_BOXING" },
    ],
  },
];

export default function MyRegisteredSessions() {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status: string[];
    type: string[];
  }>({
    status: ["ALL"],
    type: ["ALL"],
  });

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

  // Filter sessions
  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      // Type Filter
      const typeMatch =
        filters.type.includes("ALL") ||
        filters.type.includes(s.type);

      // Status Filter
      const status = getSessionStatus(s.start, s.end);
      const statusMatch =
        filters.status.includes("ALL") ||
        filters.status.includes(status);

      return typeMatch && statusMatch;
    });
  }, [sessions, filters]);

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

  const handleFilterChange = (groupId: string, value: any) => {
    setFilters((prev) => {
      const currentVal = prev[groupId as keyof typeof prev];
      // If clicking ALL, clear others and set ALL
      if (value === "ALL") {
        return { ...prev, [groupId]: ["ALL"] };
      }

      // If clicking something else, remove ALL if present
      let newVals = currentVal.filter(v => v !== "ALL");

      if (newVals.includes(value)) {
        newVals = newVals.filter(v => v !== value);
      } else {
        newVals.push(value);
      }

      // If nothing left, set back to ALL
      if (newVals.length === 0) {
        newVals = ["ALL"];
      }

      return { ...prev, [groupId]: newVals };
    });
  };

  const handleResetFilters = () => {
    setFilters({ status: ["ALL"], type: ["ALL"] });
  };

  return (
    <ContentWrapper
      title="My Registered Sessions"
      description="View and manage your registered gym sessions."
      headerMarginBottom={2}
    >
      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <FilterPanel
          filterGroups={getFilterGroups()}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
          onReset={handleResetFilters}
        />
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
                  // Use blue (#6299d0) when "ALL" is selected in type filter, otherwise use the session type color
                  // If multiple types are selected, we might want to default to blue or use the first one.
                  // For now, if "ALL" is in type filters, use blue. If specific types, use the color of the first item in the list.
                  const accent =
                    filters.type.includes("ALL") ? "#6299d0" : SESSION_COLORS[list[0].type];
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
