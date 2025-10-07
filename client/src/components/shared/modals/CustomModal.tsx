"use client";

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Modal } from '@mui/material';
import Fade from '@mui/material/Fade';
import CustomButton from '../Buttons/CustomButton';
import Typography from '@mui/material/Typography';
import NeumorphicBox from '../containers/NeumorphicBox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import { CustomModalProps } from './types';
import { CustomModalBox, CustomModalCardWrapper } from './styles/StyledModal';

export default function CustomModal({ title, description, modalType, buttonOption1, buttonOption2, borderColor }: CustomModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Get the color based on modal type
  const getModalColor = () => {
    switch (modalType) {
      case 'success':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'error':
      case 'delete':
        return '#f44336';
      case 'info':
      case 'confirm':
        return '#2196f3';
      default:
        return '#2196f3';
    }
  };

  const modalColor = getModalColor();

  return (
    <>
      <CustomButton onClick={handleOpen}>Open modal</CustomButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <CustomModalCardWrapper borderColor={borderColor}>
            <CustomModalBox>
            {/* Icon and Title Group - Wrapped in NeumorphicBox */}
            <NeumorphicBox
              containerType="inwards"
              borderRadius="9999px"
              width="fit-content"
              sx={{ 
                margin: '0 auto', 
                marginBottom: 4,
                padding: { xs: '8px 16px', sm: '12px 24px' } // Less padding on small screens
              }}
            >
              <Box 
                sx={{
                  display: 'flex', 
                  flexDirection: 'row',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 1.5 
                }}>
                {(() => {
                  // Using regular MUI icons
                  const getIcon = () => {
                    switch (modalType) {
                      case 'success':
                        return <CheckCircleIcon sx={{ fontSize: 32, color: '#4caf50' }} />;
                      case 'warning':
                        return <WarningIcon sx={{ fontSize: 32, color: '#ff9800' }} />;
                      case 'error':
                        return <ErrorIcon sx={{ fontSize: 32, color: '#f44336' }} />;
                      case 'info':
                        return <InfoIcon sx={{ fontSize: 32, color: '#2196f3' }} />;
                      case 'delete':
                        return <DeleteIcon sx={{ fontSize: 32, color: '#f44336' }} />;
                      case 'confirm':
                        return <HelpIcon sx={{ fontSize: 32, color: '#2196f3' }} />;
                      default:
                        return null;
                    }
                  };
                  return getIcon();
                })()}
                <Typography 
                  id="transition-modal-title" 
                  variant="h6" 
                  component="h2"
                  sx={{ 
                    fontFamily: 'var(--font-jost), system-ui, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </NeumorphicBox>
            {description && (
              <Typography 
                id="transition-modal-description" 
                sx={{ 
                  mt: 2,
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  textAlign: 'center'
                }}
              >
                {description}
              </Typography>
            )}
            <Box 
              className="flex items-center mt-6" 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }, // Column on small screens, row on sm+
                justifyContent: 'center',
                alignItems: 'center', // Center buttons instead of stretching
                gap: 2,
                width: '100%'
              }}
            >
              {buttonOption1 && (
                <CustomButton 
                  variant={buttonOption1.variant || 'text'} 
                  color={buttonOption1.color || 'primary'} 
                  onClick={buttonOption1.onClick || handleClose}
                  sx={{
                    // Secondary/outlined button: border color matches modal type
                    ...(buttonOption1.variant === 'outlined' && {
                      borderColor: modalColor,
                      color: modalColor,
                      '&:hover': {
                        borderColor: modalColor,
                        backgroundColor: `${modalColor}10`, // 10% opacity
                      }
                    }),
                    // Primary/contained button: background color matches modal type
                    ...(buttonOption1.variant === 'contained' && {
                      backgroundColor: `${modalColor} !important`,
                      color: '#fff !important',
                      '&:hover': {
                        backgroundColor: `${modalColor} !important`,
                        filter: 'brightness(0.9)',
                      }
                    }),
                  }}
                >
                  {buttonOption1.label}
                </CustomButton>
              )}
              {buttonOption2 && (
                <CustomButton 
                  variant={buttonOption2.variant || 'text'} 
                  color={buttonOption2.color || 'primary'} 
                  onClick={buttonOption2.onClick || handleClose}
                  sx={{
                    // Secondary/outlined button: border color matches modal type
                    ...(buttonOption2.variant === 'outlined' && {
                      borderColor: modalColor,
                      color: modalColor,
                      '&:hover': {
                        borderColor: modalColor,
                        backgroundColor: `${modalColor}10`, // 10% opacity
                      }
                    }),
                    // Primary/contained button: background color matches modal type
                    ...(buttonOption2.variant === 'contained' && {
                      backgroundColor: `${modalColor} !important`,
                      color: '#fff !important',
                      '&:hover': {
                        backgroundColor: `${modalColor} !important`,
                        filter: 'brightness(0.9)',
                      }
                    }),
                  }}
                >
                  {buttonOption2.label}
                </CustomButton>
              )}
            </Box>
            </CustomModalBox>
          </CustomModalCardWrapper>
        </Fade>
      </Modal>
    </>
  );
}
