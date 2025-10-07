export interface RichTextFieldProps {
  label: string; // e.g., "Description"
  onContentChange: (htmlContent: string) => void;
  placeholder?: string;
}

export type FontOption = {
  label: string;
  value: string;
};

export type FontSizeOption = {
  label: string;
  value: string; // Used for font size in pixels or rem
};