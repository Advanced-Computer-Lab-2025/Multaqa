"use client";
import * as React from 'react';

import { FilterChipProps } from './types';
import { Chip, SxProps, Theme, useTheme} from '@mui/material';
import {getLiftedShadowString, getSubtlePressedShadow} from "./utils";



const FilterChip: React.FC<FilterChipProps> = ({ label, active = false, deletable = false, onClick, onDelete, variant = 'default', sx }) => {
    const theme = useTheme();
    const lifted = getLiftedShadowString(theme);
    const pressed = getSubtlePressedShadow(theme);
    const commonSx: SxProps<Theme> = {
        borderRadius: '50px',
        height: variant === 'select' ? 22 : 20,
        // slightly larger padding for better touch targets
        padding: variant === 'select' ? '4px 10px' : '3px 8px',
        textTransform: 'none',
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        fontSize: variant === 'select' ? '0.68rem' : '0.7rem',
        color: variant === 'select' ? theme.palette.tertiary.dark : theme.palette.tertiary.dark,
        backgroundColor: variant === 'select' ? theme.palette.primary.light : theme.palette.background.default,
        boxShadow: active ? pressed : lifted,
        // keep a visible primary border when deletable/active to match previous style
        border: active ? `1px solid ${theme.palette.primary.main}` : (deletable ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent'),
        '&:hover': { boxShadow: lifted, opacity: 0.98, backgroundColor: variant === 'select' ? theme.palette.primary.light : undefined },
    };
    return (
        <Chip
            label={label}
            onClick={onClick}
            onDelete={deletable ? onDelete : undefined}
            size="small"
            sx={{ ...commonSx, ...(sx as any) }}
        />
    );
};

export default FilterChip;
