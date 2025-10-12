export const formatDateToString = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

export const getMinDate = (minDate?: Date | string): string => {
  if (!minDate) {
    return new Date().toISOString().split("T")[0];
  }

  if (typeof minDate === "string") {
    return minDate;
  }

  return minDate.toISOString().split("T")[0];
};

export const parseStringToDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  return new Date(dateString);
};
