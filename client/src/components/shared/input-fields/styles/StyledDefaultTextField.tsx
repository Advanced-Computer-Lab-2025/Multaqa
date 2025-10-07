import React, { useState } from 'react';
import { CustomTextFieldProps } from '../types';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
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

  return (
    <div style={{ width: '100%' }}>
      {/* Separate Label */}
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#999',
            paddingLeft: '16px',
            fontFamily: 'var(--font-poppins), system-ui, sans-serif',
          }}
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
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
          style={{
            width: '100%',
            padding: '12px 18px',
            paddingRight: fieldType === "password" ? '48px' : '18px',
            fontSize: '1rem',
            fontWeight: 500,
            fontFamily: 'var(--font-poppins), system-ui, sans-serif',
            color: '#1f2937',
            backgroundColor: disabled ? '#f3f4f6' : '#e5e7eb',
            border: 'none',
            borderRadius: '50px',
            outline: 'none',
            transition: 'box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: disableDynamicMorphing
              ? '-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.25)'
              : isFocused
                ? 'inset -2px -2px 5px 0 #FAFBFF, inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)' 
                : '-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.25)',
            transform: disableDynamicMorphing
              ? 'scale(1)'
              : isFocused ? 'scale(0.998)' : 'scale(1)',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
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
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'color 0.2s ease',
              opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            {showPassword ? (
              // Eye slash icon (hidden)
              <svg
                width="20"
                height="20"
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
                width="20"
                height="20"
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