import React from 'react';
import { SelectFieldV2StyleProps, DropdownStyleProps, OptionStyleProps } from '../types';

/**
 * Styles for the main select container
 */
export const getSelectFieldStyles = (props: SelectFieldV2StyleProps): React.CSSProperties => {
  const { isFocused, isHovered, hasValue, isError, disabled, size, neumorphicBox, minWidthFromContent } = props;

  const paddingValue = size === "small" ? "10px 40px 10px 16px" : "12px 40px 12px 18px";
  const fontSize = "1rem"; // Unified font size with TextField
  const minHeight = size === "small" ? "40px" : "48px";
  const calculatedMinWidth = minWidthFromContent && minWidthFromContent > 0 ? `${minWidthFromContent}px` : '200px';

  // Determine border color priority: error > focus > hover > default
  let borderColor = 'transparent';
  let borderWidth = '1px';
  if (isError) {
    borderColor = '#b81d1d';
  } else if (isFocused) {
    borderColor = '#7851da';
    borderWidth = '2px';
  } else if (isHovered) {
    borderColor = '#7C5CFF';
  }

  return {
    flex: '1 0 auto',
    minWidth: calculatedMinWidth,
    maxWidth: '100%',
    minHeight,
    padding: paddingValue,
    borderRadius: '50px',
    border: `${borderWidth} solid ${borderColor}`,
    outline: 'none',
    backgroundColor: neumorphicBox ? 'transparent' : '#e5e7eb',
    color: hasValue ? '#1E1E1E' : '#999',
    fontSize,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    boxSizing: 'border-box',
  };
};

/**
 * Styles for the floating label
 */
export const getLabelStyles = (
  hasValue: boolean,
  isFocused: boolean,
  fontSize: string,
  neumorphicBox: boolean
): React.CSSProperties => {
  return {
    position: 'absolute',
    left: '8px',
    top: hasValue || isFocused ? '-8px' : '50%',
    transform: hasValue || isFocused ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: hasValue || isFocused ? '0.75rem' : fontSize,
    fontWeight: 500,
    color: isFocused ? '#7851da' : '#999',
    backgroundColor: neumorphicBox ? '#e5e7eb' : '#e5e7eb',
    padding: '0 8px',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    pointerEvents: 'none' as const,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: 'fit-content',
    maxWidth: 'fit-content',
  };
};

/**
 * Styles for the dropdown arrow icon
 */
export const getDropdownIconStyles = (isOpen: boolean): React.CSSProperties => {
  return {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    color: '#7851da',
    pointerEvents: 'none' as const,
    // Increased chevron size slightly (label untouched)
    fontSize: '23px',
    fontWeight: 'bold',
  };
};

/**
 * Styles for the dropdown menu
 */
export const getDropdownStyles = (props: DropdownStyleProps): React.CSSProperties => {
  const { isOpen } = props;

  return {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    maxHeight: '250px',
    overflowY: 'auto' as const,
    backgroundColor: '#e5e7eb',
    borderRadius: '16px',
    // High z-index to ensure the dropdown overlays modals/other UI; inline styles outrank non-!important rules
    zIndex: 9999 ,
    marginBottom: '16px',
    // Removed box shadow for a cleaner look for the dropdown styles
    // boxShadow: `
    //   -5px -5px 10px 0 #FAFBFF,
    //   5px 5px 10px 0 rgba(22, 27, 29, 0.25)
    // `,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' as const : 'hidden' as const,
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // Hide scrollbar while keeping scroll functionality
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const,
  };
};

/**
 * Styles for individual dropdown options
 */
export const getOptionStyles = (props: OptionStyleProps): React.CSSProperties => {
  const { isSelected, isDisabled } = props;

  return {
    padding: '12px 18px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: isDisabled ? '#999' : '#1E1E1E',
    backgroundColor: isSelected ? 'rgba(120, 81, 218, 0.1)' : 'transparent',
    position: 'relative' as const,
    width: '100%',
    boxSizing: 'border-box',
    ...(isSelected && {
      borderLeft: '3px solid #7851da',
    }),
  };
};

/**
 * Styles for helper text
 */
export const getHelperTextStyles = (isError: boolean): React.CSSProperties => {
  return {
    fontSize: '0.75rem',
    color: isError ? '#b81d1d' : '#666',
    marginTop: '6px',
    marginLeft: '18px',
    fontWeight: 400,
  };
};

/**
 * Styles for the display value container
 */
export const getDisplayValueStyles = (): React.CSSProperties => {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: '1 1 0%',
    minWidth: 0,
    maxWidth: '100%',
  };
};

/**
 * Get hover styles for options (used in onMouseEnter/onMouseLeave)
 */
export const getOptionHoverStyles = (
  isSelected: boolean,
  isDisabled: boolean,
  isHovered: boolean
): React.CSSProperties => {
  if (isDisabled) {
    return {};
  }

  return {
    backgroundColor: isHovered
      ? 'rgba(120, 81, 218, 0.08)'
      : isSelected
        ? 'rgba(120, 81, 218, 0.1)'
        : 'transparent',
  };
};
