export interface UploadFieldProps {
  label: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  width?: string | number; // Width of the container - can be px (number) or any CSS unit (string)
  icon?: React.ReactNode;
  showPreviewAs?: "image" | "file"; // control how preview is shown
}
