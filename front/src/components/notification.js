import React, { useEffect, useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { gql, useLazyQuery } from '@apollo/client';

const GET_FRIEND_REQUESTS = gql`
  query GetFriendRequests($email: String!) {
    userByEmail(email: $email) {
      friendRequests {
        email
      }
    }
  }
`;

const NotificationBell = () => {
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  const [getFriendRequests, { data, error }] = useLazyQuery(GET_FRIEND_REQUESTS);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      getFriendRequests({ variables: { email } });
    }
  }, [getFriendRequests]);

  useEffect(() => {
    if (data) {
      const friendRequests = data?.userByEmail?.friendRequests || [];
      setFriendRequestsCount(friendRequests.length);
    }
  }, [data]);

  if (error) {
    console.error('Error:', error);
  }

  return (
    <IconButton color="inherit">
      <Badge badgeContent={friendRequestsCount} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationBell;
