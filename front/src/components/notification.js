import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Popover, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const GET_FRIEND_REQUESTS = gql`
  query GetFriendRequests($email: String!) {
    userByEmail(email: $email) {
      friendRequests {
        email
        nickname
      }
    }
  }
`;

const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($receiverEmail: String!, $senderEmail: String!) {
    acceptFriendRequest(receiverEmail: $receiverEmail, senderEmail: $senderEmail) {
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

const DECLINE_FRIEND_REQUEST = gql`
  mutation DeclineFriendRequest($receiverEmail: String!, $senderEmail: String!) {
    declineFriendRequest(receiverEmail: $receiverEmail, senderEmail: $senderEmail) {
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

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  const [getFriendRequests, { data, error }] = useLazyQuery(GET_FRIEND_REQUESTS);
  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST);
  const [declineFriendRequest] = useMutation(DECLINE_FRIEND_REQUEST);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      getFriendRequests({ variables: { email } });
    }
  }, [getFriendRequests]);

  useEffect(() => {
    if (data) {
      const friendRequestsData = data?.userByEmail?.friendRequests || [];
      setFriendRequests(friendRequestsData);
    }
  }, [data]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleAcceptRequest = async (senderEmail) => {
    const receiverEmail = localStorage.getItem('email');
    await acceptFriendRequest({ variables: { receiverEmail, senderEmail } });
    handleClosePopover();
    window.location.reload(); // Recargar la página después de aceptar la solicitud
  };

  const handleDeclineRequest = async (senderEmail) => {
    const receiverEmail = localStorage.getItem('email');
    await declineFriendRequest({ variables: { receiverEmail, senderEmail } });
    handleClosePopover();
    window.location.reload(); // Recargar la página después de rechazar la solicitud
  };

  if (error) {
    console.error('Error:', error);
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleNotificationClick}>
        <Badge badgeContent={friendRequests.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="flex-start" p={2}>
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request.email} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1">
                  {request.nickname} quiere añadirte como amigo.
                </Typography>
                <IconButton onClick={() => handleAcceptRequest(request.email)}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={() => handleDeclineRequest(request.email)}>
                  <CloseIcon />
                </IconButton>
              </div>
            ))
          ) : (
            <Typography variant="body2">No tienes nuevas notificaciones.</Typography>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;
