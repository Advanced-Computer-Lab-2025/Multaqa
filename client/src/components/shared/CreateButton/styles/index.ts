import {useTheme } from '@mui/material';
import theme from '../../../../themes/lightTheme';
import React from 'react';


export const internalBox = (theme: any) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        cursor: 'pointer',
        borderRadius: '12px', // Rounded corners for the item
        textAlign: 'center',
        transition: 'background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        }}
    )

export const iconStyle = (theme: any) => ({
    fontSize: 28, 
    color: theme.palette.tertiary.main, 
    marginBottom: theme.spacing(0.5) 
})
