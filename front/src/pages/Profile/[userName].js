import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import { Typography, Button, Grid, Container } from "@mui/material";
import QueryPostsByUser from '../../components/QueryPostsByUser';
import FriendList from "../../components/friends";
import CommunityList from "../../components/CommunityList";

const GET_USER_EMAIL = gql`
  query GetUserByEmail($nickname: String!) {
    userByNickname(nickname: $nickname) {
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

const ADD_FRIEND_MUTATION = gql`
  mutation SendFriendRequest($senderEmail: String!, $receiverEmail: String!) {
    sendFriendRequest(senderEmail: $senderEmail, receiverEmail: $receiverEmail) {
      nickname
      friendRequests {
        nickname
      }
    }
  }
`;

const DECLINE_FRIEND_REQUEST_MUTATION = gql`
  mutation DeclineFriendRequest($senderEmail: String!, $receiverEmail: String!) {
    declineFriendRequest(senderEmail: $senderEmail, receiverEmail: $receiverEmail) {
      nickname
      friendRequests {
        nickname
      }
      friend {
        nickname
      }
    }
  }
`;

const DELETE_FRIEND_MUTATION = gql`
  mutation DeleteFriend($userEmail: String!, $friendEmail: String!) {
    deleteFriend(userEmail: $userEmail, friendEmail: $friendEmail)
    removeFriendNeo4j(emailUser1: $userEmail, emailUser2: $friendEmail)
  }
`;

const Profile = () => {
  const router = useRouter();
  const { userName } = router.query;

  const { loading, error, data } = useQuery(GET_USER_EMAIL, {
    variables: { nickname: userName },
  });

  const [sendFriendRequest, { loading: sendLoading, error: sendError }] = useMutation(ADD_FRIEND_MUTATION);
  const [declineFriendRequest, { loading: declineLoading, error: declineError }] = useMutation(DECLINE_FRIEND_REQUEST_MUTATION);
  const [deleteFriend, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_FRIEND_MUTATION);

  const [sentFriendRequest, setSentFriendRequest] = React.useState(false);
  const [friendRequestExists, setFriendRequestExists] = React.useState(false);
  const [friendRequestDeclined, setFriendRequestDeclined] = React.useState(false);

  React.useEffect(() => {
    if (data && data.userByNickname && data.userByNickname.friendRequests) {
      const currentUserEmail = localStorage.getItem("email");
      const friendRequestExists = data.userByNickname.friendRequests.some((friend) => friend.email === currentUserEmail);
      setFriendRequestExists(friendRequestExists);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { userByNickname } = data;
  const userEmail = userByNickname.email;
  const currentUserEmail = localStorage.getItem("email");

  const isFriend = userByNickname.friend.some((friend) => friend.email === currentUserEmail);

  const handleAddFriend = () => {
    sendFriendRequest({
      variables: { senderEmail: currentUserEmail, receiverEmail: userEmail },
    });
    setSentFriendRequest(true);
    window.location.reload();
  };

  const handleDeclineFriendRequest = () => {
    declineFriendRequest({
      variables: { senderEmail: currentUserEmail, receiverEmail: userEmail },
    });
    setFriendRequestDeclined(true);
    window.location.reload();
  };

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend({
        variables: {
          userEmail: currentUserEmail,
          friendEmail: userEmail,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al borrar amigo:', error);
      // Agregar lógica para manejar el error si es necesario
    }
  };

  return (
    <div>
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          paddingLeft: "16px",
          paddingRight: "16px",
          marginLeft: 0,
          marginRight: "auto",
          marginTop: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Container
              maxWidth="xl"
              sx={{
                marginBottom: 2,
                padding: 2,
                border: "1px solid blue",
                width: "75%",
              }}
            >
              <Typography variant="h4" gutterBottom>
                {userByNickname.nickname}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: {userByNickname.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Region: {userByNickname.country}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Language: {userByNickname.language}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Friends: {userByNickname.friend.length}
              </Typography>

              {!isFriend && !friendRequestExists && userByNickname.email != localStorage.getItem("email") && (
                <Button variant="contained" color="primary" onClick={handleAddFriend}>
                  Agregar amigo
                </Button>
              )}

              {friendRequestExists && userByNickname.email != localStorage.getItem("email") && (
                <Button variant="contained" color="secondary" onClick={handleDeclineFriendRequest}>
                  Solicitud de amistad enviada
                </Button>
              )}
              {isFriend && userByNickname.email != localStorage.getItem("email") && (
                <Button variant="contained" color="primary" onClick={handleDeleteFriend}>
                  Borrar Amigo
                </Button>
              )}
            </Container>
            {isFriend && (<QueryPostsByUser userEmail={userEmail} />)}
            {userByNickname.email == localStorage.getItem("email") && (<QueryPostsByUser userEmail={userEmail} />)}
          </Grid>
          <Grid item xs={3}>
            <FriendList />
            <CommunityList />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
