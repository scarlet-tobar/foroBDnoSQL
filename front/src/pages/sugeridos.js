import Navbar from "@/components/navbar";
import FriendList from "@/components/friends";
import NotificationBell from "@/components/notification";
import SearchBar from "@/components/SearchBar";

const GET_SUGGESTED_USERS_1 = gql`
    query GetFriendsOfFriends($email: String!) {
        userByEmail(email: $email) {
          friend {
            friend {
                nickname
            }
          }
        }
      }
    `;
 const { loading, error, data } = useQuery(GET_SUGGESTED_USERS_1, {
    variables: { email },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const friends = data.userByEmail.friend.friend;

  return (
    <div>
        <Navbar />
        <FriendList />
        <NotificationBell />
        <SearchBar />
    <div>
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
    </div>
  
    </div>
  );
