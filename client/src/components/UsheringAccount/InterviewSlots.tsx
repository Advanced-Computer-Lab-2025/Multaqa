'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, alpha } from '@mui/material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import CustomButton from '../shared/Buttons/CustomButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import CustomTextField from '../shared/input-fields/CustomTextField';
import { format } from 'date-fns';
import { Calendar, Clock, Layers, ArrowRight, Check } from 'lucide-react';

interface InterviewSlotsProps {
  open: boolean;
  onClose: () => void;
  onSave: (slots: { start: Date; end: Date }[]) => void;
  teamColor?: string; // Optional team color for theming
  teamName?: string; // Optional team name for display
}

type SlotMode = 'single' | 'range';

const InterviewSlots: React.FC<InterviewSlotsProps> = ({
  open,
  onClose,
  onSave,
  teamColor = '#009688', // Default teal
  teamName = 'Team',
}) => {
  const [mode, setMode] = useState<SlotMode>('single');
  const [singleDate, setSingleDate] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<string>('30');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [increment, setIncrement] = useState<string>('30');
  const [gap, setGap] = useState<string>('0');
  const [previewSlots, setPreviewSlots] = useState<{ start: Date; end: Date }[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Generate slots based on current mode and inputs
  const generateSlots = (): { start: Date; end: Date }[] => {
    if (mode === 'single') {
      if (singleDate && duration) {
        const dur = parseInt(duration, 10);
        if (!isNaN(dur) && dur > 0) {
          const start = singleDate.toDate();
          const end = singleDate.add(dur, 'minute').toDate();
          return [{ start, end }];
        }
      }
    } else {
      if (startDate && endDate && increment) {
        const slots: { start: Date; end: Date }[] = [];
        const inc = parseInt(increment, 10);
        const gapTime = parseInt(gap, 10) || 0;

        if (isNaN(inc) || inc <= 0) return [];

        let currentDay = startDate.startOf('day');
        const lastDay = endDate.startOf('day');

        const startHour = startDate.hour();
        const startMinute = startDate.minute();
        const endHour = endDate.hour();
        const endMinute = endDate.minute();

        while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay)) {
          let slotTime = currentDay.hour(startHour).minute(startMinute);
          const dayEndTime = currentDay.hour(endHour).minute(endMinute);

          while (slotTime.isBefore(dayEndTime) || slotTime.isSame(dayEndTime)) {
            const slotEnd = slotTime.add(inc, 'minute');
            slots.push({ start: slotTime.toDate(), end: slotEnd.toDate() });
            slotTime = slotTime.add(inc + gapTime, 'minute');
          }

          currentDay = currentDay.add(1, 'day');
        }
        return slots;
      }
    }
    return [];
  };

  // Handle preview button click
  const handlePreview = () => {
    const slots = generateSlots();
    setPreviewSlots(slots);
    setShowPreview(true);
  };

  // Handle save - generate and save directly
  const handleSave = () => {
    const slots = generateSlots();
    if (slots.length > 0) {
      onSave(slots);
      // Reset form
      setSingleDate(null);
      setStartDate(null);
      setEndDate(null);
      setPreviewSlots([]);
      setShowPreview(false);
      onClose();
    }
  };

  // Check if form is valid
  const isFormValid = mode === 'single'
    ? singleDate && duration && parseInt(duration, 10) > 0
    : startDate && endDate && increment && parseInt(increment, 10) > 0;

  // Mode chip styles
  const modeChipStyles = (isSelected: boolean) => ({
    px: 3,
    py: 2.5,
    height: 'auto',
    borderRadius: 3,
    fontWeight: isSelected ? 600 : 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: '2px solid',
    borderColor: isSelected ? teamColor : 'transparent',
    backgroundColor: isSelected ? alpha(teamColor, 0.08) : 'rgba(0, 0, 0, 0.04)',
    color: isSelected ? teamColor : 'text.secondary',
    '&:hover': {
      backgroundColor: alpha(teamColor, 0.12),
      borderColor: teamColor,
    },
    '& .MuiChip-label': {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
  });

  // Date picker styles
  const datePickerStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: '#fafafa',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: teamColor,
          borderWidth: 2,
        },
      },
    },
  };

  // Slot preview chip styles
  const slotChipStyles = {
    px: 2,
    py: 1,
    height: 'auto',
    backgroundColor: alpha(teamColor, 0.1),
    color: teamColor,
    border: `1px solid ${alpha(teamColor, 0.3)}`,
    borderRadius: 2,
    fontSize: '0.8rem',
    fontWeight: 500,
    '& .MuiChip-label': {
      px: 0,
    },
  };

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title="Create Interview Slots"
      width="md:w-[650px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '70vh' }}>
        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3, mt: 1, pr: 1 }}>
          {/* Mode Selection */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}
            >
              Slot Creation Mode
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Calendar size={18} />
                    <span>Single Slot</span>
                  </Stack>
                }
                onClick={() => {
                  setMode('single');
                  setShowPreview(false);
                  setPreviewSlots([]);
                }}
                sx={modeChipStyles(mode === 'single')}
              />
              <Chip
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Layers size={18} />
                    <span>Multiple Slots</span>
                  </Stack>
                }
                onClick={() => {
                  setMode('range');
                  setShowPreview(false);
                  setPreviewSlots([]);
                }}
                sx={modeChipStyles(mode === 'range')}
              />
            </Stack>
          </Box>

          {/* Form Fields */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#fafafa',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {mode === 'single' ? (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Typography
                    variant="caption"
                    sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Clock size={14} />
                      <span>Start Date & Time</span>
                    </Stack>
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={singleDate}
                      onChange={(newValue) => setSingleDate(newValue)}
                      minDateTime={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          placeholder: 'Select date and time',
                          sx: datePickerStyles,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Typography
                    variant="caption"
                    sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
                  >
                    Duration (minutes)
                  </Typography>
                  <CustomTextField
                    name="duration"
                    fieldType="numeric"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(teamColor, 0.08),
                    border: `1px solid ${alpha(teamColor, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" sx={{ color: teamColor }}>
                    💡 Slots will be generated for each day in the range, from start time to end time.
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Clock size={14} />
                        <span>Start Date & Time</span>
                      </Stack>
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        minDateTime={dayjs()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            sx: datePickerStyles,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
                    >
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ArrowRight size={14} />
                        <span>End Date & Time</span>
                      </Stack>
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDateTime={startDate || undefined}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            sx: datePickerStyles,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
                    >
                      Slot Duration (minutes)
                    </Typography>
                    <CustomTextField
                      name="increment"
                      fieldType="numeric"
                      value={increment}
                      onChange={(e) => setIncrement(e.target.value)}
                      placeholder="30"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 500 }}
                    >
                      Gap Between Slots (minutes)
                    </Typography>
                    <CustomTextField
                      name="gap"
                      fieldType="numeric"
                      value={gap}
                      onChange={(e) => setGap(e.target.value)}
                      placeholder="0"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          {/* Preview Section */}
          {showPreview && previewSlots.length > 0 && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: '#fff',
                border: '1px solid',
                borderColor: 'divider',
                maxHeight: '180px',
                overflowY: 'auto',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
              >
                Preview ({previewSlots.length} slot{previewSlots.length !== 1 ? 's' : ''})
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {previewSlots.map((slot, index) => (
                  <Chip
                    key={index}
                    label={`${format(slot.start, 'MMM d')} • ${format(slot.start, 'h:mm a')} - ${format(slot.end, 'h:mm a')}`}
                    sx={slotChipStyles}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Action Buttons - Fixed at bottom */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{
            pt: 2,
            mt: 'auto',
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#fff',
          }}
        >
          <CustomButton
            variant="outlined"
            onClick={handlePreview}
            disabled={!isFormValid}
            sx={{
              borderColor: alpha(teamColor, 0.5),
              color: teamColor,
              '&:hover': {
                borderColor: teamColor,
                backgroundColor: alpha(teamColor, 0.08),
              },
            }}
          >
            Preview
          </CustomButton>
          <CustomButton
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid}
            startIcon={<Check size={18} />}
            sx={{
              backgroundColor: teamColor,
              '&:hover': {
                backgroundColor: teamColor,
                filter: 'brightness(0.9)',
              },
              '&:disabled': {
                backgroundColor: alpha(teamColor, 0.3),
              },
              borderColor: 'none',
            }}
          >
            Add Slots
          </CustomButton>
        </Stack>
      </Box>
    </CustomModalLayout>
  );
};

export default InterviewSlots;
