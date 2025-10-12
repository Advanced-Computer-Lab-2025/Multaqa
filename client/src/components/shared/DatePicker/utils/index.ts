/**
 * Format a Date object to YYYY-MM-DD string format
 */
export const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

/**
 * Get min date for date picker input
 * If minDate is provided, use it, otherwise use today
 */
export const getMinDate = (minDate?: Date | string): string => {
  if (!minDate) {
    return new Date().toISOString().split("T")[0];
  }

  if (typeof minDate === "string") {
    return minDate;
  }

  return minDate.toISOString().split("T")[0];
};

/**
 * Parse a string to a Date object
 */
export const parseStringToDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  return new Date(dateString);
};
