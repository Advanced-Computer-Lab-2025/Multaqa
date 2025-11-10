export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadFieldProps {
  label: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  width?: string | number; // Width of the container - can be px (number) or any CSS unit (string)
  icon?: React.ReactNode;
  showPreviewAs?: "image" | "file"; // control how preview is shown
  variant?: "folder" | "tax-card" | "logo"; // Different document type variants
  uploadStatus?: UploadStatus; // Upload state: idle, uploading, success, or error
  onFileSelected?: (file: File | null) => void;
}
