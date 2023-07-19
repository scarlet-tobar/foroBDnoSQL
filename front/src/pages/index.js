// IndexPage.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import Navbar from '@/components/navbar';
import QueryPostsByCommunity from '@/components/QueryPostsByCommunity';
import CommunityList from '@/components/CommunityList';
import FriendList from '@/components/friends';
import CreatePostPopup from '@/components/CreatePostPopup';

const GET_COMMUNITIES_BY_USER_EMAIL = gql`
  query GetCommunitiesByUserEmail($email: String!) {
    communitiesByUserEmail(email: $email) {
      name
      description
      createdby
      members
      tags {
        name
      }
    }
  }
`;

const IndexPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    // Obtener el email del usuario logeado desde el localStorage
    const email = localStorage.getItem('email');
    setUserEmail(email);
  }, []);

  const { loading: communityLoading, error: communityError, data: communityData } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  useEffect(() => {
    if (!communityLoading && communityData) {
      setCommunities(communityData.communitiesByUserEmail);
    }
  }, [communityLoading, communityData]);

  if (communityLoading) return <p>Loading...</p>;
  if (communityError) return <p>Error: {communityError.message}</p>;

  return (
    <div>
      <Navbar />
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
          <div>
              
            </div>
            {communities.map((community) => (
              <div key={community.name}>
                <QueryPostsByCommunity communityName={community.name} />
              </div>
            ))}
          </Grid>
          <Grid item xs={3}>
            <CreatePostPopup userEmail={userEmail}/>
            <FriendList />
            <CommunityList communities={communities} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default IndexPage;
