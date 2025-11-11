import React from 'react';
import { Box, Typography } from '@mui/material';

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
    {children}
  </Typography>
);

export const IconWrapper = ({ 
  icon: Icon, 
  text, 
  color 
}: { 
  icon: any, 
  text: string,
  color: string 
}) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
    <Icon size={20} color={color} />
    <Typography variant="body2">{text}</Typography>
  </Box>
);