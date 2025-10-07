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
    
    switch (fieldType) {
      case "email":
        return "example@email.com";
      case "password":
        return "Enter your password";
      case "text":
        return label ? `Enter ${label.toLowerCase()}` : "Enter text";
      default:
        return "";
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      {/* Separate Label */}
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'system-ui, -apple-system, sans-serif',
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
            padding: '12px 16px',
            paddingRight: fieldType === "password" ? '48px' : '16px',
            fontSize: '15px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#1f2937',
            backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
            border: `2px solid ${isFocused ? '#3b82f6' : '#e5e7eb'}`,
            borderRadius: '9999px',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
              : 'none',
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