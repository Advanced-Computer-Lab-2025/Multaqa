export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const validateFile = (
  file: File,
  maxFiles?: number,
  currentCount?: number,
  maxFileSize?: number
): { isValid: boolean; error?: string } => {
  if (maxFiles && currentCount && currentCount >= maxFiles) {
    return {
      isValid: false,
      error: `Maximum ${maxFiles} file(s) allowed`,
    };
  }

  if (maxFileSize && file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File size must be less than ${formatFileSize(maxFileSize)}`,
    };
  }

  return { isValid: true };
};
