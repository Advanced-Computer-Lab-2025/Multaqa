"use client";

import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { Modal } from "@mui/material";
import Fade from "@mui/material/Fade";
import CustomButton from "../Buttons/CustomButton";
import Typography from "@mui/material/Typography";
import NeumorphicBox from "../containers/NeumorphicBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpIcon from "@mui/icons-material/Help";
import { CustomModalProps } from "./types";
import { CustomModalBox, CustomModalCardWrapper } from "./styles/StyledModal";
import { useTheme } from "@mui/material/styles";

export default function CustomModal({
  title,
  description,
  modalType,
  buttonOption1,
  buttonOption2,
  borderColor,
  open: controlledOpen,
  onClose: controlledOnClose,
  children,
}: CustomModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const handleOpen = () => setInternalOpen(true);
  const handleClose = () => {
    if (isControlled) {
      controlledOnClose && controlledOnClose();
    } else {
      setInternalOpen(false);
    }
  };

  const theme = useTheme();

  // Get the color based on modal type
  const getModalColor = () => {
    switch (modalType) {
      case "success":
        return theme.palette?.success?.main ?? "#4caf50";
      case "warning":
        return theme.palette?.warning?.main ?? "#ff9800";
      case "error":
      case "delete":
        return theme.palette.error.main;
      case "info":
      case "confirm":
        return theme.palette.primary.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const modalColor = getModalColor();
  // If caller didn't provide a borderColor, use the modal type color for the border
  const borderColorToUse = borderColor ?? modalColor;

  return (
    <>
      {!isControlled && (
        <CustomButton onClick={handleOpen}>Open modal</CustomButton>
      )}
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
          <CustomModalCardWrapper borderColor={borderColorToUse}>
            <CustomModalBox>
              {/* Icon and Title Group - Wrapped in NeumorphicBox */}
              <NeumorphicBox
                containerType="inwards"
                borderRadius="9999px"
                width="fit-content"
                sx={{
                  margin: "0 auto",
                  marginBottom: 4,
                  padding: { xs: "8px 16px", sm: "12px 24px" }, // Less padding on small screens
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                  }}
                >
                  {(() => {
                    // Using regular MUI icons; use modalColor so icon matches modal type color
                    const getIcon = () => {
                      switch (modalType) {
                        case "success":
                          return (
                            <CheckCircleIcon
                              sx={{ fontSize: 32, color: modalColor }}
                            />
                          );
                        case "warning":
                          return (
                            <WarningIcon
                              sx={{ fontSize: 32, color: modalColor }}
                            />
                          );
                        case "error":
                          return (
                            <ErrorIcon
                              sx={{ fontSize: 32, color: modalColor }}
                            />
                          );
                        case "info":
                          return (
                            <InfoIcon
                              sx={{ fontSize: 32, color: modalColor }}
                            />
                          );
                        case "delete":
                          return (
                            <DeleteIcon
                              sx={{ fontSize: 32, color: modalColor }}
                            />
                          );
                        case "confirm":
                          return (
                            <HelpIcon
                              sx={{ fontSize: 32, color: modalColor }}
                            />
                          );
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
                      fontFamily: "var(--font-jost), system-ui, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
              </NeumorphicBox>
              {children ? (
                children
              ) : description ? (
                <Typography
                  id="transition-modal-description"
                  sx={{
                    mt: 2,
                    fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    textAlign: "center",
                  }}
                >
                  {description}
                </Typography>
              ) : null}
              <Box
                className="flex items-center mt-6"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" }, // Column on small screens, row on sm+
                  justifyContent: "center",
                  alignItems: "center", // Center buttons instead of stretching
                  gap: 2,
                  width: "100%",
                }}
              >
                {buttonOption2 && (
                  <CustomButton
                    variant={buttonOption2.variant || "text"}
                    color={buttonOption2.color || "primary"}
                    onClick={buttonOption2.onClick || handleClose}
                    sx={{
                      // Secondary/outlined button: border color matches modal type
                      ...(buttonOption2.variant === "outlined" && {
                        borderColor: modalColor,
                        color: modalColor,
                        "&:hover": {
                          borderColor: modalColor,
                          backgroundColor: `${modalColor}10`, // 10% opacity
                        },
                      }),
                    }}
                  >
                    {buttonOption2.label}
                  </CustomButton>
                )}

                {buttonOption1 && (
                  <CustomButton
                    variant={buttonOption1.variant || "text"}
                    color={buttonOption1.color || "primary"}
                    onClick={buttonOption1.onClick || handleClose}
                    sx={{
                      // Secondary/outlined button: border color matches modal type
                      ...(buttonOption1.variant === "outlined" && {
                        borderColor: modalColor,
                        color: modalColor,
                        "&:hover": {
                          borderColor: modalColor,
                          backgroundColor: `${modalColor}10`, // 10% opacity
                        },
                      }),
                    }}
                  >
                    {buttonOption1.label}
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
