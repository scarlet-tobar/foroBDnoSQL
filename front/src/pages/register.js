import React, { useState } from 'react';
import { Container, TextField, Button, Select, MenuItem } from '@mui/material';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import client from './_app';


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  }
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      const client = new ApolloClient({
        uri: 'http://localhost:4000/graphql', // Cambia esto si tu servidor GraphQL se encuentra en otro lugar
        cache: new InMemoryCache(),
      });

      const CREATE_USER = gql`
      mutation userInput(
        $email: String!
        $nickname: String!
        $password: String!
        $country: String!
        $language: String!
      ) {
        createUser(
          userInput: {
            email: $email
            nickname: $nickname
            password: $password
            country: $country
            language: $language
          }
        ) {
            email
            nickname
        }
      }
    `;


      const CREATE_USER_N = gql`
      mutation userInput(
        $email: String!
        $nickname: String!
        $password: String!
        $country: String!
        $language: String!
      ) {
        createUserNeo4j(
          userInput: {
            email: $email
            nickname: $nickname
            password: $password
            country: $country
            language: $language
          }
        ) {
            email
            nickname
        }
      }
    `;
      const { data } = await client.mutate({
        mutation: CREATE_USER,
        variables: { email,nickname, password,country, language },
      });
      const { data2 } = await client.mutate({
        mutation: CREATE_USER_N,
        variables: { email,nickname, password,country, language },
      });
      localStorage.setItem('email', email);
      localStorage.setItem('nickname', nickname);
      window.location.href = '/'; // Cambia '/index' por la ruta de tu página index
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
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            required
            label="Nickname"
            variant="outlined"
            fullWidth
            value={nickname}
            onChange={handleNicknameChange}
          />
          <TextField
            required
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
          <label>Country</label>
          <Select
            required
            label="Country"
            variant="outlined"
            fullWidth
            value={country}
            onChange={handleCountryChange}
          >
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="Argentina">Argentina</MenuItem>
            <MenuItem value="Bolivia">Bolivia</MenuItem>
            <MenuItem value="Chile">Chile</MenuItem>
            <MenuItem value="Colombia">Colombia</MenuItem>
            <MenuItem value="Cuba">Cuba</MenuItem>
            <MenuItem value="Ecuador">Ecuador</MenuItem>
            <MenuItem value="El Salvador">El Salvador</MenuItem>
            <MenuItem value="Guatemala">Guatemala</MenuItem>
            <MenuItem value="Honduras">Honduras</MenuItem>
            <MenuItem value="México">México</MenuItem>
            <MenuItem value="Nicaragua">Nicaragua</MenuItem>
            <MenuItem value="Panamá">Panamá</MenuItem>
            <MenuItem value="Paraguay">Paraguay</MenuItem>
            <MenuItem value="Perú">Perú</MenuItem>
            <MenuItem value="República Dominicana">República Dominicana</MenuItem>
            <MenuItem value="Uruguay">Uruguay</MenuItem>
            <MenuItem value="Venezuela">Venezuela</MenuItem>
            <MenuItem value="Puerto Rico">Puerto Rico</MenuItem>
          </Select>
          <label>Language</label>
          <Select
            label="Language"
            variant="outlined"
            fullWidth
            value={language}
            onChange={handleLanguageChange}>
            <MenuItem value='EN'>EN</MenuItem>
            <MenuItem value='ES'>ES</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" >
            Register
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default RegisterPage;
