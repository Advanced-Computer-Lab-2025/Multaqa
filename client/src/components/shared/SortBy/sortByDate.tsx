"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
// Import your dropdown style functions
import {
  getDropdownStyles,
  getOptionStyles,
  getOptionHoverStyles,
} from "@/components/shared/input-fields/styles/StyledSelectField";

type SortOption = {
  label: string;
  value: string;
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Sort By", value: "none" },
  { label: "Earliest Start Date", value: "start_asc" },
  { label: "Latest Start Date", value: "start_desc" },
];

// Styled button (same as Filter)
const StyledSortButton = styled(Button)(({ theme }) => ({
  cursor: "pointer",
  border: 'none',
  padding: "5px 12px",
  fontSize: "12px",
  height: "32px",
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  textTransform: "none",
  letterSpacing: "0.5px",
  fontWeight: 900,
  color: theme.palette.primary.dark,
  backgroundColor: "transparent",
  whiteSpace: "nowrap",
  width: "auto",
  minWidth: "fit-content",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  "&:hover": {
    boxShadow: `
    backgroundColor: theme.palette.action.hover, // subtle hover effect
    boxShadow: "none",
    `,
  },
  "&:active": {
    boxShadow: `
      inset -10px -10px 10px 0 rgba(0, 0, 0, 0.25),
      inset 10px 10px 10px 0 rgba(255, 255, 255, 0.8)
    `,
  },
}));

interface SortByDateProps {
  value: string;
  onChange: (value: string) => void;
}

const SortByDate: React.FC<SortByDateProps> = ({ value, onChange }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLabel =
    SORT_OPTIONS.find((option) => option.value === value)?.label || "Sort By";

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // 💡 MODIFIED: Toggle Logic is implemented here
  const handleSelect = (optionValue: string) => {
    // 1. Check if the clicked option is already the active one
    if (value === optionValue) {
      // 2. If it is active, reset to the default sort value ("none")
      onChange("none");
    } else {
      // 3. Otherwise, apply the new sort value
      onChange(optionValue);
    }
    // 4. Close the dropdown
    setIsOpen(false);
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <StyledSortButton
        ref={buttonRef}
        variant="outlined"
        onClick={toggleDropdown}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              color: theme.palette.primary.dark,
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        }
      >
        {currentLabel}
      </StyledSortButton>

      {/* Custom dropdown menu */}
      <Box
        ref={dropdownRef}
        style={{
          ...getDropdownStyles({ isOpen }),
          borderColor: theme.palette.primary.dark,
          right: 0,
          left: "auto",
        }}
      >
        {SORT_OPTIONS.filter((opt) => opt.value !== "none").map((option) => {
          const isSelected = value === option.value;
          const isHovered = hovered === option.value;
          const optionStyle = {
            ...getOptionStyles({ isSelected, isDisabled: false }),
            ...getOptionHoverStyles(isSelected, false, isHovered),
            borderColor: theme.palette.primary.dark,
            ...(isHovered || isSelected
              ? { borderLeft: `3px solid ${theme.palette.primary.dark}` }
              : {}),
          };

          return (
            <Box
              key={option.value}
              style={optionStyle}
              onMouseEnter={() => setHovered(option.value)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleSelect(option.value)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ flex: 1 }}>{option.label}</Typography>
                {isSelected && (
                  <CheckIcon
                    sx={{ fontSize: 18, color: theme.palette.primary.dark }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SortByDate;