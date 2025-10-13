import React from "react";
import { Box, InputAdornment, IconButton } from "@mui/material";
import { inputBaseClasses } from "@mui/material/InputBase";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ListIcon from "@mui/icons-material/List";
import {
  FieldType,
  StakeholderType,
  SelectFieldType,
  SelectOption,
} from "../types";
import theme from "@/themes/lightTheme";

/**
 * Get email domain based on stakeholder type
 */
export const getEmailDomain = (stakeholderType?: StakeholderType) => {
  switch (stakeholderType) {
    case "student":
      return "@student.guc.edu.eg";
    case "staff":
    case "ta":
    case "professor":
    case "admin":
    case "events-office":
      return "@guc.edu.eg";
    case "vendor":
      return "";
    default:
      return "";
  }
};

/**
 * Get the appropriate icon based on field type
 */
export const getFieldIcon = (fieldType: FieldType) => {
  switch (fieldType) {
    case "email":
      return <EmailIcon sx={{ mr: 1, fontSize: "1rem" }} />;
    case "text":
      return <PersonIcon sx={{ mr: 1, fontSize: "1rem" }} />;
    case "password":
      return <LockIcon sx={{ mr: 1, fontSize: "1rem" }} />;
    case "numeric":
    case "phone":
      return <PhoneIcon sx={{ mr: 1, fontSize: "1rem" }} />;
    default:
      return null;
  }
};

/**
 * Create label with icon
 */
export const createLabelWithIcon = (label?: string, fieldType?: FieldType) => {
  if (!label || !fieldType) return undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {getFieldIcon(fieldType)}
      {label}
    </Box>
  );
};

/**
 * Get email input adornment with domain hint
 */
export const getEmailEndAdornment = (
  stakeholderType?: StakeholderType,
  error?: boolean
) => {
  if (stakeholderType === "vendor") return undefined;

  return (
    <InputAdornment
      position="end"
      sx={{
        color: error ? theme.palette.error.main : theme.palette.tertiary.dark,
        alignSelf: "center",
        margin: 0,
        opacity: error ? 1 : 0,
        pointerEvents: "none",
        transition:
          "opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: error ? "translateX(0px)" : "translateX(10px)",
        [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
          opacity: 1,
          transform: "translateX(0px)",
        },
      }}
    >
      {getEmailDomain(stakeholderType)}
    </InputAdornment>
  );
};

/**
 * Get password visibility toggle adornment
 */
export const getPasswordEndAdornment = (
  showPassword: boolean,
  onToggle: () => void,
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void
) => {
  return (
    <InputAdornment position="end">
      <IconButton
        size="small"
        aria-label="toggle password visibility"
        onClick={onToggle}
        onMouseDown={onMouseDown}
        edge="end"
        sx={{
          "&:hover": {
            color: theme.palette.tertiary.dark,
          },
          transition: "color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {showPassword ? (
          <VisibilityOffIcon sx={{ fontSize: "1.1rem" }} />
        ) : (
          <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
        )}
      </IconButton>
    </InputAdornment>
  );
};

/**
 * Handle email input change - only allow username part before @ for non-vendors
 */
