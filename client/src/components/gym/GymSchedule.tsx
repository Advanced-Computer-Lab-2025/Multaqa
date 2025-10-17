"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Box, Chip, Divider, Stack, Typography, Alert } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import GymSessionCard from "./GymSessionCard";
import { GymSession, GymSessionType, SESSION_LABEL } from "./types";
type Props = { month?: Date; sessions?: GymSession[] };
import { api } from "@/api";
import { mapServerToClient, FILTER_CHIPS } from "./helpers";

export default function GymSchedule({ month, sessions }: Props) {
  const [current, setCurrent] = useState<Date>(month ?? new Date());
  const [filter, setFilter] = useState<GymSessionType | "ALL">("ALL");
  const [items, setItems] = useState<GymSession[]>(sessions ?? []);
  const [error, setError] = useState<string | null>(null);

  const all = useMemo(() => (sessions && sessions.length ? sessions : items), [sessions, items]);
  const filtered = useMemo(
    () => (filter === "ALL" ? all : all.filter((s) => s.type === filter)),
    [all, filter]
  );

  const byDay = useMemo(() => {
    const groups = new Map<string, GymSession[]>();
    filtered.forEach((s) => {
      const d = new Date(s.start);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
      const arr = groups.get(key) ?? [];
      arr.push(s);
      groups.set(key, arr);
    });
    // sort groups by date asc and sessions by start time
    const entries = Array.from(groups.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
    entries.forEach(([, arr]) => arr.sort((x, y) => new Date(x.start).getTime() - new Date(y.start).getTime()));
    return entries;
  }, [filtered]);

  const monthLabel = current.toLocaleString(undefined, { month: "long", year: "numeric" });

  const goPrev = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  useEffect(() => {
    let cancelled = false;
    const fetchSessions = async () => {
      setError(null);
      try {
        const res = await api.get("/gymsessions");
        const payloadRoot = res.data?.data ?? res.data;
        const list = Array.isArray(payloadRoot) ? payloadRoot : [];
        const mapped = list.map(mapServerToClient);
        if (!cancelled) {
          setItems(mapped);
        }
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setItems([]);
          setError(null);
          return;
        }
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load gym sessions");
        setItems([]);
      }
    };

    // fetch on mount and when month changes
    fetchSessions();
    return () => {
      cancelled = true;
    };
  }, [current]);


  type FilterKey = GymSessionType | "ALL";
  const filterChips = FILTER_CHIPS.map((c) => ({ key: c.key as FilterKey, label: c.key === "ALL" ? "All" : (SESSION_LABEL as any)[c.key] ?? c.label }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "var(--font-jost)", fontWeight: 700, color: "#1E1E1E" }}>
            Gym Sessions
          </Typography>
          <Typography variant="body2" sx={{ color: "#757575", fontFamily: "var(--font-poppins)" }}>
            Browse sessions by month and filter by type.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <CustomButton variant="outlined" color="primary" onClick={goPrev} width="auto" height="36px">
            Prev
          </CustomButton>
          <CustomButton variant="contained" color="primary" onClick={goNext} width="auto" height="36px">
            Next
          </CustomButton>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1E1E1E" }}>{monthLabel}</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {filterChips.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              size="small"
              variant={filter === key ? "filled" : "outlined"}
              color={filter === key ? "primary" : "default"}
              onClick={() => setFilter(key)}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {byDay.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#6b7280" }}>No sessions for this month.</Typography>
        ) : (
          byDay.map(([day, list]) => (
            <Box key={day}>
              <Typography variant="subtitle2" sx={{ color: "#6299d0", fontWeight: 700, mb: 1 }}>{day}</Typography>
              <Stack spacing={1.5}>
                {list.map((s) => (
                  <GymSessionCard key={s.id} session={s} showSpots />
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}
