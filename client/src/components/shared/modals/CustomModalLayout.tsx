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
import { CustomModalLayoutProps } from "./types"; // Assuming title will be added here
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
  // Use provided borderColor or fallback to theme. Compute a lighter variant for the close icon.
  const tertiary = (theme.palette as unknown as { tertiary?: { main?: string } }).tertiary;
  const baseBorderColor = borderColor ?? tertiary?.main ?? theme.palette.primary.main;
  // lighten may throw for some invalid color formats; default to baseBorderColor if lighten fails
  let closeIconColor = baseBorderColor;
  try {
    closeIconColor = lighten(String(baseBorderColor), 0.35);
  } catch {
    // keep baseBorderColor if lighten isn't applicable
  }

  // Parse width prop to create sx overrides
  const getWidthSx = () => {
    if (!width) return {};

    // Extract breakpoint-specific widths from the width string
    const sxOverrides: Record<string, unknown> = {};

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
          timeout: transitionDuration,
        },
      }}
      disableAutoFocus
    >
      <Fade in={open} timeout={transitionDuration}>
        <ModalCardWrapper sx={getWidthSx()} borderColor={borderColor}>
          <StyledModalBox>
            {/* Close Icon at the top right - Fixed header */}
            <StyledModalHeader>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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