import React, { useState } from 'react';
import { CustomTextFieldProps } from '../types';
import theme from '@/themes/lightTheme';

// Custom styled component - no MUI dependency
const StyledDefaultTextField: React.FC<CustomTextFieldProps & { separateLabels?: boolean }> = ({
  label,
  fieldType,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  type,
  disabled = false,
  autoCapitalizeName = true,
  neumorphicBox = false,
  disableDynamicMorphing = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Extract and exclude conflicting props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { value: propsValue, onChange: propsOnChange, ...inputProps } = props as any;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldType === "text" && autoCapitalizeName) {
      const words = e.target.value.split(' ');
      const capitalized = words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: capitalized }
      } as React.ChangeEvent<HTMLInputElement>;
      
      if (onChange) onChange(syntheticEvent);
    } else {
      if (onChange) onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputType = () => {
    if (fieldType === "password") {
      return showPassword ? "text" : "password";
    }
    return type || fieldType || "text";
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    const labelLower = label?.toLowerCase() || '';
    
    switch (fieldType) {
      case "email":
        return "example@domain.com";
      case "password":
        return "Enter a strong password (min 8 characters)";
      case "text":
        if (labelLower.includes('first name') || labelLower.includes('firstname')) {
          return "e.g., John";
        } else if (labelLower.includes('last name') || labelLower.includes('lastname')) {
          return "e.g., Doe";
        } else if (labelLower.includes('full name') || labelLower.includes('name')) {
          return "e.g., John Doe";
        } else {
          return label ? `Enter ${label.toLowerCase()}` : "Enter text";
        }
      case "phone":
        return "e.g., +1 234 567 8900";
      case "numeric":
        return "Enter a number";
      default:
        return "";
    }
  };

  // Get icon based on field type
  const getFieldIcon = () => {
    // Icon color: gray when not focused, tertiary color when focused (for both neumorphic and non-neumorphic)
    const iconColor = isFocused ? theme.palette.tertiary.main : '#999';
    const iconStyle = { 
      fontSize: '0.75rem',
      color: iconColor,
      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
    
    const iconSize = 12;
    
    switch (fieldType) {
      case "email":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case "password":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case "text":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case "phone":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        );
      case "numeric":
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}>
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="14" y2="21" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get styles based on neumorphicBox prop
  const getInputStyles = () => {
    if (neumorphicBox) {
      // Determine border color: focus > hover > transparent
      let borderColor = 'transparent';
      if (isFocused) {
        borderColor = theme.palette.tertiary.main;
      } else if (isHovered) {
        borderColor = theme.palette.primary.main;
      }

      // Neumorphic styling with border on hover/focus
      return {
        width: '100%',
        padding: '12px 18px',
        paddingRight: fieldType === "password" ? '48px' : '18px',
        fontSize: '1rem',
        fontWeight: 500,
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        color: theme.palette.text.primary,
        backgroundColor: disabled ? '#f3f4f6' : theme.palette.background.default,
        border: `2px solid ${borderColor}`,
        borderRadius: '50px',
        outline: 'none',
        transition: 'box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: disableDynamicMorphing
          ? '-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.25)'
          : isFocused
            ? 'inset -2px -2px 5px 0 #FAFBFF, inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)' 
            : '-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.25)',
        transform: disableDynamicMorphing
          ? 'scale(1)'
          : isFocused ? 'scale(0.998)' : 'scale(1)',
        cursor: disabled ? 'not-allowed' : 'text',
      };
    } else {
      // Standard MUI-like styling with underline (thin by default, thicker on focus)
      return {
        width: '100%',
        padding: '8px 16px',
        paddingRight: fieldType === "password" ? '48px' : '16px',
        paddingBottom: '8px',
        fontSize: '1rem',
        fontWeight: 500,
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: isFocused 
          ? `2px solid ${theme.palette.primary.main}` 
          : '1px solid rgba(0, 0, 0, 0.42)',
        borderRadius: '0',
        outline: 'none',
        transition: 'border-bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: disabled ? 'not-allowed' : 'text',
      };
    }
  };

  const getLabelStyles = () => {
    if (neumorphicBox) {
      // Neumorphic mode: same size as non-neumorphic, changes to tertiary color on focus, with left padding
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        marginBottom: '8px',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.4375,
        color: isFocused ? theme.palette.tertiary.main : '#999',
        paddingLeft: '16px',
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      };
    } else {
      // Standard MUI-like mode: smaller sizing, changes to tertiary color on focus, tight spacing
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        marginBottom: '4px',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.4375,
        color: isFocused ? theme.palette.tertiary.main : '#999',
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      };
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Separate Label - Rendered outside when neumorphic */}
      {label && (
        <label style={getLabelStyles()}>
          {getFieldIcon()}
          {label}
          {props.required && (
            <span style={{ color: theme.palette.error.main, marginLeft: '2px' }}>*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <input
          {...inputProps}
          type={getInputType()}
          value={value || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          placeholder={getPlaceholderText()}
          disabled={disabled}
          style={getInputStyles()}
        />

        {/* Password Toggle Button */}
        {fieldType === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) e.currentTarget.style.color = theme.palette.primary.main;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isFocused ? theme.palette.primary.main : '#999';
            }}
          >
            {showPassword ? (
              // Eye slash icon (hidden)
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon (visible)
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default StyledDefaultTextField;