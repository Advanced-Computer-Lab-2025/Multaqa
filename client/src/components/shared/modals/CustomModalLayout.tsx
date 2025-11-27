"use client";

import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import { Modal } from "@mui/material";
import Fade from "@mui/material/Fade";
import {
  StyledModalBox,
  ModalCardWrapper,
  StyledModalContent,
  StyledModalHeader,
} from "./styles/StyledModal";
import AnimatedCloseButton from "@/components/shared/Buttons/AnimatedCloseButton";
import { CustomModalLayoutProps } from "./types"; 
import { createDelayedCloseHandler } from "./utils";
import { useTheme, lighten } from "@mui/material/styles";

export default function CustomModalLayout({
  children,
  open,
  onClose,
  width,
  borderColor,
  title,
}: CustomModalLayoutProps) {
  const transitionDuration = 300;
  const [isCloseActive, setIsCloseActive] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setIsCloseActive(false);
    const delayedClose = createDelayedCloseHandler(onClose, transitionDuration);
    delayedClose();
  }, [onClose, transitionDuration]);

  React.useEffect(() => {
    if (!open) {
      setIsCloseActive(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsCloseActive(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  const theme = useTheme();
  const tertiary = (theme.palette as unknown as { tertiary?: { main?: string } }).tertiary;
  const baseBorderColor = borderColor ?? tertiary?.main ?? theme.palette.primary.main;
  
  let closeIconColor = baseBorderColor;
  try {
    closeIconColor = lighten(String(baseBorderColor), 0.35);
  } catch {
    // keep baseBorderColor if lighten isn't applicable
  }

  const getWidthSx = () => {
    if (!width) return {};

    const sxOverrides: Record<string, unknown> = {};
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
          timeout: transitionDuration,
        },
      }}
      disableAutoFocus
    >
      <Fade in={open} timeout={transitionDuration}>
        <ModalCardWrapper sx={getWidthSx()} borderColor={borderColor}>
          <StyledModalBox>
            {/* Header with Title and Close Icon */}
            <StyledModalHeader>
              <div style={{ 
                display: 'flex', 
                // CHANGE HERE: conditionally set justify-content
                justifyContent: title ? 'space-between' : 'flex-end', 
                alignItems: 'center',
                width: '100%'
              }}>
                {title && (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: baseBorderColor,
                      fontFamily: 'var(--font-jost), system-ui, sans-serif',
                      letterSpacing: '0.02em',
                      paddingBottom: '8px',
                    }}>
                      {title}
                    </h2>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '3px',
                        width: '40%',
                        background: `linear-gradient(135deg, ${baseBorderColor}, ${closeIconColor})`,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.width = '100%';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.width = '40%';
                      }}
                    />
                  </div>
                )}
                <AnimatedCloseButton
                  open={isCloseActive}
                  onClick={handleClose}
                  appearance="neumorphic"
                  lineColor={closeIconColor}
                  neumorphicProps={{
                    containerType: "inwards",
                    width: "42px",
                    height: "42px",
                    padding: "2px",
                  }}
                  variant="closeOnly"
                  ariaLabel="Close modal"
                />
              </div>
            </StyledModalHeader>

            <StyledModalContent>
              {children}
            </StyledModalContent>
          </StyledModalBox>
        </ModalCardWrapper>
      </Fade>
    </Modal>
  );
}