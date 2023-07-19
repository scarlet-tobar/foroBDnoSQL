// index.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import Navbar from '@/components/navbar';
import PostContainer from '@/components/PostContainer';
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

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      idPrimary
      title
      description
      community
      author
      time
      likes {
        email
      }
      dislikes {
        email
      }
    }
  }
`;

const IndexPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [communities, setCommunities] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);

  useEffect(() => {
    // Obtener el email del usuario logeado desde el localStorage
    const email = localStorage.getItem('email');
    if (!email){
      window.location.href= '/login';
    }
    setUserEmail(email);
  }, []);

  const { loading: communityLoading, error: communityError, data: communityData } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_ALL_POSTS);

  useEffect(() => {
    if (!communityLoading && communityData) {
      setCommunities(communityData.communitiesByUserEmail);
    }
  }, [communityLoading, communityData]);

  useEffect(() => {
    if (!postsLoading && postsData) {
      const allPosts = postsData.posts;
      // Create a new copy of the array and sort by the "time" field in descending order
      const sortedPosts = Array.from(allPosts).sort((a, b) => b.time.localeCompare(a.time));
      setSortedPosts(sortedPosts);
    }
  }, [postsLoading, postsData]);

  if (communityLoading || postsLoading) return <p>Loading...</p>;
  if (communityError || postsError) return <p>Error: {communityError?.message || postsError?.message}</p>;

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
            {sortedPosts.map((post) => (
              <PostContainer key={post.idPrimary} post={post} />
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
