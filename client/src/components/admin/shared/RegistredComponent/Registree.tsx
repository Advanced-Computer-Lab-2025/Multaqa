"use client";
import {
  Stack,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Typography,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IdChip from "./IdChip";
import NeumorphicBox from "../../../shared/containers/NeumorphicBox";
import { RegisterBoxProps } from "./types";
import { TruncatedText } from "./utils";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { capitalizeFullName } from "../../../shared/utils/nameUtils";

const RegisterBox: React.FC<RegisterBoxProps> = ({
  name = "Salma Tarek",
  id = "58-5727",
  email = "salmaabadadadadaurahsfsfsfsfsfmah@gmail.com",
  registrationDate = "25/08/2025",
  role = "N/A",
  onRoleChange,
  disabled,
  dragHandleProps,
}) => {
  const [selectedRole, setSelectedRole] = useState(role);
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();

  // Update selectedRole when role prop changes
  useEffect(() => {
    setSelectedRole(role);
  }, [role]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoleChange = (event: any) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <NeumorphicBox
      containerType="outwards"
      sx={{
        border: `3px solid ${theme.palette.tertiary.main}`,
        borderRadius: "16px",
        maxWidth: "340px",
        padding: "15px 20px",
        margin: "20px auto",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Drag Handle Indicator */}
      <Box
        sx={{
          position: "absolute",
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#9CA3AF",
          display: "flex",
          alignItems: "center",
          cursor: "grab",
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPointerDown={(e: any) => e.stopPropagation()}
        {...dragHandleProps}
      >
        <DragIndicatorIcon sx={{ fontSize: "16px" }} />
      </Box>

      {/* Header: Outer Stack controls Name/ID Group vs Arrow Icon */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: isExpanded ? 2 : 0,
          width: "300px",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
          mt: 1,
        }}
      >
        {/* Inner Stack: Controls ID (Left) vs Name (Right) */}
        <Stack
          direction="row"
          justifyContent="end"
          alignItems="center"
          spacing={2}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflow: "hidden",
            height: "60px",
            mr: 1,
          }}
        >
          {/* 1. ID Chip (LEFT - fixed width) */}
          <NeumorphicBox
            containerType="outwards"
            sx={{
              width: "w-fit",
              padding: "2px",
              borderRadius: "20px",
              boxShadow: `
                      -3px -3px 8px 0 #FAFBFF,
                      5px 5px 8px 0 rgba(98, 153, 208, 0.6)
                                        `,
              flexShrink: 0,
            }}
          >
            <IdChip
              avatar={<Avatar>#</Avatar>}
              label={id}
              variant="outlined"
              color="primary"
              sx={{ fontWeight: "600" }}
            />
          </NeumorphicBox>

          {/* 2. Name Container (RIGHT - Takes up remaining space) */}
          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              minWidth: "50px",
              fontSize: "20px",
              fontWeight: 600,
              color: "text.primary",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TruncatedText fontSize="16px" fontWeight="600" maxChars={15}>
              {capitalizeFullName(name)}
            </TruncatedText>
          </Box>
        </Stack>

        {/* 3. Expansion/Collapse Icon (FAR RIGHT) */}
        <IconButton
          size="small"
          aria-expanded={isExpanded}
          aria-label="show more"
          onClick={handleToggleExpand}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag on button click
          sx={{
            flexShrink: 0,
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.grey[400]}`,
            width: "24px",
            height: "24px",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              transition: "all 0.3s ease-in-out",
            },
          }}
        >
          {isExpanded ? (
            <KeyboardArrowUpIcon
              sx={{ fontSize: "24px", color: theme.palette.grey[600] }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{ fontSize: "24px", color: theme.palette.grey[600] }}
            />
          )}
        </IconButton>
      </Stack>

      {/* Collapsible Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Stack spacing={1} onPointerDown={(e) => e.stopPropagation()}>
          {/* Role */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.grey[600],
                fontWeight: 500,
                width: "140px",
                flexShrink: 0,
                fontSize: "14px",
              }}
            >
              Role
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <FormControl size="small" fullWidth disabled={disabled}>
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  sx={{
                    height: "30px",
                    fontSize: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.grey[400],
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem sx={{ fontSize: "12px" }} value="N/A">
                    N/A
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Staff">
                    Staff
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="TA">
                    TA
                  </MenuItem>
                  <MenuItem sx={{ fontSize: "12px" }} value="Professor">
                    Professor
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>

          {/* Email */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.grey[600],
                fontWeight: 500,
                width: "140px",
                flexShrink: 0,
                fontSize: "14px",
              }}
            >
              Email
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <TruncatedText fontSize="12px" fontWeight="500" maxChars={20}>
                {email}
              </TruncatedText>
            </Box>
          </Stack>

          {/* Registration Date */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.grey[600],
                fontWeight: 500,
                width: "140px",
                flexShrink: 0,
                fontSize: "14px",
              }}
            >
              Registration Date
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                }}
              >
                {registrationDate}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Collapse>
    </NeumorphicBox>
  );
};

export default RegisterBox;
