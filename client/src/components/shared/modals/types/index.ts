export interface CustomModalProps {
  title?: string;
  description?: string;
  buttonOption1?: {
    label: string;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    onClick?: () => void;
  };
  buttonOption2?: {
    label: string;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    onClick?: () => void;
  };
}