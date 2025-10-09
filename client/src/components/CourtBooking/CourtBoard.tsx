"use client";

import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import CourtColumn from './CourtColumn';
import { CourtBoardProps, CourtSlot } from './types';

const CourtBoard: React.FC<CourtBoardProps> = ({ courts, slots, currentUser = 'me', onReserve, onCancel }) => {
  const [localSlots, setLocalSlots] = useState<CourtSlot[]>(slots);

  const byCourt = useMemo(() => {
    const map = new Map<string, CourtSlot[]>();
    for (const s of localSlots) {
      if (!map.has(s.courtTypeId)) map.set(s.courtTypeId, []);
      map.get(s.courtTypeId)!.push(s);
    }
    return map;
  }, [localSlots]);

  const handleReserve = (slot: CourtSlot) => {
    const updated = localSlots.map((s) =>
      s.id === slot.id ? { ...s, status: 'yours' as const, reservedBy: currentUser } : s
    );
    setLocalSlots(updated);
    onReserve?.(slot);
  };

  const handleCancel = (slot: CourtSlot) => {
    const updated = localSlots.map((s) =>
      s.id === slot.id ? { ...s, status: 'available' as const, reservedBy: undefined } : s
    );
    setLocalSlots(updated);
    onCancel?.(slot);
  };

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      gap: { xs: 2, md: 3 },
      px: { xs: 2, sm: 4, md: 6, lg: 8 },
      py: 4,
      maxWidth: 1600,
      mx: 'auto',
      minHeight: '100vh',
      backgroundColor: '#e6e6da'
    }}>
      {courts.map((c) => (
        <CourtColumn
          key={c.id}
          court={c}
          slots={byCourt.get(c.id) ?? []}
          currentUser={currentUser}
          onReserve={handleReserve}
          onCancel={handleCancel}
        />
      ))}
    </Box>
  );
};

export default CourtBoard;
