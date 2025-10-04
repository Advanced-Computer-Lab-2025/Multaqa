"use client";

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { Modal } from '@mui/material';
import Fade from '@mui/material/Fade';
import { StyledModalBox, ModalCardWrapper } from './styles/StyledModal';
import CustomIcon from '../Icons/CustomIcon';
import { CustomModalLayoutProps } from './types';
import { createDelayedCloseHandler } from './utils';

export default function CustomModalLayout({ children, open, onClose }: CustomModalLayoutProps) {
  const handleClose = createDelayedCloseHandler(onClose, 500);

  return (
    <Modal
      aria-labelledby="modal-layout"
      aria-describedby="modal-layout-content"
      open={open}
      onClose={onClose}
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
            {/* Close Icon at the top right */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <CustomIcon 
                icon="close" 
                size="small" 
                containerType="inwards"
                onClick={handleClose}
              />
            </Box>
            
            {/* Children content */}
            <Box>
              {children}
            </Box>
          </StyledModalBox>
        </ModalCardWrapper>
      </Fade>
    </Modal>
  );
}
