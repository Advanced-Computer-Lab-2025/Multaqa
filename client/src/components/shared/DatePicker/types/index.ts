export interface DatePickerProps {
  id: string;
  name: string; // Field name for Formik integration
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string; // Fallback error message if Formik meta.error is not available
  minDate?: Date | string;
  containerType?: "outwards" | "inwards";
  touched?: boolean;
}
