"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import CourtColumn from "./CourtColumn";
import { CourtBoardProps, CourtSlot } from "./types";
import SlotDatePickerModal from "./SlotDatePickerModal";

const CourtBoard: React.FC<CourtBoardProps> = ({
  courts,
  slots,
  currentUser = "me",
  onReserve,
  onCancel,
  embedded = false,
  onChangeCourtDate,
}) => {
  const [localSlots, setLocalSlots] = useState<CourtSlot[]>(slots);

  useEffect(() => {
    setLocalSlots(slots);
  }, [slots]);
  const [activeCourtId, setActiveCourtId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});

  const byCourt = useMemo(() => {
    const map = new Map<string, CourtSlot[]>();
    for (const s of localSlots) {
      if (!map.has(s.courtTypeId)) map.set(s.courtTypeId, []);
      map.get(s.courtTypeId)!.push(s);
    }
    return map;
  }, [localSlots]);

  const availableDatesByCourt = useMemo(() => {
    const map = new Map<string, string[]>();
    byCourt.forEach((courtSlots, courtId) => {
      const uniqueDates = Array.from(
        new Set(courtSlots.map((slot) => slot.day))
      ).sort();
      map.set(courtId, uniqueDates);
    });
    return map;
  }, [byCourt]);

  const handleReserve = (slot: CourtSlot) => {
    const updated = localSlots.map((s) =>
      s.id === slot.id
        ? { ...s, status: "yours" as const, reservedBy: currentUser }
        : s
    );
    setLocalSlots(updated);
    onReserve?.(slot);
  };

  const handleCancel = (slot: CourtSlot) => {
    const updated = localSlots.map((s) =>
      s.id === slot.id
        ? { ...s, status: "available" as const, reservedBy: undefined }
        : s
    );
    setLocalSlots(updated);
    onCancel?.(slot);
  };

  const handleOpenDateModal = (courtId: string) => {
    setActiveCourtId(courtId);
  };

  const handleCloseDateModal = () => {
    setActiveCourtId(null);
  };

  const handleApplyCustomDate = (nextDate: string | null) => {
    if (!activeCourtId) return;

    setSelectedDates((prev) => {
      if (!nextDate) {
        if (!(activeCourtId in prev)) return prev;
        const updated = { ...prev };
        delete updated[activeCourtId];
        return updated;
      }
      return { ...prev, [activeCourtId]: nextDate };
    });

    onChangeCourtDate?.(activeCourtId, nextDate);
    setActiveCourtId(null);
  };

  const activeCourt = activeCourtId
    ? courts.find((court) => court.id === activeCourtId) ?? null
    : null;
  const activeSelectedDate = activeCourtId
    ? selectedDates[activeCourtId] ?? null
    : null;
  const activeAvailableDates = activeCourtId
    ? availableDatesByCourt.get(activeCourtId) ?? []
    : [];

  return (
    <>
      <Box
        sx={{
          px: embedded ? 0 : { xs: 2, md: 4 },
          py: embedded ? 0 : 4,
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fit, minmax(280px, 1fr))",
              md: "repeat(2, minmax(320px, 1fr))",
              lg: "repeat(3, minmax(320px, 1fr))",
            },
            gap: { xs: 2, md: 3 },
            maxWidth: embedded ? "100%" : 1600,
            mx: embedded ? 0 : "auto",
            // Remove explicit minHeight & scrolling so only inner slot lists scroll
            minHeight: 'auto',
            overflow: 'visible',
            pb: 0,
          }}
        >
          {courts.map((c) => (
            <CourtColumn
              key={c.id}
              court={c}
              slots={byCourt.get(c.id) ?? []}
              currentUser={currentUser}
              onReserve={handleReserve}
              onCancel={handleCancel}
              onSelectDate={handleOpenDateModal}
              selectedDate={selectedDates[c.id]}
            />
          ))}
        </Box>
      </Box>

      <SlotDatePickerModal
        open={Boolean(activeCourtId)}
        onClose={handleCloseDateModal}
        onApply={handleApplyCustomDate}
        selectedDate={activeSelectedDate}
        courtName={activeCourt?.name}
        availableDates={activeAvailableDates}
      />
    </>
  );
};

export default CourtBoard;