export const handleEmailInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  fieldType: FieldType,
  stakeholderType?: StakeholderType,
  setEmailUsername?: (value: string) => void,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
) => {
  const inputValue = event.target.value;

  if (fieldType === "email" && stakeholderType !== "vendor") {
    // Remove any @ symbols and everything after them
    const cleanValue = inputValue.split("@")[0];
    if (setEmailUsername) {
      setEmailUsername(cleanValue);
    }

    // Call parent onChange with full email if provided
    if (onChange) {
      const syntheticEvent = {
        ...event,
        target: {
          ...event.target,
          value: cleanValue + getEmailDomain(stakeholderType),
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  } else {
    // For non-email fields or vendor users, use normal onChange
    if (onChange) {
      onChange(event);
    }
  }
};

/**
 * Handle key press to prevent @ symbol for non-vendor email fields
 */
export const handleEmailKeyPress = (
  event: React.KeyboardEvent<HTMLInputElement>,
  fieldType: FieldType,
  stakeholderType?: StakeholderType,
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
) => {
  if (
    fieldType === "email" &&
    stakeholderType !== "vendor" &&
    event.key === "@"
  ) {
    event.preventDefault();
  }

  // Call parent onKeyPress if provided
  if (onKeyPress) {
    onKeyPress(event);
  }
};

/**
 * Get display value for email fields (username only for non-vendors)
 */
export const getEmailDisplayValue = (
  value: unknown,
  fieldType: FieldType,
  stakeholderType?: StakeholderType,
  emailUsername?: string
) => {
  if (fieldType === "email" && stakeholderType !== "vendor") {
    return emailUsername;
  }
  return value;
};

/**
 * Handle checkbox group value change
 * Updates the selected values array based on checkbox checked state
 */
export const handleCheckboxGroupChange = (
  value: string,
  checked: boolean,
  currentSelectedValues: string[],
  setSelectedValues: (values: string[]) => void,
  onChange?: (selectedValues: string[]) => void
) => {
  const newSelectedValues = checked
    ? [...currentSelectedValues, value]
    : currentSelectedValues.filter((v) => v !== value);

  setSelectedValues(newSelectedValues);

  if (onChange) {
    onChange(newSelectedValues);
  }
};

/**
 * Handle radio group value change
 * Updates the selected value for radio groups
 */
export const handleRadioGroupChange = (
  value: string,
  setSelectedValue: (value: string) => void,
  onRadioChange?: (selectedValue: string) => void
) => {
  setSelectedValue(value);

  if (onRadioChange) {
    onRadioChange(value);
  }
};

/**
 * Get the appropriate icon based on select field type
 */
export const getSelectFieldIcon = (fieldType: SelectFieldType) => {
  switch (fieldType) {
    case "single":
      return <ArrowDropDownIcon sx={{ mr: 1, fontSize: "1rem" }} />;
    case "multiple":
      return <ListIcon sx={{ mr: 1, fontSize: "1rem" }} />;
    default:
      return null;
  }
};

/**
 * Create label with icon for select fields (reuses createLabelWithIcon pattern)
 */
export const createSelectLabelWithIcon = (
  label?: string,
  fieldType?: SelectFieldType
) => {
  if (!label || !fieldType) return undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {getSelectFieldIcon(fieldType)}
      {label}
    </Box>
  );
};

/**
 * Handle select field value change (reuses pattern from handleEmailInputChange)
 */
export const handleSelectFieldChange = (
  value: string | number | string[] | number[],
  onChange?: (value: string | number | string[] | number[]) => void
) => {
  if (onChange) {
    onChange(value);
  }
};

/**
 * Get display value for select fields - handles both single and multiple selections
 */
export const getSelectFieldDisplayValue = (
  value: unknown,
  fieldType: SelectFieldType
) => {
  if (!value) return fieldType === "multiple" ? [] : "";

  if (fieldType === "multiple" && Array.isArray(value)) {
    return value;
  }

  return value;
};

/**
 * Format selected values for display in select field
 */
export const formatSelectDisplayText = (
  selected: unknown,
  options: SelectOption[],
  fieldType: SelectFieldType,
  placeholder?: string
): string | React.ReactElement => {
  if (fieldType === "multiple" && Array.isArray(selected)) {
    if (selected.length === 0) {
      return <em>{placeholder}</em>;
    }
    return selected
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .filter(Boolean)
      .join(", ");
  }

  if (!selected) {
    return <em>{placeholder}</em>;
  }

  const option = options.find((opt) => opt.value === selected);
  return option ? option.label : String(selected);
};

/**
 * Generic focus handler - reusable for all input components
 */
export const createFocusHandler = (
  setIsFocused: (focused: boolean) => void,
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
) => {
  return (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(event);
    }
  };
};

/**
 * Generic blur handler - reusable for all input components
 * Handles email domain completion for non-vendor stakeholder types
 * Normalizes spaces in text fields (removes multiple spaces)
 */
export const createBlurHandler = (
  setIsFocused: (focused: boolean) => void,
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
  fieldType?: FieldType,
  stakeholderType?: StakeholderType,
  value?: unknown,
  emailUsername?: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  autoCapitalizeName?: boolean
) => {
  return (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    // For email fields with non-vendor stakeholders, ensure domain is appended
    if (
      fieldType === "email" &&
      stakeholderType &&
      [
        "student",
        "staff",
        "ta",
        "professor",
        "admin",
        "events-office",
      ].includes(stakeholderType) &&
      onChange
    ) {
      const currentValue = String(value || "");
      const username = emailUsername || currentValue.split("@")[0];
      const domain = getEmailDomain(stakeholderType);

      // Only update if domain isn't already present
      if (!currentValue.includes(domain)) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: username + domain,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        // Call the parent's onChange to update the full email
        onChange(syntheticEvent);
      }
    }

    // For text fields with auto-capitalization, normalize spaces on blur
    if (fieldType === "text" && autoCapitalizeName && onChange) {
      const currentValue = String(value || "");
      const normalizedValue = capitalizeName(currentValue, false); // preserveSpaces = false

      // Only update if the value changed
      if (currentValue !== normalizedValue) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: normalizedValue,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    }

    if (onBlur) {
      onBlur(event);
    }
  };
};

