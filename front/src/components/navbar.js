import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import SearchBar from './SearchBar';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import NotificationBell from './notification';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('email');
    window.location.href = '/login';
    localStorage.removeItem('nickname');
  };

  const handleHomeClick = () => {
    window.location.reload(); // Recargar la página completa
    window.location.href = '/';
  };

  const goToProfile = () => {
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
      router.push(`/Profile/${encodeURIComponent(nickname)}`);
    }
  };

  return (
    <AppBar position="static" style={{ margin: 0 }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Link href="/">
              <Button color="inherit" onClick={handleHomeClick}>
                <HomeIcon style={{ color: 'white' }} />
              </Button>
            </Link>
          </Grid>
          <Grid item xs={1} sx={{ textAlign: 'center' }}>
            <Link href="/sugeridos">
              Sugeridos
            </Link>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'center' }}>
            <SearchBar />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <NotificationBell />
            <AccountBoxIcon
              sx={{ marginLeft: 2, marginRight: 2, cursor: 'pointer' }}
              onClick={goToProfile}
            />
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
