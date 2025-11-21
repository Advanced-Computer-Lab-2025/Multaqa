"use client";
import * as React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Theme, IconButton, InputBase, Select, Typography, TextField } from '@mui/material';
import Chip from '../../Chip/Chip';
import {FilterGroup } from '../types';
import ArrowDropDownIcon from '@mui/icons-material/Search';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Ensure this import is available
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Or another adapter
import dayjs, { Dayjs } from 'dayjs'; // Import dayjs or your preferred date library


export const isSelected = (groupId: string, value: string | number, currentFilters: Record<string, any>): boolean => {
    const current = currentFilters[groupId];
    if (Array.isArray(current)) return current.includes(value);
    return current === value;
};

export const getPressedShadowString = (theme: Theme): string => {
    // Colors adopted from the NeumorphicBox and original theme analysis
    const lightShadowColor = theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.common.white, 0.06);
    const darkShadowColor = alpha(theme.palette.common.black, 0.25); 
    
    return `inset 2px 2px 5px 0 ${darkShadowColor}, inset -2px -2px 5px 0 ${lightShadowColor}`;
};

export const getLiftedShadowString = (theme: Theme): string => {
    const lightShadowColor = '#FAFBFF';
    const darkShadowColor = alpha(theme.palette.common.black, 0.1);
    return `-3px -3px 6px 0 ${lightShadowColor}, 3px 3px 6px 0 ${darkShadowColor}`;
};

export const renderChipGroup = (group: FilterGroup, currentFilters: Record<string, any>, onFilterChange: (groupId: string, value: any) => void) => {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.1}}>
            {group.options?.map((option) => {
                const active = isSelected(group.id, option.value, currentFilters);
                return (
                    <Chip
                        key={option.value}
                        label={option.label}
                        active={active}
                        deletable={false}
                        onClick={() => onFilterChange(group.id, option.value)}
                        sx={{ maxWidth: '100%', wordBreak: 'break-word', fontWeight: active ? 700 : 500 }}
                    />
                );
            })}
        </Box>
    );
};

