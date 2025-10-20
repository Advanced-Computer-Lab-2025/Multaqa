

export interface CustomSearchProps {
  icon?: boolean;
  width?: string;
  type?: "inwards" | "outwards",
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  storageKey?: string; // Key for localStorage
  autoSaveDelay?: number; // Delay in ms before auto-saving (default: 2000)
};
