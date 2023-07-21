import Navbar from "@/components/navbar";
import FriendList from "@/components/friends";
import { Typography, Box, Paper, Grid , Container, ListItem, ListItemText} from '@mui/material';
import { gql, useQuery } from "@apollo/client";
import { React, useEffect, useState } from "react";
import  { useRouter } from "next/router";
import CommunityList from "@/components/CommunityList";


const Sugeridos = () => {
  const router= useRouter();
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    const email = localStorage.getItem('email');
    setUserEmail(email);
  }, []);

  const GET_SUGGESTED_USERS_1 = gql`
    query getFriends($email: String!){
      getCommFriendNeo4j(email: $email){
          name
        }
      getFriendsNeo4j(email: $email){
          nickname
          email
      }
    }`;


  const { loading, error, data } = useQuery(GET_SUGGESTED_USERS_1, {
    variables: { email: userEmail },
  });



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const comm = data.getCommFriendNeo4j;
  const user = data.getFriendsNeo4j;

  const handleCommunityClick = (communityName) => {
    router.push(`/community/${encodeURIComponent(communityName)}`);
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
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <div>

            </div>
            <Typography variant="h6" gutterBottom>
              Communities for you
            </Typography>
            <Box display="flex" flexDirection="column">
              {comm.map((community) => (
                <Paper key={community.name} onClick={() => handleCommunityClick(community.name)} elevation={2} sx={{ mb: 2, border: '1px solid blue' }}>
                  <ListItem>
                    <ListItemText primary={community.name}/>
                  </ListItem>
                </Paper>
                
              ))}
            </Box>
            <Typography variant="h6" gutterBottom>
              Users for you
            </Typography>
            <Box display="flex" flexDirection="column">
              {user.map((users) => (
                <Paper key={users.nickname} onClick={() => handleCommunityClick(users.nickname)} elevation={2} sx={{ mb: 2, border: '1px solid blue' }}>
                  <ListItem>
                    <ListItemText primary={users.nickname}/>
                  </ListItem>
                </Paper>
                
              ))}
            </Box>
          </Grid>
          <Grid item xs={3}>
            <FriendList />
            <CommunityList/>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
};
export default Sugeridos;