import { SxProps, Theme } from '@mui/material/styles';

// Styles for the main container and the content editable area
export const containerStyles = (theme: Theme): SxProps<Theme> => ({
  width: '300px', // Example limit
  borderRadius: 6, // Rounded corners
  boxShadow: `0 4px 6px -1px ${theme.palette.action.disabledBackground}`,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:"#ffffff",
  padding: '10px',
  overflow: 'hidden',
});

// Styles for the toolbar container
export const toolbarStyles = (theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 1,
  borderTop: `1px solid ${theme.palette.divider}`, 
  fontFamily:"var(--font-jost), system-ui, sans-serif",
  backgroundColor: "#ffffff",
  Height: '20px',
});

export const headerTitleContainerStyles = (theme: Theme): SxProps<Theme> => ({
  padding: '6px 16px 0px 12px', // Adjust padding to leave space for the thick line
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.tertiary.dark,
  fontFamily: 'var(--font-jost), system-ui, sans-serif',
  marginBottom: 1,
});

export const headerLabelStyles = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 600,
  fontFamily:"var(--font-jost), system-ui, sans-serif",
  position: 'relative',
  display: 'inline-block', // Crucial to contain the underline width
  paddingBottom: '8px',
  // Create the thick underline using a pseudo-element
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '3px', // Thick underline
    backgroundColor:theme.palette.tertiary.dark, // Use primary color for active tab look
    borderRadius: '1.5px', // Rounded edges for the underline
  },
});

// Styles for the content editable area
export const contentAreaStyles = (theme: Theme): SxProps<Theme> => ({
  height: '100px',
  direction: 'ltr' ,
  padding: 2,
  flexGrow: 1,
  overflowY:'scroll',
  cursor: 'text',
  '&:focus': {
    outline: 'none',
  },
  '&:empty:not(:focus)::before': {
    content: 'attr(data-placeholder)',
    color: theme.palette.grey[900],
    fontFamily: 'var(--font-jost), system-ui, sans-serif',
    opacity: 0.6,
    pointerEvents: 'none', // Allows clicking through to the content editable div
  },
  // Ensure basic formatting elements render correctly
  '& b, & strong': { fontWeight: theme.typography.fontWeightBold },
  '& i, & em': { fontStyle: 'italic' },
  '& u': { textDecoration: 'underline' },
 
});