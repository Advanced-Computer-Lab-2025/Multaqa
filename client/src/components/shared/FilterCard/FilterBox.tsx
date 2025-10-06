"use client";
import * as React from 'react';
import { Box, Typography,useTheme, Accordion, AccordionSummary, AccordionDetails,} from '@mui/material';
import CustomButton from '../Buttons/CustomButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FilterCardWrapper,WebkitScrollbarStyles} from './styles';
import {FilterBoxProps, FilterGroup } from './types';
import {renderChipGroup, renderInputOrSelect} from './utils';


const FilterBox: React.FC<FilterBoxProps> = ({ filterGroups, onFilterChange, currentFilters, sx, onReset }) => {
    const theme = useTheme();
    const renderFilter = (group: FilterGroup) => {
        switch (group.type) {
            case 'chip':
                return renderChipGroup(group, currentFilters, onFilterChange);
            case 'text':
            case 'select':
                return renderInputOrSelect(group, currentFilters, onFilterChange);
            default:
                return <Typography color="error" variant="body2">Unsupported filter type: {group.type}</Typography>;
        }
    };
    return (
        <FilterCardWrapper sx={{width:"300px"}}> 
            <Box sx={{ 
                maxHeight:"500px", 
                overflow:"auto", 
                ...(typeof WebkitScrollbarStyles === 'function' ? WebkitScrollbarStyles(theme) : WebkitScrollbarStyles || {}), 
                mt: 0, 
                '& > div:not(:last-child)': { mb:1 } 
            }}>
                {filterGroups.map((group, index) => (
                    <Accordion 
                        key={group.id}
                        slotProps={{ heading: { component: 'h4' } }} 
                        defaultExpanded 
                        color="primary" 
                        sx={{ 
                            backgroundColor:"transparent",
                            boxShadow:"none", 
                            borderRadius:"0px",
                            borderTop: index > 0 ? `1px solid ${theme.palette.primary.main}` : 'none',
                            borderBottom:'none',
                        }} 
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel-${group.id}-content`}
                            id={`panel-${group.id}-header`}
                            sx={{
                                minHeight: '32px',
                                padding: theme.spacing(0, 1.5),

                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: '600', fontSize: '0.78rem', fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}>
                                {group.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                        sx={{ 
                            paddingTop: theme.spacing(0), 
                            paddingBottom: theme.spacing(1), 
                            paddingLeft: theme.spacing(2), 
                            paddingRight: theme.spacing(2), 
                        }}
                    >
                        <Box key={group.id} sx={{ pt: 0, pb: 0 }}>
                            {renderFilter(group)}
                        </Box>
                    </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            {/* Action Buttons */}
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap:1 }}>
                <CustomButton size="small" variant="text" sx={{px: 1.5, fontWeight: 600, width:"w-fit", height:"28px", padding:"10px" }} onClick={() => {
                    if (onReset) {
                        onReset();
                        return;
                    }
                    // Default reset behavior: compute sensible empty defaults per group
                    filterGroups.forEach(group => {
                        switch (group.type) {
                            case 'chip':
                            case 'text':
                                onFilterChange(group.id, []);
                                break;
                            case 'select':
                            case 'sort':
                                onFilterChange(group.id, group.options?.[0]?.value ?? '');
                                break;
                            case 'range':
                                onFilterChange(group.id, [group.min ?? 0, group.max ?? 100]);
                                break;
                            default:
                                onFilterChange(group.id, null);
                        }
                    });
                }}>
                    Reset Filters
                </CustomButton>
               <CustomButton size="small" variant="contained" sx={{px: 1.5, width:"w-fit", height:"28px" ,fontWeight: 600, padding:"10px" }}>
                    Apply Filters
                </CustomButton>
            </Box>
        </FilterCardWrapper>
    );
};

export default FilterBox;