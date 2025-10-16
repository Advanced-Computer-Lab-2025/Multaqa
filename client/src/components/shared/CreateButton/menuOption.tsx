// components/MenuOption/MenuOption.tsx
import React from 'react';
import { Box, Typography, useTheme, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { internalBox, iconStyle} from './styles'; // Import internalBox from your styles file

// Define the shape of a single menu item
interface MenuOptionProps {
  label: string;
  onClick: () => void;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>; 
}

const MenuOption: React.FC<MenuOptionProps> = ({ label, onClick, icon: Icon }) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{ 
        ...internalBox(theme), 
        backgroundColor: theme.palette.background.paper || '#FFFFFF',
      }}
    >
      <Icon sx={{...iconStyle(theme)}} 
      />
      <Typography variant="body2" sx={{ 
        color: theme.palette.text.primary, 
        fontWeight: 500,
        fontSize: '11px'
      }}>
        {label}
      </Typography>
    </Box>
  );
};

export default MenuOption;