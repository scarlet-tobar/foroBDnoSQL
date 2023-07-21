import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_COMMUNITIES_BY_USER_EMAIL = gql`
  query GetCommunitiesByUserEmail($email: String!) {
    communitiesByUserEmail(email: $email) {
      name
      description
    }
  }
`;

const CommunityList = () => {
  const router = useRouter();
  const userEmail = localStorage.getItem("email");
  const { loading, error, data } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const communities = data.communitiesByUserEmail;

  const handleCommunityClick = (communityName) => {
    router.push(`/community/${encodeURIComponent(communityName)}`);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Communities
      </Typography>
      <Box display="flex" flexDirection="column">
        {communities.map((community) => (
          <Paper
            key={community.name}
            elevation={2}
            sx={{ mb: 2, border: '1px solid blue', cursor: 'pointer' }}
            onClick={() => handleCommunityClick(community.name)}
          >
            <ListItem>
              <ListItemText primary={community.name} secondary={community.description} />
            </ListItem>
          </Paper>
        ))}
      </Box>
    </div>
  );
};

export default CommunityList;
