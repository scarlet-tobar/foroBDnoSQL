import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useRouter } from 'next/router';
import IndexPage from './index';
import LoginPage from './login';
import Search from './search'; // Importa el componente Search

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const App = ({ Component, pageProps }) => {
  const router = useRouter();

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
        <Search term={term} /> {/* Pasa el término de búsqueda como prop */}
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
