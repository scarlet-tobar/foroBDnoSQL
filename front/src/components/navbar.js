import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import SearchBar from './SearchBar';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import NotificationBell from './notification';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('email');
    window.location.href = '/login';
    localStorage.removeItem('nickname');
  };
  const handleHomeClick = () => {
    window.location.reload(); // Recargar la página completa
    window.location.href = '/';
  };
  const nickname = localStorage.getItem('nickname');

  return (
    <AppBar position="static" style={{ margin: 0 }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Link href="/">
              
              <Button color="inherit" onClick={handleHomeClick}>
              <HomeIcon style={{ color: 'white' }} />
              </Button>
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <SearchBar />
          </Grid>
          
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NotificationBell/>
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