/**
 * Create select change handler - handles SelectChangeEvent to value conversion
 */
export const createSelectChangeHandler = (
  onChange?: (value: string | number | string[] | number[]) => void
) => {
  return (event: { target: { value: unknown } }) => {
    const newValue = event.target.value;
    handleSelectFieldChange(
      newValue as string | number | string[] | number[],
      onChange
    );
  };
};

/**
 * Capitalize names properly - handles first, last, middle, and full names
 * Supports special cases like:
 * - Multiple words: "john doe" → "John Doe"
 * - Hyphens: "mary-jane" → "Mary-Jane"
 * - Apostrophes: "o'brien" → "O'Brien"
 * - Multiple spaces: preserved during typing, normalized on blur
 * - Prefixes: "van der waals" → "Van Der Waals"
 * - Roman numerals: "henry viii" → "Henry VIII"
 */
export const capitalizeName = (
  name: string,
  preserveSpaces: boolean = true
): string => {
  if (!name || typeof name !== "string") return "";

  // Only clean up spaces if not preserving them (e.g., on blur)
  const cleanedName = preserveSpaces ? name : name.trim().replace(/\s+/g, " ");

  // Special prefixes that should remain lowercase (unless at start)
  const lowercasePrefixes = [
    "van",
    "de",
    "der",
    "den",
    "von",
    "da",
    "di",
    "del",
  ];

  // Roman numerals pattern
  const romanNumerals =
    /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)$/i;

  const capitalizeWord = (word: string, isFirst: boolean = false): string => {
    if (!word) return "";

    // Check if it's a roman numeral
    if (romanNumerals.test(word)) {
      return word.toUpperCase();
    }

    // Check if it's a lowercase prefix (and not the first word)
    if (!isFirst && lowercasePrefixes.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }

    // Handle apostrophes (e.g., O'Brien, D'Angelo)
    if (word.includes("'")) {
      return word
        .split("'")
        .map((part, index) => {
          if (index === 0 || part.length > 1) {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          }
          return part.toLowerCase();
        })
        .join("'");
    }

    // Handle hyphens (e.g., Mary-Jane, Jean-Paul)
    if (word.includes("-")) {
      return word
        .split("-")
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join("-");
    }

    // Standard capitalization
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  // Split by spaces and capitalize each word
  const words = cleanedName.split(" ");
  return words
    .map((word, index) => capitalizeWord(word, index === 0))
    .join(" ");
};

/**
 * Handle name input change with automatic capitalization
 * To be used with text fields that capture names
 */
export const handleNameInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
) => {
  const inputValue = event.target.value;

  // Capitalize the name
  const capitalizedValue = capitalizeName(inputValue);

  // Call parent onChange with capitalized value
  if (onChange) {
    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        value: capitalizedValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  }
};
