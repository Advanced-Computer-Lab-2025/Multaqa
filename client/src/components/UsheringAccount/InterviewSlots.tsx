import React, { useState } from 'react';
import { Box, Typography, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import CustomButton from '../shared/Buttons/CustomButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import CustomTextField from '../shared/input-fields/CustomTextField';
import { format } from 'date-fns';

interface InterviewSlotsProps {
  open: boolean;
  onClose: () => void;
  onSave: (slots: { start: Date; end: Date }[]) => void;
}

const InterviewSlots: React.FC<InterviewSlotsProps> = ({ open, onClose, onSave }) => {
  const [mode, setMode] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<string>('30');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [increment, setIncrement] = useState<string>('30');
  const [gap, setGap] = useState<string>('0');
  const [generatedSlots, setGeneratedSlots] = useState<{ start: Date; end: Date }[]>([]);

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'single' | 'range' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
      setGeneratedSlots([]);
    }
  };

  const handleGenerateSlots = () => {
    if (mode === 'single') {
      if (singleDate && duration) {
        const dur = parseInt(duration, 10);
        if (!isNaN(dur) && dur > 0) {
          const start = singleDate.toDate();
          const end = singleDate.add(dur, 'minute').toDate();
          setGeneratedSlots([{ start, end }]);
        }
      }
    } else {
      if (startDate && endDate && increment) {
        const slots: { start: Date; end: Date }[] = [];
        const inc = parseInt(increment, 10);
        const gapTime = parseInt(gap, 10) || 0;

        if (isNaN(inc) || inc <= 0) return;

        let currentDay = startDate.startOf('day');
        const lastDay = endDate.startOf('day');

        // Extract start and end times (hours/minutes)
        const startHour = startDate.hour();
        const startMinute = startDate.minute();
        const endHour = endDate.hour();
        const endMinute = endDate.minute();

        while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay)) {
          // Set start time for the current day
          let slotTime = currentDay.hour(startHour).minute(startMinute);

          // Set end time for the current day
          const dayEndTime = currentDay.hour(endHour).minute(endMinute);

          // Generate slots for this day
          // Condition changed: slotTime <= dayEndTime to allow the last slot to start at the end time
          while (slotTime.isBefore(dayEndTime) || slotTime.isSame(dayEndTime)) {
            const slotEnd = slotTime.add(inc, 'minute');
            slots.push({ start: slotTime.toDate(), end: slotEnd.toDate() });
            // Add increment AND gap to calculate next slot start time
            slotTime = slotTime.add(inc + gapTime, 'minute');
          }

          // Move to next day
          currentDay = currentDay.add(1, 'day');
        }
        setGeneratedSlots(slots);
      }
    }
  };

  const handleSave = () => {
    onSave(generatedSlots);
    onClose();
  };

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title="Set Interview Slots"
      width="md:w-[600px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="slot mode"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '20px',
                px: 3,
                py: 1,
                border: '1px solid #e0e0e0',
                '&.Mui-selected': {
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                },
              },
            }}
          >
            <ToggleButton value="single">Single Slot</ToggleButton>
            <ToggleButton value="range">Range & Increment</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {mode === 'single' ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Date and Time"
                  value={singleDate}
                  onChange={(newValue) => setSingleDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                name="duration"
                label="Duration (minutes)"
                fieldType="numeric"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                neumorphicBox
                placeholder="e.g. 30"
              />
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              Note: Slots will be generated for each day in the range, starting from the "Start Time" and ending at the "End Time" you specified below.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Time"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Time"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDateTime={startDate || undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  name="increment"
                  label="Increment (minutes)"
                  fieldType="numeric"
                  value={increment}
                  onChange={(e) => setIncrement(e.target.value)}
                  neumorphicBox
                  placeholder="e.g. 30"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  name="gap"
                  label="Gap (minutes)"
                  fieldType="numeric"
                  value={gap}
                  onChange={(e) => setGap(e.target.value)}
                  neumorphicBox
                  placeholder="e.g. 10"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton
            variant="outlined"
            onClick={handleGenerateSlots}
            disabled={
              mode === 'single'
                ? !singleDate || !duration
                : !startDate || !endDate || !increment
            }
          >
            Preview
          </CustomButton>
        </Box>

        {generatedSlots.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2, maxHeight: '200px', overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Preview Slots ({generatedSlots.length}):
            </Typography>
            <Grid container spacing={1}>
              {generatedSlots.map((slot, index) => (
                <Grid key={index}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {format(slot.start, 'MMM d')} | {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          {/* <CustomButton onClick={onClose} variant="text" color="inherit">
            Cancel
          </CustomButton> */}
          <CustomButton
            variant="contained"
            onClick={handleSave}
            disabled={generatedSlots.length === 0}
          >
            Save Slots
          </CustomButton>
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default InterviewSlots;
