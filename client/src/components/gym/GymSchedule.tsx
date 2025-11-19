"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Divider, Stack, Typography, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import theme from "@/themes/lightTheme";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import GymSessionCard from "./GymSessionCard";
import { GymSession, GymSessionType, SESSION_LABEL, SESSION_COLORS } from "./types";
import { fetchGymSessions } from "./utils";
import EmptyState from "../shared/states/EmptyState";
import ErrorState from "../shared/states/ErrorState";

// colors handled by `GymSessionCard`

type Props = {
  month?: Date; // initial month
  sessions?: GymSession[]; // optional external data, else use demo
};

// Skeleton Loading Component
const GymSessionsSkeleton = () => (
  <Stack spacing={3}>
    {[1, 2, 3].map((item) => (
      <Box key={item}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "hidden",
          }}
        >
          {[1, 2, 3].map((card) => (
            <Skeleton
              key={card}
              variant="rounded"
              width={280}
              height={200}
              sx={{ borderRadius: "12px", flexShrink: 0 }}
            />
          ))}
        </Box>
      </Box>
    ))}
  </Stack>
);

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
      } catch (e) {
        if (mounted) setError("Failed to load gym sessions. Please try again later.");
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
    () => (filter === "ALL" ? inMonth : inMonth.filter((s) => s.type === filter)),
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
    <ContentWrapper
      title="Gym Sessions"
      description="Browse sessions by month and filter by type."
    >
      {/* Controls */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box />
        <Stack direction="row" spacing={1}>
          <CustomButton
            variant="outlined"
            color="primary"
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
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </CustomButton>
          <CustomButton
            variant="contained"
            color="primary"
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
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </CustomButton>
        </Stack>
      </Box>

      {/* Month and Filters */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {monthLabel}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {filterChips.map(({ key, label }) => {
            const isActive = filter === key;
            const baseColor = key === "ALL" ? theme.palette.primary.main : SESSION_COLORS[key];
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
                  borderRadius: "9999px",
                  px: 1.75,
                  height: 36,
                  borderWidth: isActive ? 4 : 1,
                  borderColor: baseColor,
                  color: baseColor,
                  backgroundColor: alpha(baseColor, isActive ? 0.12 : 0.08),
                  boxShadow: isActive
                    ? `0 4px 12px ${alpha(baseColor, 0.35)}`
                    : `0 1px 3px ${alpha(baseColor, 0.18)}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: alpha(baseColor, 0.16),
                    borderWidth: isActive ? 4 : 2,
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
            title="Failed to load gym sessions"
            description={error}
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
                  const accent = SESSION_COLORS[list[0].type];
                  return {
                    p: { xs: 2, md: 3 },
                    borderRadius: "16px",
                    position: "relative",
                    backgroundColor: "#fff",
                    border: `1px solid ${alpha(accent, 0.35)}`,
                    boxShadow: `0 0 0 1px ${alpha(accent, 0.35)}, 0 4px 14px ${alpha(accent, 0.20)}, 0 0 22px ${alpha(accent, 0.18)}`,
                    transition: "box-shadow 0.35s ease, transform 0.35s ease",
                    "&:hover": {
                      boxShadow: `0 0 0 2px ${alpha(accent, 0.55)}, 0 6px 18px ${alpha(accent, 0.28)}, 0 0 28px ${alpha(accent, 0.28)}`,
                      transform: "translateY(-3px)",
                    },
                  };
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.primary.main,
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
                    "&::-webkit-scrollbar-track": { background: alpha(theme.palette.grey[200], 0.6), borderRadius: 4 },
                    "&::-webkit-scrollbar-thumb": { background: alpha(theme.palette.primary.main, 0.45), borderRadius: 4 },
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
    </ContentWrapper>
  );
}