import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery, useMutation } from '@apollo/client';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Navbar from '@/components/navbar';

const IndexPage = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Obtener el email del usuario logeado desde el localStorage
    const email = localStorage.getItem('email');
    setUserEmail(email);
  }, []);

  const GET_COMMUNITIES_BY_USER_EMAIL = gql`
    query GetCommunitiesByUserEmail($email: String!) {
      communitiesByUserEmail(email: $email) {
        name
        description
        createdby
        members {
          email
          nickname
        }
        tags {
          name
        }
      }
    }
  `;

  const { loading: communityLoading, error: communityError, data: communityData } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  const GET_POSTS_BY_COMMUNITY = gql`
    query GetPostsByCommunity($communityName: String!) {
      postsByCommunity(communityName: $communityName) {
        idPrimary
        title
        description
        community
        author
        time
        likes {
          email
        }
        dislikes{
          email
        }
      }
    }
  `;

  const { loading: generalPostsLoading, error: generalPostsError, data: generalPostsData } = useQuery(GET_POSTS_BY_COMMUNITY, {
    variables: { communityName: 'General' },
  });

  if (communityLoading || generalPostsLoading) return <p>Loading...</p>;
  if (communityError) return <p>Error: {communityError.message}</p>;
  if (generalPostsError) return <p>Error: {generalPostsError.message}</p>;

  const communities = communityData.communitiesByUserEmail;
  const generalPosts = generalPostsData.postsByCommunity;

  return (
    <div>
      <Navbar/>
      <Container
        maxWidth="xl"
        sx={{
          paddingLeft: '16px',
          paddingRight: '16px',
          marginLeft: 0,
          marginRight: 'auto',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '30px' }}>
          Posts by Communities
        </Typography>

        {communities.map((community) => (
          <div key={community.name}>
            <QueryPostsByCommunity communityName={community.name} />
          </div>
        ))}

        <div>
          <PostsByCommunity posts={generalPosts} />
        </div>
      </Container>
    </div>
  );
};

const QueryPostsByCommunity = ({ communityName }) => {
  const GET_POSTS_BY_COMMUNITY = gql`
    query GetPostsByCommunity($communityName: String!) {
      postsByCommunity(communityName: $communityName) {
        idPrimary
        title
        description
        community
        author
        time
        likes {
          email
        }
        dislikes{
          email
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_POSTS_BY_COMMUNITY, {
    variables: { communityName },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data.postsByCommunity.map((post) => (
        <PostContainer key={post.title} post={post} />
      ))}
    </>
  );
};

const PostsByCommunity = ({ posts }) => {
  return (
    <>
      {posts.map((post) => (
        <PostContainer key={post.title} post={post} />
      ))}
    </>
  );
};

const PostContainer = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes.length);

  const ADD_LIKE_TO_POST = gql`
    mutation AddLikeToPost($postId: String!, $userEmail: String!) {
      addLikeToPost(postId: $postId, userEmail: $userEmail) {
        idPrimary
        title
        description
        author
        likes{
          email
        }
        dislikes{
          email
        }
      }
    }
  `;

  const ADD_DISLIKE_TO_POST = gql`
    mutation AddDislikeToPost($postId: String!, $userEmail: String!) {
      addDislikeToPost(postId: $postId, userEmail: $userEmail) {
        idPrimary
        title
        description
        author
        likes{
          email
        }
        dislikes{
          email
        }
      }
    }
  `;

  const [addLikeToPost, { loading: likeLoading, error: likeError }] = useMutation(ADD_LIKE_TO_POST);
  const [addDislikeToPost, { loading: dislikeLoading, error: dislikeError }] = useMutation(ADD_DISLIKE_TO_POST);

  const handleLikeClick = () => {
    addLikeToPost({ variables: { postId: post.idPrimary, userEmail: localStorage.getItem('email') } })
      .then((response) => {
        console.log('Like added:', response);
        const updatedPost = response.data.addLikeToPost;
        setLikesCount(updatedPost.likes.length);
        setDislikesCount(updatedPost.dislikes.length);
      })
      .catch((error) => {
        console.error('Error adding like:', error);
      });
  };

  const handleDislikeClick = () => {
    addDislikeToPost({ variables: { postId: post.idPrimary, userEmail: localStorage.getItem('email') } })
      .then((response) => {
        console.log('Dislike added:', response);
        const updatedPost = response.data.addDislikeToPost;
        setLikesCount(updatedPost.likes.length);
        setDislikesCount(updatedPost.dislikes.length);
      })
      .catch((error) => {
        console.error('Error adding dislike:', error);
      });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        marginBottom: 2,
        border: '1px solid #ccc',
        padding: 2,
        width: '75%',
      }}
    >
      <Typography variant="body1">Community: {post.community}</Typography>
      <Typography variant="h6">{post.title}</Typography>
      <Typography variant="body1">{post.description}</Typography>
      <Typography variant="body2">Author: {post.author}</Typography>
      <Typography variant="body2">Time: {post.time}</Typography>
      <Button variant="contained" color="primary" onClick={handleLikeClick} sx={{ marginRight: 2 , marginTop: 2}}>
        <ThumbUpIcon/>
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </Button>
      <Button variant="contained" color="primary" onClick={handleDislikeClick} sx={{ marginLeft: 2, marginTop: 2}}>
        <ThumbDownIcon/>
        {dislikesCount} {dislikesCount === 1 ? 'Dislike' : 'Dislikes'}
      </Button>
    </Container>
  );
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Cambia esto si tu servidor GraphQL se encuentra en otro lugar
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <IndexPage />
  </ApolloProvider>
);

export default App;
