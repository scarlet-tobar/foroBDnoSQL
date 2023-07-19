import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Navbar from '@/components/navbar';

const ErrorContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const ErrorMessage = styled(Typography)({
  fontSize: '24px',
  marginBottom: '20px',
  textAlign: 'center',
});

const ErrorPage = () => {
  const handleHomeButtonClick = () => {
    window.location.href = '/'; // Redireccionamos al usuario a la página de inicio
  };

  return (
    
    <ErrorContainer>
        
        <LinkOffIcon/>
      <ErrorMessage variant="h1">
        Esta página no está disponible
      </ErrorMessage>
      <Typography variant="body1">
        Es posible que el enlace esté roto o que se haya eliminado la página. Comprueba que el enlace que quieres abrir es correcto.
      </Typography>
      <Button
        onClick={handleHomeButtonClick}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
          marginTop: 10,
        }}
      >
        Volver a inicio
      </Button>
    </ErrorContainer>
  );
};

export default ErrorPage;
