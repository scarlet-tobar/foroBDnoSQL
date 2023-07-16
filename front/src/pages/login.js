import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql', // Cambia esto si tu servidor GraphQL se encuentra en otro lugar
        cache: new InMemoryCache(),
      });

      const GET_USER_QUERY = gql`
        query GetUser($email: String!, $password: String!) {
          user(email: $email, password: $password) {
            email
            nickname
            country
            language
          }
        }
      `;

      const { data } = await client.query({
        query: GET_USER_QUERY,
        variables: { email, password },
      });

      // Si el email coincide, guardar en el localStorage y redirigir a index
      if (data.user.email === email) {
        localStorage.setItem('email', email);
        localStorage.setItem('nickname', data.user.nickname)
        window.location.href = '/'; // Cambia '/index' por la ruta de tu página index
      } else {
        console.log('El email no coincide');
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Container maxWidth="sm" style={{ backgroundColor: 'white', border: '1px solid blue', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Log In</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default LoginPage;
