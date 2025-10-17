// components/Create/styles/CreateStyles.ts
import { SxProps, Theme } from '@mui/material/styles';
const STEP1_WIDTH = '370px'; 
const STEP2_WIDTH = '550px';
const STEP2_HEIGHT = '540px'
const GAP_WIDTH = 24;    
const TOTAL_WIDTH = `${parseInt(STEP1_WIDTH) + parseInt(STEP2_WIDTH) + GAP_WIDTH}px`; 

// Outer container style 
export const wrapperContainerStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    padding:0,
};

// Style for the container holding the two boxes side-by-side
export const horizontalLayoutStyles = (theme: Theme): SxProps<Theme> => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', // Center boxes within the container
    gap: 3, // Space between the two boxes
    maxWidth: TOTAL_WIDTH, // 450px + 450px + 30px gap
    padding: 3, 
    borderRadius: '12px',
    backgroundColor: theme.palette.background.default, 
});

// Style for the fixed width of Box 1 (Smaller)
export const step1BoxStyles = (theme: Theme): SxProps<Theme> => ({
    width: STEP1_WIDTH, 
    justifyContent: 'flex-start',
    flexShrink: 0,
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '6px',
    padding: '0px 16px',
    fontFamily: 'var(--font-jost), system-ui, sans-serif',
    boxShadow: theme.shadows[5],
    overflow: 'hidden',
});

// Style for the fixed width of Box 2 (Wider)
export const step2BoxStyles = (theme: Theme): SxProps<Theme> => ({
    width: STEP2_WIDTH, 
    height: STEP2_HEIGHT,
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    flexShrink: 0,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '6px',
    padding: '8px 16px', // No vertical padding on outer box
    boxShadow: theme.shadows[5],
    overflow: 'hidden',
});

// Style for titles inside the second box
export const detailTitleStyles = (theme: Theme): SxProps<Theme> => ({
    fontWeight: 700,
    fontFamily: 'var(--font-jost), system-ui, sans-serif',
    fontSize: '1rem',
    color: theme.palette.tertiary.dark,
});

// Styles for the main form content area
export const modalFormStyles: SxProps<Theme> = {
    padding: '8px 16px 0px 16px',
    marginTop: 0,
    flexGrow: 1,
    minHeight:'0px',
    overflowY: 'auto',
};

export const modalHeaderStyles: SxProps<Theme> = {
    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
    padding: '16px 0px 0px 0px',
    backgroundColor: (theme) =>"#ffffff", 
    flexShrink:0 // Light background for the header bar
};
// Styles for the footer section (Buttons)
export const modalFooterStyles: SxProps<Theme> = {
    display: 'flex',
    flexShrink:0,
    justifyContent: 'flex-end',
    padding: '12px 16px 12px 0px',
    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
    backgroundColor: (theme) => "#ffffff",
};