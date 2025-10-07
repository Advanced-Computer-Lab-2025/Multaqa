export interface UploadFieldProps {
  label: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  width?: string;
  icon?: React.ReactNode;
  showPreviewAs?: "image" | "file"; // control how preview is shown
}
