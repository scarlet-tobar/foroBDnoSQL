import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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

export default PostContainer;
