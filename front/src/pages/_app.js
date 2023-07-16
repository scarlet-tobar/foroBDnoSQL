import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import PostsByCommunityPage from './index';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Cambia esto si tu servidor GraphQL se encuentra en otro lugar
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <PostsByCommunityPage />
    </ApolloProvider>
  );
};

export default App;
