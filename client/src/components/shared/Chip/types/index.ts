import { SxProps, Theme } from '@mui/material';

export interface FilterChipProps {
    label: React.ReactNode;
    active?: boolean;
    deletable?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    variant?: 'default' | 'select';
    sx?: SxProps<Theme>;
}
