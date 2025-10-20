// components/CreateButton/CreateParent.tsx

"use client";
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconComponent } from '@mui/icons-material';

// Import your custom components
import MenuOptionComponent from './MenuOptionComponent'; // Assuming this is where it's located
import CustomButton from '../shared/Buttons/CustomButton'; // Assuming this is where it's located


// --- Interface Definitions (Moved to be used as props) ---

// Define the required interface for the menu option item
interface MenuOption {
  label: string;
  icon: SvgIconComponent;
}

// Define the props for the new CreateParent component
interface CreateParentProps {
  options: MenuOption[];
  setters: Dispatch<SetStateAction<boolean>>[];
}


const BUTTON_LABEL_TEXT = "+ Create New";
const MENU_TITLE_TEXT = "Create New";

// The component now accepts props: options, setters, and setRefresh
const CreateParent: React.FC<CreateParentProps> = ({ options, setters}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(true); // Always open when clicking the button
  };
  
  const handleClose = () => {
    setIsOpen(false); // Close when clicking the 'x'
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', zIndex: 100, mb:4 }}>
        <CustomButton
        onClick={handleButtonClick}
        width="180px"
        height="44px"
        sx={{
          transition: 'transform 0.3s, opacity 0.3s, box-shadow 0.3s',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.95)' : 'scale(1)',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >
        <Box sx={{ display:'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" color="tertiary" sx={{ fontSize:"14px", fontFamily: "var(--font-poppins), system-ui, sans-serif"}}>
            {BUTTON_LABEL_TEXT}
          </Typography>
        </Box>
      </CustomButton>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: `translateX(-50%)`, 
          top: 0,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <Collapse
          in={isOpen}
          timeout={300}
          unmountOnExit
          sx={{
            '& .MuiCollapse-wrapperInner': {
              display: 'flex',
              justifyContent: 'center',
            }
          }}
        >
          <Box
            sx={{
              padding: 2,
              borderRadius: 3,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
              backgroundColor:'theme.background',
              width:'240px',
              position: 'relative',
            }}
          >
            {/* Animated Title Container */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '35px',
                zIndex: 10,
                transition: 'opacity 0.2s 0.1s ease-in', 
                opacity: isOpen ? 1 : 0, 
              }}
            >
              {/* Animated Text */}
              <Typography
                variant="h6"
                color= "tertiary"
                sx={{
                  position: 'absolute',
                  // Fine-tuned to slide from button center to menu title position
                  top: '50%',
                  left: '50%',
                  transform: isOpen 
                    ? 'translate(-115%, -17%)' 
                    : 'translate(-50%, -50%)', 
                  
                  transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)', 
                  
                  fontSize:"14px", 
                  fontFamily: "var(--font-poppins), system-ui, sans-serif", 
                  mb:2
                }}>
                {MENU_TITLE_TEXT}
              </Typography>
              
              {/* Close Button ('x' icon) */}
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: '8px', 
                  right: '8px',
                  opacity: isOpen ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* MenuOptionComponent - with top margin to account for the title space */}
            <Box sx={{ mt: '25px' }}>
                <MenuOptionComponent
                options={options}
                setters={setters}
                />
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default CreateParent;