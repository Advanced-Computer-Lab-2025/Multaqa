"use client";

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Modal } from '@mui/material';
import Fade from '@mui/material/Fade';
import { StyledModalBox, ModalCardWrapper, StyledModalContent, StyledModalHeader } from './styles/StyledModal';
import CustomIcon from '../Icons/CustomIcon';
import { CustomModalLayoutProps } from './types';
import { createDelayedCloseHandler } from './utils';

export default function CustomModalLayout({ children, open, onClose, width }: CustomModalLayoutProps) {
  const handleClose = createDelayedCloseHandler(onClose, 500);

  // Parse width prop to create sx overrides
  const getWidthSx = () => {
    if (!width) return {};
    
    // Extract breakpoint-specific widths from the width string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sxOverrides: Record<string, any> = {};
    
    // Match patterns like w-[90vw], sm:w-[80vw], md:w-[70vw], lg:w-[60vw], xl:w-[50vw]
    const baseWidth = width.match(/(?:^|\s)w-\[([^\]]+)\]/);
    const smWidth = width.match(/sm:w-\[([^\]]+)\]/);
    const mdWidth = width.match(/md:w-\[([^\]]+)\]/);
    const lgWidth = width.match(/lg:w-\[([^\]]+)\]/);
    const xlWidth = width.match(/xl:w-\[([^\]]+)\]/);
    
    if (baseWidth) {
      sxOverrides.width = baseWidth[1];
      sxOverrides.maxWidth = baseWidth[1];
    }
    if (smWidth) {
      sxOverrides['@media (min-width: 600px)'] = {
        width: smWidth[1],
        maxWidth: smWidth[1],
      };
    }
    if (mdWidth) {
      sxOverrides['@media (min-width: 900px)'] = {
        width: mdWidth[1],
        maxWidth: mdWidth[1],
      };
    }
    if (lgWidth) {
      sxOverrides['@media (min-width: 1200px)'] = {
        width: lgWidth[1],
        maxWidth: lgWidth[1],
      };
    }
    if (xlWidth) {
      sxOverrides['@media (min-width: 1536px)'] = {
        width: xlWidth[1],
        maxWidth: xlWidth[1],
      };
    }
    
    return sxOverrides;
  };

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
        <ModalCardWrapper sx={getWidthSx()}>
          <StyledModalBox>
            {/* Close Icon at the top right - Fixed header */}
            <StyledModalHeader>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CustomIcon 
                  icon="close" 
                  size="small" 
                  containerType="inwards"
                  onClick={handleClose}
                />
              </div>
            </StyledModalHeader>
            
            {/* Scrollable content area */}
            <StyledModalContent>
              {children}
            </StyledModalContent>
          </StyledModalBox>
        </ModalCardWrapper>
      </Fade>
    </Modal>
  );
}
