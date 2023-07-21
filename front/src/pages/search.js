import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Navbar from '../components/navbar';
import PostContainer from '../components/PostContainer';
import CommunityList from '../components/CommunityList';
import { Container, Grid, Typography, Button } from '@mui/material';
import FriendList from '../components/friends';
import Community from './community/[communityName]';

const GET_ALL_POSTS_QUERY = gql`
  query GetAllPosts {
    posts {
      idPrimary
      title
      description
      author
      time
      likes {
        email
      }
      dislikes {
        email
      }
      tags {
        name
      }
      community
    }
  }
`;

const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    users {
      email
      nickname
      country
      language
      friend {
        email
      }
      friendRequests {
        email
      }
    }
  }
`;

const GET_ALL_COMMUNITIES_QUERY = gql`
  query GetAllCommunities {
    communities {
      name
      description
      members
      tags {
        name
      }
    }
  }
`;

const Search = () => {
  const router = useRouter();
  const { term } = router.query;

  const { loading: loadingPosts, error: errorPosts, data: dataPosts } = useQuery(GET_ALL_POSTS_QUERY);
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(GET_ALL_USERS_QUERY);
  const { loading: loadingCommunities, error: errorCommunities, data: dataCommunities } = useQuery(
    GET_ALL_COMMUNITIES_QUERY
  );

  const [searchOption, setSearchOption] = useState('post');

  if (loadingPosts || loadingUsers || loadingCommunities) {
    return <p>Loading...</p>;
  }

  if (errorPosts || errorUsers || errorCommunities) {
    return (
      <p>
        Error:{' '}
        {errorPosts ? errorPosts.message : errorUsers ? errorUsers.message : errorCommunities.message}
      </p>
    );
  }

  const allPosts = dataPosts.posts;
  const allUsers = dataUsers.users;
  const allCommunities = dataCommunities.communities;

  const searchResultsPosts = term
    ? allPosts.filter(
        (result) =>
          result.title.toLowerCase().includes(term.toLowerCase()) ||
          result.description.toLowerCase().includes(term.toLowerCase()) ||
          result.tags.some((tag) => tag.name.toLowerCase().includes(term.toLowerCase()))
      )
    : allPosts;

  const searchResultsUsers = term
    ? allUsers.filter(
        (user) =>
          user.nickname.toLowerCase().includes(term.toLowerCase())
      )
    : allUsers;

  const searchResultCommunities = term
    ? allCommunities.filter(
      (result) => 
        result.name.toLowerCase().includes(term.toLowerCase())
    )
    : allCommunities;

  const handleSearchOptionChange = (option) => {
    setSearchOption(option);
  };

  const handleCommunityClick = (communityName) => {
    router.push(`/community/${encodeURIComponent(communityName)}`);
  };

  const handleUserClick = (userName) => {
    router.push(`/Profile/${encodeURIComponent(userName)}`);
  };

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
        <div>
          <Button
            variant={searchOption === 'post' ? 'contained' : 'outlined'}
            onClick={() => handleSearchOptionChange('post')}
          >
            Post
          </Button>
          <Button
            variant={searchOption === 'user' ? 'contained' : 'outlined'}
            onClick={() => handleSearchOptionChange('user')}
          >
            User
          </Button>
          <Button
            variant={searchOption === 'community' ? 'contained' : 'outlined'}
            onClick={() => handleSearchOptionChange('community')}
          >
            Community
          </Button>
        </div>

        <Grid container spacing={2}>
          {searchOption === 'post' && (
            <Grid item xs={9} sx={{marginTop: 2}}>
              <div>
                {searchResultsPosts.map((result) => (
                  <PostContainer key={result.idPrimary} post={result} />
                ))}
              </div>
            </Grid>
          )}

          {searchOption === 'user' && (
            <Grid item xs={9}>
              <div>
                <ul>
                  {searchResultsUsers.map((user) => (
                    <Container
                      key={user.email} 
                      maxWidth="xl"
                      sx={{
                        marginBottom: 2,
                        padding: 2,
                        border: '1px solid blue',
                        width: '75%',
                        cursor: 'pointer' 
                      }}
                      onClick={() => handleUserClick(user.nickname)}
                      
                    >
                      <Typography variant="h4" gutterBottom>
                        {user.nickname}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Region: {user.country}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Language: {user.language}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Friends: {user.friend.length}
                      </Typography>
                    </Container>
                  ))}
                </ul>
              </div>
            </Grid>
          )}

          {searchOption === 'community' && (
            <Grid item xs={9}>
              <div>
                <ul>
                  {searchResultCommunities.map((community) => (
                    <Container
                      key={community.name} 
                      maxWidth="xl"
                      sx={{
                        marginBottom: 2,
                        padding: 2,
                        border: '1px solid blue',
                        width: '75%',
                        cursor: 'pointer' 
                      }}
                      onClick={() => handleCommunityClick(community.name)}
                    >
                      <Typography variant="h4" gutterBottom>
                        {community.name}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Description: {community.description}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Members: {community.members.length}
                      </Typography>
                    </Container>
                  ))}
                </ul>
              </div>
            </Grid>
          )}

          <Grid item xs={3}>
            <div>
              <FriendList />
              <CommunityList />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Search;