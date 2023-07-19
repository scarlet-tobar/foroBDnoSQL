import React from 'react';
import { Typography, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

const FriendList = () => {
    const email = localStorage.getItem("email");
  
    const GET_FRIENDS = gql`
      query GetFriends($email: String!) {
        userByEmail(email: $email) {
          friend {
            nickname
          }
        }
      }
    `;
  
    const { loading, error, data } = useQuery(GET_FRIENDS, {
      variables: { email },
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const friends = data.userByEmail.friend;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Friends
      </Typography>
      <Box display="flex" flexDirection="column">
        {friends.map((friend) => (
          <Paper key={friend.nickname} elevation={2} sx={{ mb: 2, border: '1px solid blue' }}>
            <ListItem>
              <ListItemText primary={friend.nickname} />
            </ListItem>
          </Paper>
        ))}
      </Box>
    </div>
  );
};

export default FriendList;
