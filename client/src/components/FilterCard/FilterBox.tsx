// src/components/shared/filterCard/FilterBox.tsx
"use client";
import * as React from 'react';
import { 
    Box, Typography, Select, useTheme, 
    Card, SxProps, Theme, IconButton, InputBase
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CustomButton from '../Buttons/CustomButton';
import Chip from '../Chip/Chip';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterSlider from '../Slider/FilterSlider';
export { default as SearchTextField } from '../SearchBar/SearchTextField'; 

// 1. TYPE DEFINITIONS
type FilterComponentType = 'chip' | 'select' | 'range' | 'sort' | 'text';
type ContainerType = "inwards" | "outwards";
interface FilterOption { label: string; value: string | number; }

export interface FilterGroup { 
    id: string; 
    title: string; 
    type: FilterComponentType; 
    options?: FilterOption[]; 
    min?: number; 
    max?: number; 
    placeholder?: string;
}

interface FilterBoxProps {
    filterGroups: FilterGroup[];
    onFilterChange: (groupId: string, value: any) => void; 
    currentFilters: Record<string, any>;
    sx?: SxProps<Theme>;
    onReset?: () => void;
}

const isSelected = (groupId: string, value: string | number, currentFilters: Record<string, any>): boolean => {
    const current = currentFilters[groupId];
    if (Array.isArray(current)) return current.includes(value);
    return current === value;
};

const FilterCardWrapper: React.FC<React.PropsWithChildren<{ sx?: SxProps<Theme> }>> = ({ children, sx }) => (
    <Card sx={{ borderRadius: '18px', p: 0, overflow: 'visible', ...sx }}>
        <StyledFilterBox containerType="outwards" sx={{ width: '100%', height: '100%', p: 2 }}>
            {children}
        </StyledFilterBox>
    </Card>
);

// 2. STYLING LOGIC (NEUMORPHIC CONTAINER & HELPERS)
// Helper function to get the Neumorphic "pressed" shadow (used by internal elements)
const getPressedShadowString = (theme: Theme): string => {
    // Colors adopted from the NeumorphicBox and original theme analysis
    const lightShadowColor = theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.common.white, 0.06);
    const darkShadowColor = alpha(theme.palette.common.black, 0.25); 
    
    return `inset 2px 2px 5px 0 ${darkShadowColor}, inset -2px -2px 5px 0 ${lightShadowColor}`;
};

// Reusable local helpers for chip shadows (kept here for FilterBox usage)
const getLiftedShadowString = (theme: Theme): string => {
    const lightShadowColor = '#FAFBFF';
    const darkShadowColor = alpha(theme.palette.common.black, 0.1);
    return `-3px -3px 6px 0 ${lightShadowColor}, 3px 3px 6px 0 ${darkShadowColor}`;
};

// Main Styled Container
const StyledFilterBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'containerType'
})<{
    containerType: ContainerType;
}>(({ theme, containerType }) => {
    const lightShadowColor = theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.common.white, 0.06);
    const darkShadowColor = alpha(theme.palette.common.black, 0.25);

    const getShadows = (type: ContainerType) => {
        const darkShadow = `5px 5px 10px 0 ${darkShadowColor}`;
        const lightShadow = `-5px -5px 10px 0 ${lightShadowColor}`;

        if (type === 'inwards') {
            // Pressed Effect (for selected filters, text inputs)
            return getPressedShadowString(theme);
        }

        // Lifted Effect (for the main card container)
        return `${darkShadow}, ${lightShadow}`;
    };

    return {
        backgroundColor: theme.palette.background.default,
        boxShadow: getShadows(containerType),
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        transition: 'all 0.3s ease-in-out',
        borderRadius: '20px',
    } as any;
});

const renderChipGroup = (group: FilterGroup, currentFilters: Record<string, any>, onFilterChange: (groupId: string, value: any) => void) => {

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

const renderInputOrSelect = (group: FilterGroup, currentFilters: Record<string, any>, onFilterChange: (groupId: string, value: any) => void) => {
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
                                fontSize: '0.75rem',
                                px: 0.7,
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

const renderRangeSlider = (
    group: FilterGroup,
    currentFilters: Record<string, any>,
    onFilterChange: (groupId: string, value: any) => void
) => {
    const theme = useTheme();
    return (
        <Box>
            <FilterSlider
                value={currentFilters[group.id] || [group.min || 0, group.max || 100]}
                onChange={(_event, newValue) => onFilterChange(group.id, newValue)}
                min={group.min}
                max={group.max}
                valueLabelDisplay="off"
            />
        </Box>
    );
};

// 4. MAIN EXPORT COMPONENT
const FilterBox: React.FC<FilterBoxProps> = ({ filterGroups, onFilterChange, currentFilters, sx, onReset }) => {
    const theme = useTheme();
    
    const renderFilter = (group: FilterGroup) => {
        switch (group.type) {
            case 'chip':
                return renderChipGroup(group, currentFilters, onFilterChange);
            case 'range':
                return renderRangeSlider(group, currentFilters, onFilterChange);
            case 'text':
            case 'select':
                return renderInputOrSelect(group, currentFilters, onFilterChange);
            default:
                return <Typography color="error" variant="body2">Unsupported filter type: {group.type}</Typography>;
        }
    };

return (
        <FilterCardWrapper sx={sx}>             
            <Box sx={{ mt: 0, '& > div:not(:last-child)': { mb: 1 } }}>
                {filterGroups.map((group, index) => (
                    <Box 
                        key={group.id}
                        sx={{
                            // Conditional divider for all but the last group
                            borderBottom: index < filterGroups.length - 1 
                                ? `1px solid ${theme.palette.divider}`
                                : 'none',
                            pb: index < filterGroups.length - 1 ? 2 : 0, 
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: '600', mb: 1, fontSize: '0.78rem', fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}>
                            {group.title}
                        </Typography>
                        {renderFilter(group)}
                    </Box>
                ))}
            </Box>
            {/* Action Buttons */}
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap:1 }}>
                <CustomButton size="small" variant="text" sx={{px: 1.5, fontWeight: 600 }} onClick={() => {
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
                <CustomButton size="small" variant="contained" sx={{px: 1.5, fontWeight: 600 }}>
                    Apply Filters
                </CustomButton>
            </Box>
        </FilterCardWrapper>
    );
};

export default FilterBox;