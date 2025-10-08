import type { IconType } from '../../Icons/styles';
import type { ModalType } from '../types';

// Helper function to map modal type to icon type
export const getModalIconType = (modalType?: ModalType): IconType | null => {
  switch (modalType) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'info':
      return 'info';
    case 'delete':
      return 'delete';
    case 'confirm':
      return 'help';
    default:
      return null;
  }
};

// Helper function to create a delayed close handler (for ripple effect visibility)
export const createDelayedCloseHandler = (onClose: () => void, delay: number = 500) => {
  return () => {
    setTimeout(() => {
      onClose();
    }, delay);
  };
};
