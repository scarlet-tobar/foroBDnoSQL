import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('email');
    window.location.href = '/login';
  };

  const nickname = localStorage.getItem('nickname');

  return (
    <AppBar position="static" style={{ margin: 0 }}>

      <Toolbar>
        {nickname && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bienvenido, {nickname}!
          </Typography>
        )}
        <Button color="inherit" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
