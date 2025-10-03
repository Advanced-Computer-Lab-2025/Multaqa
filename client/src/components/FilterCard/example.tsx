"use client";
import * as React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import lightTheme from '../../themes/lightTheme'; 
import FilterBox, { FilterGroup } from './FilterBox'; 
import FilterPanel from './FilterPanel';

// EXAMPLE DATA
const stakeholderFilterData: FilterGroup[] = [
    {
        id: 'eventName',
        title: 'Event Name',
            type: 'text',
            options: [
                { label: 'Intro to AI', value: 'Intro to AI' },
                { label: 'Advanced Databases', value: 'Advanced Databases' },
                { label: 'Webshop UX', value: 'Webshop UX' },
                { label: 'Linear Algebra Lecture', value: 'Linear Algebra Lecture' },
            ]
    },
    {
        id: 'eventType',
        title: 'Event Type',
        type: 'chip',
        options: [
            { label: 'Workshop', value: 'wk' },
            { label: 'Conference', value: 'conf' },
            { label: 'Lecture', value: 'lec' },
            { label: 'Training', value: 'train' },
        ],
    },
    {
        id: 'location',
        title: 'Location',
        type: 'chip',
        options: [
            { label: 'Campus', value: 'main' },
            { label: 'Online', value: 'online' },
            { label: 'Off-site', value: 'offsite' },
        ],
    },
        {
        id: 'attendeeCount',
        title: 'Attendee Count',
        type: 'range',
        min: 5,
        max: 500,
    },
];

// RENDER COMPONENT WITH STATE LOGIC

const FilterDemo = () => {
    // 3. State initialization: set some filters to see the 'pressed' effect immediately
    const [currentFilters, setCurrentFilters] = React.useState<Record<string, any>>({
        eventType: ['wk', 'conf'], // Chips pre-selected
        location: ['online'], // Checkbox pre-selected
        attendeeCount: [100, 400], // Range slider initial value
    });

    // 4. State Update Handler: handles all filter types (single/multi-select)
    const handleFilterChange = React.useCallback((groupId: string, value: any) => {
        setCurrentFilters(prevFilters => {
            const currentVal = prevFilters[groupId];
            
            // Logic for Chips and Checkboxes (Multi-Select/Toggle)
            if (Array.isArray(currentVal) && (groupId === 'eventType' || groupId === 'location')) {
                if (currentVal.includes(value)) {
                    // Deselect: remove value from array
                    return { ...prevFilters, [groupId]: currentVal.filter(v => v !== value) };
                } else {
                    // Select: add value to array
                    return { ...prevFilters, [groupId]: [...currentVal, value] };
                }
            }
            
            // Logic for Text, Range, Select/Sort (Single-Value Update)
            return { ...prevFilters, [groupId]: value };
        });
    }, []);

    return (
        <Box
            sx={{
                // Ensure background matches theme default for Neumorphic effect
                backgroundColor: lightTheme.palette.background.default, 
                minHeight: '100vh',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
            {/* The Filter Panel (trigger + popper) */}
            <FilterPanel
                filterGroups={stakeholderFilterData}
                onFilterChange={handleFilterChange}
                currentFilters={currentFilters}
                onReset={() => {
                    setCurrentFilters({
                        eventType: [],
                        location: [],
                        attendeeCount: [5, 500],
                        eventName: [],
                    });
                }}
            />
        </Box>
    );
};

// MAIN WRAPPER

export default function AppWrapper() {
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <FilterDemo />
        </ThemeProvider>
    );
}
