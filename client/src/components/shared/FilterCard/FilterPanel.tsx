"use client";
import * as React from 'react';
import { Box, Popper, ClickAwayListener, Grow, Paper } from '@mui/material';
import { FilterGroup } from './types';
import FilterBox from "./FilterBox"
import CustomButton from '../Buttons/CustomButton';

interface FilterPanelProps {
    filterGroups: FilterGroup[];
    onFilterChange: (groupId: string, value: any) => void;
    currentFilters: Record<string, any>;
    onReset?: () => void;
    matchSearchBar?: boolean; // Optional prop to match search bar height
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filterGroups, onFilterChange, currentFilters, onReset, matchSearchBar = false }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement | null>(null);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = (event?: MouseEvent | TouchEvent) => {
        setOpen(false);
    };

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        if (open) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <Box>
            <CustomButton
                ref={anchorRef}
                size={matchSearchBar ? "medium" : "small"}
                variant="outlined"
                onClick={handleToggle}
                aria-haspopup="true"
                aria-expanded={open}
                aria-label={open ? 'Close filters' : 'Open filters'}
                sx={matchSearchBar ? {
                    py: 1.75,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 500,
                } : {}}
            >
                Filter
            </CustomButton>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                transition
                style={{ zIndex: 1400 }}
                modifiers={[
                    // small offset to create visible space between button and panel
                    { name: 'offset', options: { offset: [0, 10] } },
                    // prevent flipping for now; keep the panel below the trigger
                    { name: 'flip', options: { fallbackPlacements: [] } },
                ]}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
                        {/* Make Paper transparent and remove border so FilterBox shadows render without seams */}
                        <Paper elevation={0} sx={{ borderRadius: 2, p: 0, backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box sx={{ p: 0 }}>
                                    {/* Constrain the inner FilterBox width so chips wrap to multiple lines rather than forcing horizontal expansion */}
                                    <FilterBox
                                        filterGroups={filterGroups}
                                        onFilterChange={onFilterChange}
                                        currentFilters={currentFilters}
                                        onReset={onReset}
                                        sx={{ maxWidth: 320, width: '320px' }}
                                    />
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    );
};

export default FilterPanel;
