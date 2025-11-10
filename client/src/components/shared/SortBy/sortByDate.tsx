// components/shared/SortByDate.tsx
"use client";

import React from 'react';
import { Select, MenuItem, FormControl, Box, useTheme, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';

type SortOption = {
  label: string;
  value: string; // matches your sorting logic
};

const SORT_OPTIONS: SortOption[] = [
{ label: 'Sort By', value: 'none' },
{ label: 'Earliest Start Date', value: 'start_asc' },
{ label: 'Latest Start Date', value: 'start_desc' },
];

interface SortByDateProps {
  value: string;
  onChange: (value: string) => void;
}

const SortByDate: React.FC<SortByDateProps> = ({ value = '', onChange }) => {
  const theme = useTheme();

  return (
    <FormControl sx={{ minWidth: 150 }} size="small">
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontFamily: 'var(--font-poppins)',
                fontSize: '14px',
              }}
            >
              {selected ? SORT_OPTIONS.find((option) => option.value === selected)?.label : 'Sort by'}
            </Typography>
            <ArrowDropDownIcon sx={{ fontSize: '16px' }} />
          </Box>
        )}
        sx={{
          border: 'none', // Remove border
          fontSize: '14px',
          fontFamily: 'var(--font-poppins)',
          fontWeight: 600,
          padding: '0px', // Remove padding
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove the default outline
          },
          '& .MuiSelect-icon': {
            display: 'none', // Hide default dropdown icon
          },
        }}
        IconComponent={() => null} // Remove default dropdown icon
      >
        {SORT_OPTIONS.filter((option) => option.value !== 'none').map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {option.label}
            {value === option.value && <CheckIcon sx={{ fontSize: '16px', color: theme.palette.primary.main }} />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortByDate;