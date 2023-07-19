import Navbar from "@/components/navbar";
import FriendList from "@/components/friends";
import { Typography, Box, Paper, Grid , Container} from '@mui/material';
import { gql, useQuery } from "@apollo/client";
import { React, useEffect, useState } from "react";
import CreatePostPopup from '@/components/CreatePostPopup';
import CommunityList from "@/components/CommunityList";



const Sugeridos = () => {

  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    const email = localStorage.getItem('email');
    setUserEmail(email);
  }, []);

  const GET_SUGGESTED_USERS_1 = gql`
    query getFriends($email: String!){
      getFriendsNeo4j(email: $email){
          nickname
        }
    }`;

  const { loading, error, data } = useQuery(GET_SUGGESTED_USERS_1, {
    variables: { email: userEmail },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const friends = data.getFriendsNeo4j;

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
            <Typography variant="h6" gutterBottom>
              Friends of Friends
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
          </Grid>
          <Grid item xs={3}>
            <CreatePostPopup userEmail={userEmail} />
            <FriendList />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
};
export default Sugeridos;