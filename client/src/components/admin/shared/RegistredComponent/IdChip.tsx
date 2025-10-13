"use client"
import { ChipProps } from '@mui/material/Chip';
import { StyledIdChip } from './styles';

const IdChip: React.FC<ChipProps> = ({ children, ...props }) => {
  return <StyledIdChip {...props}>{children}</StyledIdChip>;
};

export default IdChip;
