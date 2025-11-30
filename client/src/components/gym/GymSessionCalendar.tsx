"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, alpha, Select, MenuItem, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface GymSessionCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
  minDate?: Date;
  labelColor?: string;
}

export default function GymSessionCalendar({
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
  minDate = new Date(),
  labelColor,
}: GymSessionCalendarProps) {
  const theme = useTheme();
  const accentColor = labelColor || theme.palette.primary.main;

  // Initialize with current date or selected value
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [selectedHour, setSelectedHour] = useState(value?.getHours() || 9);
  const [selectedMinute, setSelectedMinute] = useState(value?.getMinutes() || 0);

  // Calculate max date (end of next month)
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const isToday = (day: number) => {
    const checkDate = new Date(year, month, day);
    return (
      checkDate.getFullYear() === today.getFullYear() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getDate() === today.getDate()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isDisabled = (day: number) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);
    const minDateCheck = new Date(minDate);
    minDateCheck.setHours(0, 0, 0, 0);

    return checkDate < minDateCheck || checkDate > maxDate;
  };

  const handleDateClick = (day: number) => {
    if (isDisabled(day)) return;

    const newDate = new Date(year, month, day, selectedHour, selectedMinute);
    setSelectedDate(newDate);
    onChange(newDate);
  };

  const handleTimeChange = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hour, minute);
      onChange(newDate);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    // Don't allow navigation beyond next month
    const nextMonthDate = new Date(year, month + 1, 1);
    if (nextMonthDate <= maxDate) {
      setCurrentMonth(nextMonthDate);
    }
  };

  const canGoNext = new Date(year, month + 1, 1) <= maxDate;
  const canGoPrev = new Date(year, month, 1) >= new Date(today.getFullYear(), today.getMonth(), 1);

  // Generate calendar days
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<Box key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDisabled(day);
    const selected = isSelected(day);
    const todayDate = isToday(day);

    days.push(
      <Box
        key={day}
        onClick={() => handleDateClick(day)}
        sx={{
          aspectRatio: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.875rem",
          fontWeight: selected || todayDate ? 700 : 500,
          borderRadius: "50%",
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: selected
            ? accentColor
            : todayDate
              ? alpha(accentColor, 0.15)
              : "transparent",
          color: selected
            ? "#fff"
            : disabled
              ? alpha(theme.palette.text.primary, 0.3)
              : todayDate
                ? accentColor
                : theme.palette.text.primary,
          border: todayDate && !selected ? `2px solid ${alpha(accentColor, 0.4)}` : "none",
          transition: "all 0.2s ease",
          opacity: disabled ? 0.4 : 1,
          "&:hover": disabled
            ? {}
            : {
              backgroundColor: selected ? accentColor : alpha(accentColor, 0.25),
              transform: "scale(1.1)",
            },
        }}
      >
        {day}
      </Box>
    );
  }

  return (
    <Box onBlur={onBlur}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: error ? theme.palette.error.main : accentColor,
        }}
      >
        Start Date & Time
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          p: 2.5,
          border: error ? `2px solid ${theme.palette.error.main}` : `2px solid ${alpha(accentColor, 0.2)}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Month Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <IconButton
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            size="small"
            sx={{
              color: accentColor,
              "&:disabled": { color: alpha(theme.palette.text.primary, 0.3) },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: accentColor,
            }}
          >
            {currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
          </Typography>

          <IconButton
            onClick={handleNextMonth}
            disabled={!canGoNext}
            size="small"
            sx={{
              color: accentColor,
              "&:disabled": { color: alpha(theme.palette.text.primary, 0.3) },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Day Headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            mb: 1,
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <Box
              key={i}
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#999",
                textAlign: "center",
              }}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.5,
            mb: 2,
          }}
        >
          {days}
        </Box>

        {/* Time Selection */}
        <Box
          sx={{
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: accentColor }}>
            Time:
          </Typography>

          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={selectedHour}
              onChange={(e) => handleTimeChange(Number(e.target.value), selectedMinute)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(accentColor, 0.3),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {i.toString().padStart(2, "0")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2">:</Typography>

          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={selectedMinute}
              onChange={(e) => handleTimeChange(selectedHour, Number(e.target.value))}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(accentColor, 0.3),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
              }}
            >
              {[0, 15, 30, 45].map((minute) => (
                <MenuItem key={minute} value={minute}>
                  {minute.toString().padStart(2, "0")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Selected Date Display */}
        {selectedDate && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" sx={{ color: accentColor, fontWeight: 600 }}>
              Selected: {selectedDate.toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error Message */}
      {error && errorMessage && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.error.main,
            mt: 0.5,
            display: "block",
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}
