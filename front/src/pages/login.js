import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useRouter } from 'next/router';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql',
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

      if (data.user && data.user.email === email) {
        localStorage.setItem('email', email);
        localStorage.setItem('nickname', data.user.nickname);
        window.location.href = '/';
      } 
    } catch (error) {
      console.error('Error:', error);
      setError('Email or password are incorrect. Please try again.');
    }
  };

  const handleRegister = () => {
    router.push('/register');
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
      <Container
        maxWidth="sm"
        style={{ backgroundColor: 'white', border: '1px solid blue', padding: '20px' }}
      >
        <h2 style={{ textAlign: 'center' }}>Log In</h2>
        {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button type="submit" variant="contained" color="primary">
              Sign In
            </Button>
            <Button variant="text" color="primary" onClick={handleRegister}>
              Register
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default LoginPage;