export type ModalType = 'confirm' | 'warning' | 'error' | 'success' | 'info' | 'delete';

export interface CustomModalProps {
  title: string;
  modalType: ModalType;
  description?: string;
  borderColor?: string;
  /** Optional border color for the modal wrapper; defaults to theme.palette.tertiary.main */
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

export interface CustomModalLayoutProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  width?: string; // Optional Tailwind width classes with breakpoints (e.g., "w-[90vw] sm:w-[80vw] lg:w-[60vw]")
  /** Optional border color for the modal wrapper; defaults to theme.palette.tertiary.main */
  borderColor?: string;
}