"use client";

import React, { useState, useRef, useEffect } from "react";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomSelectFieldV2Props } from "./types/index";
import { getSelectFieldDisplayValue, formatSelectDisplayText } from "./utils";
import {
  getSelectFieldStyles,
  getLabelStyles,
  getDropdownIconStyles,
  getDropdownStyles,
  getOptionStyles,
  getHelperTextStyles,
  getDisplayValueStyles,
  getOptionHoverStyles,
} from "./styles/StyledSelectField";
import theme from "@/themes/lightTheme";

const CustomSelectField: React.FC<CustomSelectFieldV2Props> = ({
  label,
  fieldType,
  options,
  name,
  neumorphicBox = true,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Select...",
  size = "medium",
  disabled = false,
  required = false,
  isError = false,
  helperText,
  usePortalPositioning = false, // Default to new simple positioning
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [minWidthFromContent, setMinWidthFromContent] = useState<number>(0);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const portalRoot = useRef<HTMLDivElement | null>(null);

  // Get the display value for select fields
  const getDisplayValue = () => {
    return getSelectFieldDisplayValue(value, fieldType);
  };

  const displayedValue = getDisplayValue();
  const hasValue =
    displayedValue &&
    (Array.isArray(displayedValue) ? displayedValue.length > 0 : true);

  // Calculate minimum width based on longest option
  useEffect(() => {
    if (measureRef.current && options.length > 0) {
      let maxWidth = 0;
      const fontSize = size === "small" ? "0.875rem" : "1rem";

      options.forEach((option) => {
        measureRef.current!.style.fontSize = fontSize;
        measureRef.current!.textContent = option.label;
        const width = measureRef.current!.offsetWidth;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      // Add padding for icon and some breathing room (40px right padding + 18px left padding + 20px extra)
      const totalWidth = maxWidth + 78;
      setMinWidthFromContent(totalWidth);
    }
  }, [options, size]);

  // Portal setup (only if usePortalPositioning is true)
  useEffect(() => {
    if (usePortalPositioning && typeof window !== "undefined") {
      portalRoot.current = document.createElement("div");
      portalRoot.current.style.position = "absolute";
      portalRoot.current.style.top = "0";
      portalRoot.current.style.left = "0";
      portalRoot.current.style.width = "100%";
      portalRoot.current.style.height = "0";
      portalRoot.current.style.zIndex = "99999";
      portalRoot.current.style.pointerEvents = "none";
      document.body.appendChild(portalRoot.current);

      return () => {
        if (portalRoot.current) {
          document.body.removeChild(portalRoot.current);
        }
      };
    }
  }, [usePortalPositioning]);

  // Update dropdown position (only if usePortalPositioning is true)
  const updatePosition = () => {
    if (usePortalPositioning && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      setDropdownPosition({
        top: rect.bottom + scrollTop + 8,
        left: rect.left + scrollLeft,
        width: rect.width,
      });
    }
  };

  // Update position on scroll/resize (only if usePortalPositioning is true)
  useEffect(() => {
    if (usePortalPositioning && isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [usePortalPositioning, isOpen]);

  // Render dropdown in portal (only if usePortalPositioning is true)
  useEffect(() => {
    if (usePortalPositioning && portalRoot.current && dropdownRef.current) {
      if (isOpen) {
        portalRoot.current.appendChild(dropdownRef.current);
        portalRoot.current.style.pointerEvents = "auto";
      } else {
        if (portalRoot.current.contains(dropdownRef.current)) {
          portalRoot.current.removeChild(dropdownRef.current);
        }
        portalRoot.current.style.pointerEvents = "none";
      }
    }
  }, [usePortalPositioning, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      const willBeOpen = !isOpen;

      // Update position before opening (only for portal positioning)
      if (usePortalPositioning && willBeOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        setDropdownPosition({
          top: rect.bottom + scrollTop + 8,
          left: rect.left + scrollLeft,
          width: rect.width,
        });
      }

      setIsOpen(willBeOpen);
      setIsFocused(willBeOpen);
      if (willBeOpen && onFocus) {
        onFocus({} as React.FocusEvent<HTMLDivElement>);
      } else if (!willBeOpen && onBlur) {
        onBlur({} as React.FocusEvent<HTMLDivElement>);
      }
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    if (fieldType === "multiple") {
      const currentValues = Array.isArray(displayedValue) ? displayedValue : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const isSelected = (optionValue: string | number) => {
    if (fieldType === "multiple") {
      return (
        Array.isArray(displayedValue) && displayedValue.includes(optionValue)
      );
    }
    return displayedValue === optionValue;
  };

  // Get styles using modularized style functions
  const fontSize = size === "small" ? "0.875rem" : "1rem";

  const selectStyles = getSelectFieldStyles({
    isOpen,
    isFocused,
    isHovered,
    hasValue,
    isError,
    disabled,
    size,
    neumorphicBox,
    minWidthFromContent,
  });

  const labelStyles = getLabelStyles(
    hasValue,
    isFocused,
    fontSize,
    neumorphicBox,
    isError
  );
  const dropdownIconStyles = getDropdownIconStyles(isOpen);
  const dropdownStyles = getDropdownStyles({ isOpen });
  const helperTextStyles = getHelperTextStyles(isError);
  const displayValueStyles = getDisplayValueStyles();

  const SelectComponent = (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minWidth: "100%",
      }}
    >
      {label && (
        <label style={labelStyles}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg
              width={isFocused || hasValue ? "12" : "16"}
              height={isFocused || hasValue ? "12" : "16"}
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{
                color: isError
                  ? "#d32f2f"
                  : isFocused || hasValue
                    ? theme.palette.tertiary.main
                    : "#999",
                transition: "color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {label}
          </span>
          {required && (
            <span style={{ color: "#b81d1d", marginLeft: "2px" }}>*</span>
          )}
        </label>
      )}

      <div
        onClick={toggleDropdown}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={selectStyles}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <span
          style={{
            ...displayValueStyles,
            ...(!hasValue && {
              opacity: 0,
              visibility: "hidden" as const,
            }),
          }}
        >
          {hasValue
            ? formatSelectDisplayText(
              displayedValue,
              options,
              fieldType,
              placeholder
            )
            : ""}
        </span>

        <span style={dropdownIconStyles}>▾</span>
      </div>

      {/* Hidden element for measuring text width */}
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontWeight: 500,
        }}
      />

      {/* Dropdown with conditional positioning */}
      <div
        ref={dropdownRef}
        style={{
          ...dropdownStyles,
          position: "absolute",
          ...(usePortalPositioning
            ? {
              // Portal positioning: use calculated coordinates
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              pointerEvents: "auto",
            }
            : {
              // Simple positioning: relative to parent
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
            }),
          zIndex: 999999,
        }}
      >
        {options.map((option) => {
          const optionSelected = isSelected(option.value);
          const baseOptionStyles = getOptionStyles({
            isSelected: optionSelected,
            isDisabled: option.disabled || false,
          });

          return (
            <div
              key={option.value}
              onClick={() =>
                !option.disabled && handleOptionClick(option.value)
              }
              onMouseEnter={(e) => {
                const hoverStyles = getOptionHoverStyles(
                  optionSelected,
                  option.disabled || false,
                  true
                );
                Object.assign(e.currentTarget.style, hoverStyles);
              }}
              onMouseLeave={(e) => {
                const hoverStyles = getOptionHoverStyles(
                  optionSelected,
                  option.disabled || false,
                  false
                );
                Object.assign(e.currentTarget.style, hoverStyles);
              }}
              style={baseOptionStyles}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {neumorphicBox ? (
        <div style={{ width: "100%" }}>
          <NeumorphicBox
            containerType="inwards"
            padding="2px"
            borderRadius="50px"
            width="100%"
          >
            {SelectComponent}
          </NeumorphicBox>
          {/* Render error/helperText outside the neumorphic box */}
          {isError && helperText && (
            <div style={helperTextStyles}>{helperText}</div>
          )}
        </div>
      ) : (
        <>
          {SelectComponent}
          {helperText && <div style={helperTextStyles}>{helperText}</div>}
        </>
      )}
    </>
  );
};

export default CustomSelectField;
