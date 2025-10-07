"use client";
import * as React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Theme, IconButton, InputBase, Select, Typography, TextField } from '@mui/material';
import DatePicker  from "../../mui-lab/DatePicker";
import Chip from '../../Chip/Chip';
import {FilterGroup } from '../types';
import ArrowDropDownIcon from '@mui/icons-material/Search';
import SearchIcon from '@mui/icons-material/Search';


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
        const options = group.options?.map(o => o.label) ?? [];

            const TextSelector: React.FC = () => {
            const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
            const open = Boolean(anchorEl);
            const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
            const handleClose = () => setAnchorEl(null);
            const toggleOption = (label: string) => {
                const newValues = values.includes(label)
                    ? values.filter(v => v !== label)
                    : [...values, label];
                onFilterChange(group.id, newValues);
            };

            const [searchText, setSearchText] = React.useState('');
            const filteredOptions = options.filter(opt =>
                opt.toLowerCase().includes(searchText.toLowerCase()) && !values.includes(opt)
            );

            return (
                <Box sx={{ width: '100%' }}>
                    {/* Top: search area with thin underline and right-side icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,pb: 0.5 }}>
                        <InputBase
                            value={searchText}
                            placeholder='Filter by Event name/ Professor'
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchText && filteredOptions.length > 0) {
                                    toggleOption(filteredOptions[0]);
                                    setSearchText('');
                                    handleClose();
                                }
                            }}
                            sx={{
                                flexGrow: 1,
                                minWidth: '100px',
                                backgroundColor: theme.palette.background.default,
                                '& input': { padding: 0 },
                                fontSize: '0.7rem',
                            }}
                        />

                        <IconButton
                            size="small"
                            onClick={handleOpen}
                            aria-label={`Open ${group.title} options`}
                            sx={{
                                p: 0.5,
                                color: theme.palette.text.secondary,
                                '&:hover': { background: 'transparent' }
                            }}
                        >
                            <SearchIcon fontSize="small" sx={{ stroke: theme.palette.text.secondary, strokeWidth: 0.5 }}/>
                        </IconButton>
                    </Box>

                    {/* Bottom: selected chips (under the search area) */}
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
};