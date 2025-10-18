/**
 * Format a Date object to a string suitable for datetime-local input
 */
export const formatDateTimeToString = (date: Date | null): string => {
  if (!date) return "";

  // Convert to local timezone for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Parse a datetime-local input string to a Date object
 */
export const parseStringToDateTime = (dateTimeString: string): Date | null => {
  if (!dateTimeString) return null;

  try {
    // Create a new Date object from the datetime-local string
    const date = new Date(dateTimeString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Get minimum date string for datetime-local input
 */
export const getMinDateTime = (minDate?: Date | string): string => {
  const now = new Date();
  const min = minDate ? (typeof minDate === 'string' ? new Date(minDate) : minDate) : now;
  const effectiveMin = min > now ? min : now;

  return formatDateTimeToString(effectiveMin);
};

/**
 * Validate numeric input - only allow numbers
 */
export const validateNumericInput = (value: string): boolean => {
  return /^[0-9]*$/.test(value);
};

/**
 * Handle numeric input change - restrict to numbers only
 */
export const handleNumericChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
): void => {
  const value = event.target.value;
  if (validateNumericInput(value)) {
    onChange(value);
  }
};

/**
 * Handle numeric key press - prevent non-numeric characters
 */
export const handleNumericKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
  const char = String.fromCharCode(event.which);
  if (!/[0-9]/.test(char)) {
    event.preventDefault();
  }
};

/**
 * Convert minutes to readable duration format
 * @param minutes - Number of minutes
 * @returns Formatted duration string (e.g., "1h 30min", "45min", "2h")
 */
export const formatDuration = (minutes: number | string): string => {
  const numMinutes = typeof minutes === 'string' ? parseInt(minutes) || 0 : minutes;

  if (numMinutes === 0) return "0min";
  if (numMinutes < 60) return `${numMinutes}min`;

  const hours = Math.floor(numMinutes / 60);
  const remainingMinutes = numMinutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}min`;
  }
};

/**
 * Convert readable duration format back to minutes
 * @param duration - Duration string (e.g., "1h 30min", "45min", "2h")
 * @returns Number of minutes
 */
export const parseDurationToMinutes = (duration: string): number => {
  if (!duration) return 0;

  // Remove all spaces and convert to lowercase
  const cleanDuration = duration.replace(/\s/g, '').toLowerCase();

  // Match patterns like "1h30min", "2h", "45min", etc.
  const hourMatch = cleanDuration.match(/(\d+)h/);
  const minuteMatch = cleanDuration.match(/(\d+)min/);

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;

  return hours * 60 + minutes;
};

/**
 * Validate duration input and provide helpful feedback
 * @param minutes - Number of minutes
 * @returns Object with validation result and formatted duration
 */
export const validateAndFormatDuration = (minutes: number | string): {
  isValid: boolean;
  formatted: string;
  error?: string;
} => {
  const numMinutes = typeof minutes === 'string' ? parseInt(minutes) || 0 : minutes;

  if (numMinutes === 0) {
    return {
      isValid: false,
      formatted: "0min",
      error: "Duration is required"
    };
  }

  if (numMinutes < 15) {
    return {
      isValid: false,
      formatted: formatDuration(numMinutes),
      error: "Minimum duration is 15 minutes"
    };
  }

  if (numMinutes > 360) {
    return {
      isValid: false,
      formatted: formatDuration(numMinutes),
      error: "Maximum duration is 6 hours (360 minutes)"
    };
  }

  return {
    isValid: true,
    formatted: formatDuration(numMinutes)
  };
};
