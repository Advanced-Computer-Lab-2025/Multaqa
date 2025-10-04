export type ModalType = 'confirm' | 'warning' | 'error' | 'success' | 'info' | 'delete';

export interface CustomModalProps {
  title: string;
  modalType: ModalType;
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

export interface CustomModalLayoutProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}