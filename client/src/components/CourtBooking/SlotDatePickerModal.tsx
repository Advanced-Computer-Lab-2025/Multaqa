"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import CustomModalLayout from "@/components/shared/modals/CustomModalLayout";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { formatDayLabel } from "./utils";

interface SlotDatePickerModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (nextDate: string | null) => void;
  selectedDate: string | null;
  courtName?: string;
  availableDates?: string[];
}

const SlotDatePickerModal: React.FC<SlotDatePickerModalProps> = ({
  open,
  onClose,
  onApply,
  selectedDate,
  courtName,
  availableDates,
}) => {
  const availableSet = useMemo(() => {
    if (!availableDates || availableDates.length === 0) return null;
    return new Set(availableDates);
  }, [availableDates]);

  const fallbackIso = useMemo(() => {
    if (selectedDate) return selectedDate;
    if (availableDates && availableDates.length > 0) {
      return availableDates[0];
    }
    return dayjs().format("YYYY-MM-DD");
  }, [availableDates, selectedDate]);

  const [value, setValue] = useState<Dayjs>(dayjs(fallbackIso));

  useEffect(() => {
    setValue(dayjs(fallbackIso));
  }, [fallbackIso, open]);

  const handleConfirm = () => {
    if (!value) return;
    onApply(value.format("YYYY-MM-DD"));
  };

  const handleReset = () => {
    onApply(null);
  };

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      width="w-[95vw] sm:w-[360px]"
    >
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {courtName ? `Choose a date for ${courtName}` : "Choose a date"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedDate
            ? `Currently viewing ${formatDayLabel(selectedDate)}`
            : "Pick a day to see that court's availability."}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => {
              if (newValue) {
                setValue(newValue);
              }
            }}
            disablePast
            shouldDisableDate={
              availableSet && availableSet.size > 0
                ? (date) => !availableSet.has(date.format("YYYY-MM-DD"))
                : undefined
            }
          />
        </LocalizationProvider>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          alignItems="center"
          flexWrap="nowrap"
          sx={{ overflowX: "auto" }}
        >
          <CustomButton
            variant="outlined"
            color="secondary"
            size="small"
            label="Reset"
            onClick={handleReset}
          />
          <CustomButton
            variant="contained"
            color="tertiary"
            size="small"
            label="Apply"
            onClick={handleConfirm}
          />
        </Stack>
      </Stack>
    </CustomModalLayout>
  );
};

export default SlotDatePickerModal;
