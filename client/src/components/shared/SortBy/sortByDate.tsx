// components/shared/SortByDate.tsx
"use client";

import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, useTheme } from '@mui/material';
import { format } from 'date-fns';

type SortOption = {
  label: string;
  value: string; // matches your sorting logic
};

const SORT_OPTIONS: SortOption[] = [
  { label: 'Earliest Start Date', value: 'start_asc' },
  { label: 'Latest Start Date', value: 'start_desc' },
];

interface SortByDateProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const SortByDate: React.FC<SortByDateProps> = ({ 
  value, 
  onChange, 
  label = "Sort by" 
}) => {
  const theme = useTheme();

  return (
    <FormControl sx={{ minWidth: 200 }} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value as string)}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          fontSize: '14px',
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortByDate;