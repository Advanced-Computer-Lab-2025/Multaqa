"use client";
import * as React from 'react';
import { Chip, SxProps, Theme, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface FilterChipProps {
    label: React.ReactNode;
    active?: boolean;
    deletable?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    variant?: 'default' | 'select';
    sx?: SxProps<Theme>;
}

const getLiftedShadowString = (theme: Theme) => {
    const lightShadowColor = '#FAFBFF';
    const darkShadowColor = alpha(theme.palette.common.black, 0.1);
    return `-3px -3px 6px 0 ${lightShadowColor}, 3px 3px 6px 0 ${darkShadowColor}`;
};

const getSubtlePressedShadow = (theme: Theme) => {
    const lightShadowColor = theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.common.white, 0.06);
    const darkShadowColor = alpha(theme.palette.common.black, 0.15);
    return `inset 1px 1px 2px 0 ${darkShadowColor}, inset -1px -1px 2px 0 ${lightShadowColor}`;
};

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
        color: variant === 'select' ? theme.palette.primary.contrastText : theme.palette.text.primary,
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
