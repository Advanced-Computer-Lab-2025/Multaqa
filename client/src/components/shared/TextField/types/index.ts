import { FieldHookConfig } from "formik";

export type RichTextFieldProps =
  | (FieldHookConfig<string> & {   // Formik mode
      label?: string;
      placeholder?: string;
      value?: never;               // forbid – we read from Formik
      onChange?: never;
    })
  | {                               // Plain-form mode
      name?: string;               // optional – only for accessibility
      label?: string;
      placeholder?: string;
      value: string;
      onChange: (html: string) => void;
    };

export type FontOption = {
  label: string;
  value: string;
};

export type FontSizeOption = {
  label: string;
  value: string; // Used for font size in pixels or rem
};