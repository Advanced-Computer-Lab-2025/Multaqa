import { 
    SxProps, Theme
} from '@mui/material';


export type FilterComponentType = 'chip' | 'select' | 'range' | 'sort' | 'text' | 'date';
export type ContainerType = "inwards" | "outwards";
export interface FilterOption { label: string; value: string | number; }
export interface FilterBoxProps {
    filterGroups: FilterGroup[];
    onFilterChange: (groupId: string, value: any) => void; 
    currentFilters: Record<string, any>;
    sx?: SxProps<Theme>;
    onReset?: () => void;
}
export interface FilterGroup { 
    id: string; 
    title: string; 
    type: FilterComponentType; 
    options?: FilterOption[]; 
    min?: number; 
    max?: number; 
    placeholder?: string;
}
