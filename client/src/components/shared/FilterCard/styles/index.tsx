import * as React from 'react';
import { Card, SxProps, Theme, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { ContainerType } from '../types';
import { getPressedShadowString } from '../utils';

export const FilterCardWrapper: React.FC<React.PropsWithChildren<{ sx?: SxProps<Theme> }>> = ({ children, sx }) => (
    <Card sx={{ borderRadius: '18px', p: 0, overflow: 'visible', ...sx }}>
        <StyledFilterBox containerType="outwards" sx={{ width: '100%', height: '100%', p: 2 }}>
            {children}
        </StyledFilterBox>
    </Card>
);

export const StyledFilterBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'containerType'
})<{
    containerType: ContainerType;
}>(({ theme, containerType }) => {
    const lightShadowColor = theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.common.white, 0.06);
    const darkShadowColor = alpha(theme.palette.common.black, 0.25);
    return {
        backgroundColor: theme.palette.background.default,
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        transition: 'all 0.3s ease-in-out',
        borderRadius: '20px',
    } as any;
});

export const WebkitScrollbarStyles: SxProps<Theme> = (theme) => ({
    // Target the scrollable container itself
    overflowY: 'auto', // Explicitly ensure vertical scrolling

    '&::-webkit-scrollbar': {
        width: '10px', // Thickness of the scrollbar
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.tertiary.main : theme.palette.tertiary.dark, // Primary color for the thumb
        borderRadius: '10px', // Highly rounded end caps
        minHeight:'4px',
        border: `3px solid ${theme.palette.background.default}`, 
        padding: '2px',
        backgroundClip: 'padding-box',
        //border: `2px solid ${theme.palette.background.default}`, // Subtle border separation
        transition: 'background-color 0.3s',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent', // Light track color
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: theme.palette.mode === 'light' ?  theme.palette.tertiary.main : theme.palette.tertiary.dark, // Darken slightly on hover
    },
});