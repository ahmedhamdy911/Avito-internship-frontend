import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const LoadingOverlay: React.FC = () => (
  <Box
    sx={{
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <CircularProgress />
  </Box>
);
