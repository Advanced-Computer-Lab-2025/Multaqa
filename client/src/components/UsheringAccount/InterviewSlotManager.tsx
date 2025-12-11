import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CustomButton from '../shared/Buttons/CustomButton';
import InterviewSlots from './InterviewSlots';
import { format } from 'date-fns';

interface InterviewSlotManagerProps {
  initialSlots?: { start: Date; end: Date }[];
  onSlotsChange?: (slots: { start: Date; end: Date }[]) => void;
}

const InterviewSlotManager: React.FC<InterviewSlotManagerProps> = ({
  initialSlots = [],
  onSlotsChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSlots, setSavedSlots] = useState<{ start: Date; end: Date }[]>(initialSlots);

  const handleSaveSlots = (newSlots: { start: Date; end: Date }[]) => {
    if (newSlots.length === 0) return;

    // 1. Identify the time range covered by the new slots for each day
    const dayRanges = new Map<string, { min: number; max: number }>();

    newSlots.forEach(slot => {
      const dayKey = format(slot.start, 'yyyy-MM-dd');
      const start = slot.start.getTime();
      const end = slot.end.getTime();

      const current = dayRanges.get(dayKey);
      if (!current) {
        dayRanges.set(dayKey, { min: start, max: end });
      } else {
        dayRanges.set(dayKey, {
          min: Math.min(current.min, start),
          max: Math.max(current.max, end)
        });
      }
    });

    // 2. Filter existing slots: Remove those that fall within the new ranges
    // "Remove ones that do not adapt" -> We assume any existing slot within the [min, max] 
    // of the new slots for that day should be replaced by the new slots.
    const filteredExistingSlots = savedSlots.filter(slot => {
      const dayKey = format(slot.start, 'yyyy-MM-dd');
      const range = dayRanges.get(dayKey);

      if (range) {
        const slotStart = slot.start.getTime();
        // If the slot starts within the range being updated, remove it (filter out)
        // We use < max to allow a slot to start exactly when the new range ends (though unlikely with gaps)
        if (slotStart >= range.min && slotStart < range.max) {
          return false;
        }
      }
      return true;
    });

    // 3. Combine and Sort
    const allSlots = [...filteredExistingSlots, ...newSlots];

    // Deduplicate just in case (though the logic above should handle most conflicts)
    const uniqueSlotsMap = new Map<number, { start: Date; end: Date }>();
    allSlots.forEach(slot => {
      uniqueSlotsMap.set(slot.start.getTime(), slot);
    });

    const finalSlots = Array.from(uniqueSlotsMap.values())
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    setSavedSlots(finalSlots);

    console.log('Final Slots to be sent to database:', finalSlots);

    if (onSlotsChange) {
      onSlotsChange(finalSlots);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <CustomButton
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{ minWidth: '200px' }}
        >
          Manage Interview Slots
        </CustomButton>
      </Box>

      {savedSlots.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Availability ({savedSlots.length} slots)
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 2,
            }}
          >
            {savedSlots.map((slot, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                  {format(slot.start, 'EEEE, MMM d')}
                </Typography>
                <Typography variant="body1" color="primary.main">
                  {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <InterviewSlots
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSlots}
      />
    </Box>
  );
};

export default InterviewSlotManager;
