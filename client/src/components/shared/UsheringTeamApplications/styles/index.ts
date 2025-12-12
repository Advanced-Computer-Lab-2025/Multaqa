import { SxProps, Theme } from '@mui/material/styles';

// Team Selector Styles
export const teamSelectorChipStyles = (
    isSelected: boolean,
    teamColor: string
): SxProps<Theme> => ({
    px: 1.5,
    py: 0.5,
    borderRadius: 3,
    fontWeight: isSelected ? 600 : 500,
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: '2px solid',
    borderColor: isSelected ? teamColor : 'transparent',
    backgroundColor: isSelected ? `${teamColor}15` : 'rgba(255, 255, 255, 0.9)',
    color: teamColor,
    '&:hover': {
        backgroundColor: `${teamColor}20`,
        borderColor: teamColor,
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${teamColor}30`,
    },
});

// Container styles for team selector.
export const teamSelectorContainerStyles: SxProps<Theme> = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
    p: 2,
    backgroundColor: '#ffffff',
    borderRadius: 3,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
};

// Calendar Styles
export const calendarContainerStyles = (teamColor: string): SxProps<Theme> => ({
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: '1px solid',
    borderColor: 'divider',
    '& .MuiPickersDay-root.Mui-selected': {
        backgroundColor: teamColor,
        '&:hover': {
            backgroundColor: teamColor,
        },
    },
    '& .MuiPickersDay-root:focus.Mui-selected': {
        backgroundColor: teamColor,
    },
    height: "300px"
});

// Applicant Card Styles
export const applicantCardStyles = (teamColor: string): SxProps<Theme> => ({
    p: 2.5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
    border: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.25s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 24px ${teamColor}20`,
        borderColor: teamColor,
    },
});

// Initials avatar styles
export const initialsAvatarStyles = (teamColor: string): SxProps<Theme> => ({
    width: 48,
    height: 48,
    backgroundColor: teamColor,
    color: 'white',
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'uppercase',
    boxShadow: `0 2px 8px ${teamColor}40`,
});


//Time slot badge styles.
export const timeSlotBadgeStyles = (teamColor: string): SxProps<Theme> => ({
    px: 1.5,
    py: 0.5,
    borderRadius: 2,
    backgroundColor: `${teamColor}15`,
    color: teamColor,
    fontWeight: 600,
    fontSize: '0.75rem',
});

// Layout Styles
export const mainContainerStyles: SxProps<Theme> = {
    py: 4,
    px: 3,
    minHeight: '100%',
    backgroundColor: '#ffffff',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
};

// Content grid styles.
export const contentGridStyles: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
    gap: 3,
    mt: 3,
};

// Cards grid styles.
export const cardsGridStyles: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' },
    gap: 2,
    alignContent: 'start',
    width:"100%"
};

// Empty state container styles.
export const emptyStateStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    textAlign: 'center',
    color: 'text.secondary',
};

// Header styles.
export const headerStyles: SxProps<Theme> = {
    mb: 4,
};

// Header title styles.
export const headerTitleStyles: SxProps<Theme> = {
    fontWeight: 700,
    color: '#1a1a1a',
    mb: 1,
};

// Header subtitle styles.
export const headerSubtitleStyles: SxProps<Theme> = {
    color: 'text.secondary',
    fontSize: '1rem',
};
