

export interface CustomSearchProps {
  icon?: boolean;
  width?: string;
  type?:"inwards"|"outwards",
  label?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
