import React from 'react';
import { Container, Box } from '@mui/material';
import { AppHeader } from '../components/AppHeader';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
