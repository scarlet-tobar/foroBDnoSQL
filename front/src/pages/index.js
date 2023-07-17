import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery } from '@apollo/client';
import Navbar from '@/components/navbar';
import QueryPostsByCommunity from '@/components/QueryPostsByCommunity';
import PostsByCommunity from '@/components/PostsByCommunity';
import CommunityList from '@/components/CommunityList';

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

  const { loading: communityLoading, error: communityError, data: communityData } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  if (communityLoading) return <p>Loading...</p>;
  if (communityError) return <p>Error: {communityError.message}</p>;

  const communities = communityData.communitiesByUserEmail;

  return (
    <div>
      <Navbar/>
      <Container
        maxWidth="xl"
        sx={{
          paddingLeft: '16px',
          paddingRight: '16px',
          marginLeft: 0,
          marginRight: 'auto',
          marginTop: '30px',
        }}
      >

        <Grid container spacing={2}>
          <Grid item xs={9}>
            {communities.map((community) => (
              <div key={community.name}>
                <QueryPostsByCommunity communityName={community.name} />
              </div>
            ))}

            <div>
              <PostsByCommunity communityName="General" />
            </div>
          </Grid>

          <Grid item xs={3}>
            <CommunityList communities={communities} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default IndexPage;
