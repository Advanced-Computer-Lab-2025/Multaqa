"use client";

import React, { useMemo, useState } from "react";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import GymSessionCard from "./GymSessionCard";
import { GymSession, GymSessionType, SESSION_LABEL } from "./types";

// colors handled by `GymSessionCard`

type Props = {
  month?: Date; // initial month
  sessions?: GymSession[]; // optional external data, else use demo
};

const demoSessions = (base: Date): GymSession[] => {
  const y = base.getFullYear();
  const m = base.getMonth();
  const mk = (d: number, sh: number, eh: number, t: GymSessionType, title: string): GymSession => ({
    id: `${y}-${m + 1}-${d}-${t}-${sh}`,
    title,
    type: t,
    start: new Date(y, m, d, sh, 0, 0).toISOString(),
    end: new Date(y, m, d, eh, 0, 0).toISOString(),
    instructor: ["Sara", "Omar", "Nora", "Hossam"][d % 4],
    location: ["Studio A", "Studio B", "Main Hall"][d % 3],
    spotsTotal: 20,
    spotsTaken: (d * 3 + sh) % 20,
  });
  return [
    mk(2, 9, 10, "YOGA", "Morning Flow"),
    mk(3, 18, 19, "ZUMBA", "Evening Zumba"),
    mk(5, 8, 9, "PILATES", "Core Strength"),
    mk(8, 17, 18, "AEROBICS", "High Energy"),
    mk(12, 10, 11, "CROSS_CIRCUIT", "Circuit Blast"),
    mk(15, 19, 20, "KICK_BOXING", "Kick-boxing Basics"),
    mk(16, 7, 8, "YOGA", "Sunrise Yoga"),
    mk(22, 18, 19, "PILATES", "Pilates Reformer"),
    mk(25, 12, 13, "ZUMBA", "Zumba Party"),
  ];
};

export default function GymSchedule({ month, sessions }: Props) {
  const [current, setCurrent] = useState<Date>(month ?? new Date());
  const [filter, setFilter] = useState<GymSessionType | "ALL">("ALL");

  const all = useMemo(() => sessions ?? demoSessions(current), [sessions, current]);
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
