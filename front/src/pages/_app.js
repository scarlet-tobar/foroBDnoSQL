// _app.js

import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useRouter } from 'next/router';
import IndexPage from './index';
import LoginPage from './login';
import Search from './search';
import Community from './community/[communityName]';
import RegisterPage from './register';
import UserProfile from './Profile/[userName]';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  if (router.pathname === '/register') {
    return (
      <ApolloProvider client={client}>
        <RegisterPage />
      </ApolloProvider>
    );
  }
  if (router.pathname === '/login') {
    return (
      <ApolloProvider client={client}>
        <LoginPage />
      </ApolloProvider>
    );
  }

  if (router.pathname === '/search') {
    const { term } = router.query;
    return (
      <ApolloProvider client={client}>
        <Search term={term} />
      </ApolloProvider>
    );
  }

  // Agregamos la ruta para mostrar el componente Community
  if (router.query.communityName) {
    const { communityName } = router.query;
    return (
      <ApolloProvider client={client}>
        <Community name={communityName} />
      </ApolloProvider>
    );
  }

  if (router.query.userName) {
    const { userName } = router.query;
    return (
      <ApolloProvider client={client}>
        <UserProfile name={userName} />
      </ApolloProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      <IndexPage />
    </ApolloProvider>
  );
};

export default App;
