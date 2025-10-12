"use client";

import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Chip } from '@mui/material';
import { CourtSlot } from './types';
import { formatTimeRange } from './utils';

interface Props {
  slot: CourtSlot;
  color: 'primary' | 'secondary' | 'tertiary';
  currentUser?: string;
  onReserve?: (slot: CourtSlot) => void;
  onCancel?: (slot: CourtSlot) => void;
}

const SlotCard: React.FC<Props> = ({ slot, color, currentUser, onReserve, onCancel }) => {
  const isYours = slot.status === 'yours' || (slot.reservedBy && slot.reservedBy === currentUser);
  const isReserved = slot.status === 'reserved' && !isYours;
  const isAvailable = slot.status === 'available';

  const label = isYours ? 'Reserved by you' : isReserved ? 'Reserved' : 'Available';
  const chipColor: 'default' | 'primary' | 'success' = isYours ? 'primary' : isReserved ? 'default' : 'success';

  return (
    <Card elevation={0} sx={{
      borderRadius: 2,
      border: (theme) => `1px solid ${theme.palette[color].light}`,
      background: (theme) => theme.palette.background.default,
      boxShadow: '-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)'
    }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography fontWeight={600} sx={{ color: 'text.primary' }}>
            {formatTimeRange(slot.start, slot.end)}
          </Typography>
          <Chip size="small" label={label} color={chipColor} variant={isReserved ? 'outlined' : 'filled'} />
        </Stack>

        <Stack direction="row" spacing={1} mt={1}>
          {isAvailable && (
            <Button size="small" variant="contained" color={color} onClick={() => onReserve?.(slot)}>
              Reserve
            </Button>
          )}
          {isYours && (
            <Button size="small" variant="outlined" color={color} onClick={() => onCancel?.(slot)}>
              Cancel
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SlotCard;
