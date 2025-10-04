"use client";

import React, { useState, useRef, useEffect } from "react";
import NeumorphicBox from '../containers/NeumorphicBox';
import { CustomSelectFieldV2Props } from './types/index';
import { 
  getSelectFieldDisplayValue,
  formatSelectDisplayText,
} from './utils';
import {
  getSelectFieldStyles,
  getLabelStyles,
  getDropdownIconStyles,
  getDropdownStyles,
  getOptionStyles,
  getHelperTextStyles,
  getDisplayValueStyles,
  getOptionHoverStyles,
} from './styles/StyledSelectField';

const CustomSelectFieldV2: React.FC<CustomSelectFieldV2Props> = ({ 
  label,
  fieldType, 
  options,
  neumorphicBox = false,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Select...',
  placeholderStyle = '',
  size = "medium",
  disabled = false,
  required = false,
  isError = false,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the display value for select fields
  const getDisplayValue = () => {
    return getSelectFieldDisplayValue(value, fieldType);
  };

  const displayedValue = getDisplayValue();
  const hasValue = displayedValue && (Array.isArray(displayedValue) ? displayedValue.length > 0 : true);

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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      const willBeOpen = !isOpen;
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
        ? currentValues.filter(v => v !== optionValue)
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
      return Array.isArray(displayedValue) && displayedValue.includes(optionValue);
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
  });

  const labelStyles = getLabelStyles(hasValue, isFocused, fontSize, neumorphicBox);
  const dropdownIconStyles = getDropdownIconStyles(isOpen);
  const dropdownStyles = getDropdownStyles({ isOpen });
  const helperTextStyles = getHelperTextStyles(isError);
  const displayValueStyles = getDisplayValueStyles();

  const SelectComponent = (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%',
        minWidth: '100%',
      }}
    >
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: '#b81d1d', marginLeft: '2px' }}>*</span>}
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
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <span style={{
          ...displayValueStyles,
          ...(placeholderStyle === 'transparent' && !hasValue && {
            opacity: 0,
            visibility: 'hidden' as const,
          })
        }}>
          {hasValue
            ? formatSelectDisplayText(displayedValue, options, fieldType, placeholder)
            : placeholder}
        </span>
        
        <span style={dropdownIconStyles}>▾</span>
      </div>

      <div ref={dropdownRef} style={dropdownStyles}>
        {options.map((option) => {
          const optionSelected = isSelected(option.value);
          const baseOptionStyles = getOptionStyles({
            isSelected: optionSelected,
            isDisabled: option.disabled || false,
          });
          
          return (
            <div
              key={option.value}
              onClick={() => !option.disabled && handleOptionClick(option.value)}
              onMouseEnter={(e) => {
                const hoverStyles = getOptionHoverStyles(optionSelected, option.disabled || false, true);
                Object.assign(e.currentTarget.style, hoverStyles);
              }}
              onMouseLeave={(e) => {
                const hoverStyles = getOptionHoverStyles(optionSelected, option.disabled || false, false);
                Object.assign(e.currentTarget.style, hoverStyles);
              }}
              style={baseOptionStyles}
            >
              {option.label}
            </div>
          );
        })}
      </div>

      {helperText && <div style={helperTextStyles}>{helperText}</div>}
    </div>
  );

  return (
    <>
      {neumorphicBox ? (
        <NeumorphicBox 
          containerType="inwards"
          padding="2px" 
          borderRadius="50px"
          width="100%"
        >
          {SelectComponent}
        </NeumorphicBox>
      ) : (
        SelectComponent
      )}
    </>
  );
};

export default CustomSelectFieldV2;
