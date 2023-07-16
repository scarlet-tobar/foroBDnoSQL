import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery } from '@apollo/client';

const IndexPage = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Obtener el email del usuario logeado desde el localStorage
    const email = localStorage.getItem('email');
    setUserEmail(email);
  }, []);

  const GET_COMMUNITIES_BY_USER_EMAIL = gql`
    query GetCommunitiesByUserEmail($email: String!) {
      communitiesByUserEmail(email: $email) {
        name
        description
        createdby
        members {
          email
          nickname
        }
        tags {
          name
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Posts by Communities
      </Typography>

      {data.communitiesByUserEmail.map((community) => (
        <div key={community.name}>
          <Typography variant="h5" component="h2" gutterBottom>
            Community: {community.name}
          </Typography>

          <QueryPostsByCommunity communityName={community.name} />
        </div>
      ))}
    </Container>
  );
};

const QueryPostsByCommunity = ({ communityName }) => {
  const GET_POSTS_BY_COMMUNITY = gql`
    query GetPostsByCommunity($communityName: String!) {
      postsByCommunity(communityName: $communityName) {
        title
        description
        community
        likes {
          email
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_POSTS_BY_COMMUNITY, {
    variables: { communityName },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data.postsByCommunity.map((post) => (
        <PostContainer key={post.title} post={post} />
      ))}
    </>
  );
};

const PostContainer = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLikeClick = () => {
    // Simulación de la acción de dar like
    setLikesCount(likesCount + 1);
  };

  return (
    <Container maxWidth="sm" sx={{ marginBottom: 2, border: '1px solid #ccc', padding: 2 }}>
      <Typography variant="h6">{post.title}</Typography>
      <Typography variant="body1">{post.description}</Typography>
      <Typography variant="body2">Community: {post.community}</Typography>
      <Button variant="contained" color="primary" onClick={handleLikeClick}>
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </Button>
    </Container>
  );
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Cambia esto si tu servidor GraphQL se encuentra en otro lugar
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <IndexPage />
  </ApolloProvider>
);

export default App;
