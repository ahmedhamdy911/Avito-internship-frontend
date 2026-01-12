import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useColorModeTheme } from '../theme/ColorModeContext';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { mode, toggleMode } = useColorModeTheme();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Avito Moderation
        </Typography>
        <Button
          component={RouterLink}
          to="/list"
          color={isActive('/list') ? 'primary' : 'inherit'}
        >
          Список
        </Button>
        <Button
          component={RouterLink}
          to="/stats"
          color={isActive('/stats') ? 'primary' : 'inherit'}
        >
          Статистика
        </Button>
        <Box sx={{ flexGrow: 0 }} />
        <Button variant="outlined" size="small" onClick={toggleMode}>
          {mode === 'light' ? 'Тёмная' : 'Светлая'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