export const renderInputOrSelect = (group: FilterGroup, currentFilters: Record<string, any>, onFilterChange: (groupId: string, value: any) => void) => {
    const theme = useTheme();
    
    if (group.type === 'text') {
        const values: string[] = currentFilters[group.id] || [];
        const options = group.options?.map(o => o.label) ?? []; // Still map options for suggestions

        const TextSelector: React.FC = () => {
            // ... (Anchor/Menu state is likely unused if you removed the dropdown) ...
            const [searchText, setSearchText] = React.useState('');
            
            // Re-define toggleOption for consistency, though it's mainly for deleting chips
            const toggleOption = (label: string) => {
                const newValues = values.includes(label)
                    ? values.filter(v => v !== label)
                    : [...values, label];
                onFilterChange(group.id, newValues);
            };

            // *** NEW CORE SUBMISSION FUNCTION ***
            const handleSearchSubmit = () => {
                const trimmedText = searchText.trim();
                
                if (trimmedText && !values.includes(trimmedText)) {
                    // 1. Add the current search text as a new filter chip
                    onFilterChange(group.id, [...values, trimmedText]); 
                    // 2. Clear the input field after successful submission
                    setSearchText(''); 
                }
            };
            // **********************************

            const filteredOptions = options.filter(opt =>
                opt.toLowerCase().includes(searchText.toLowerCase()) && !values.includes(opt)
            );

            return (
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,pb: 0.5 }}>
                        <InputBase
                            value={searchText}
                            placeholder='Type to filter...'
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // FIX: Call the search submit function on Enter
                                    handleSearchSubmit();
                                    e.preventDefault(); // Prevent accidental form submission
                                } else if (e.key === 'Tab' && filteredOptions.length > 0) {
                                    // Optional: Keep old tab auto-select if needed
                                    // You can remove this block if tab behavior is not required
                                    toggleOption(filteredOptions[0]);
                                    setSearchText('');
                                    e.preventDefault(); 
                                }
                            }}
                            sx={{
                                flexGrow: 1,
                                minWidth: '100px',
                                backgroundColor: theme.palette.background.default,
                                '& input': { padding: 0 },
                                fontSize: '0.75rem',
                                fontWeight:"550"
                            }}
                        />

                        <IconButton
                            size="small"
                            // FIX: Click on search icon now triggers the filter
                            onClick={handleSearchSubmit} 
                            aria-label={`Apply ${group.title} filter`}
                            sx={{
                                p: 0.5,
                                color: theme.palette.text.secondary,
                                '&:hover': { background: 'transparent' }
                            }}
                        >
                            <SearchIcon fontSize="small" sx={{ stroke: theme.palette.text.secondary, strokeWidth: 0.5 }}/>
                        </IconButton>
                    </Box>

                    {/* Bottom: selected chips (already correctly using 'values' state) */}
                    <Box sx={{ mt: 0.6, display: 'flex', flexWrap: 'wrap', gap: 0.45 }}>
                        {values.map((v, i) => (
                            <Chip
                                key={v + i}
                                label={v}
                                deletable
                                onDelete={() => toggleOption(v)}
                                sx={{ fontWeight: 700, height: 24, padding: '2px 6px', fontSize: '0.72rem' }}
                            />
                        ))}
                    </Box>
                </Box>
            );
        };
        return <TextSelector />;
    }
        if (group.type === 'select' || group.type === 'sort') {
        const selectedValue = currentFilters[group.id] ?? (group.options?.[0]?.value ?? '');
        const selectedLabel = group.options?.find(o => o.value === selectedValue)?.label ?? '';

        return (
            <Select
                value={selectedValue}
                onChange={(e) => onFilterChange(group.id, e.target.value)}
                fullWidth
                size="small"
                renderValue={() => (
                    <Chip label={selectedLabel} variant="select" deletable={false} sx={{ height: 22 }} />
                )}
                sx={{ 
                    borderRadius: '12px',
                    boxShadow: getLiftedShadowString(theme),
                    backgroundColor: theme.palette.background.default,
                    minHeight: 32,
                    '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 7px',
                    },
                    '& .MuiSelect-icon': {
                        color: theme.palette.text.secondary,
                    }
                }}
                IconComponent={ArrowDropDownIcon}
            >
            </Select>
        );
    }

        if (group.type === 'date') {
        // Filter value is the date, stored as a string or null
        const selectedDateString = currentFilters[group.id];
        
        // Convert string state to Dayjs object for the DatePicker
        const selectedDate: Dayjs | null = selectedDateString ? dayjs(selectedDateString) : null;

        const handleDateChange = (newDate: Dayjs | null) => {
            let valueToStore: string | null = null;

            if (newDate && newDate.isValid()) {
                // Store the date as an ISO string (e.g., 'YYYY-MM-DD') for comparison
                valueToStore = newDate.format('YYYY-MM-DD'); 
            }
            // Update the parent state
            onFilterChange(group.id, valueToStore); 
        };

        return (
            // NOTE: You must have a LocalizationProvider wrapper higher up in your component tree
            <DatePicker
                label={group.title}
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                popper: {
                    sx: {
                        zIndex: 2000, 
                    },
                },
                textField: { 
                    fullWidth: true, 
                    size: 'small',
                    // Hides the floating label placeholder, ensuring only the value is shown
                    label: null, 
                    sx: {
                         '& .MuiInputBase-root': {
                            height: 32,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: '20px',
                            boxShadow: getLiftedShadowString(theme),
                            fontFamily: "var(--font-poppins), system-ui, sans-serif", 
                         },
                         '& .MuiInputBase-input': {
                            fontSize: '0.75rem',
                            padding: '4px 14px',
                            // Ensure font is applied directly to the input element
                            fontFamily: "var(--font-poppins), system-ui, sans-serif",  
                         }
                    }
                }
            }}
        />
    );
}
};