"use client";

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Modal } from '@mui/material';
import Fade from '@mui/material/Fade';
import CustomButton from '../Buttons/CustomButton';
import Typography from '@mui/material/Typography';
import { CustomModalProps } from './types';
import { StyledModalBox, ModalCardWrapper } from './styles/StyledModal';

export default function CustomModal({ title, description, buttonOption1, buttonOption2 }: CustomModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <ModalCardWrapper>
            <StyledModalBox>
            {title && (
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
            )}
            {description && (
              <Typography 
                id="transition-modal-description" 
                sx={{ 
                  mt: 2,
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif'
                }}
              >
                {description}
              </Typography>
            )}
            <Box className="flex items-center justify-center gap-3 mt-6" sx={{ width: '100%' }}>
              {buttonOption1 && (
                <Box sx={{ flex: 1 }}>
                  <CustomButton 
                    variant={buttonOption1.variant || 'text'} 
                    color={buttonOption1.color || 'primary'} 
                    onClick={buttonOption1.onClick || handleClose}
                    fullWidth
                  >
                    {buttonOption1.label}
                  </CustomButton>
                </Box>
              )}
              {buttonOption2 && (
                <Box sx={{ flex: 1 }}>
                  <CustomButton 
                    variant={buttonOption2.variant || 'text'} 
                    color={buttonOption2.color || 'primary'} 
                    onClick={buttonOption2.onClick || handleClose}
                    fullWidth
                  >
                    {buttonOption2.label}
                  </CustomButton>
                </Box>
              )}
            </Box>
            </StyledModalBox>
          </ModalCardWrapper>
        </Fade>
      </Modal>
    </>
  );
}
