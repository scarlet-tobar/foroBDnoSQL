import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';

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
        likes {
          email
        }
        dislikes {
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
        likes {
          email
        }
        dislikes {
          email
        }
      }
    }
  `;

  const DELETE_POST = gql`
    mutation DeletePost($idPrimary: String!) {
      deletePost(idPrimary: $idPrimary)
    }
  `;

  const USER_BY_EMAIL = gql`
    query UserByEmail($email: String!) {
      userByEmail(email: $email) {
        nickname
      }
    }
  `;

  const [addLikeToPost, { loading: likeLoading, error: likeError }] = useMutation(ADD_LIKE_TO_POST);
  const [addDislikeToPost, { loading: dislikeLoading, error: dislikeError }] = useMutation(ADD_DISLIKE_TO_POST);
  const [deletePost, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_POST);
  const { data: userData, loading: userLoading, error: userError } = useQuery(USER_BY_EMAIL, {
    variables: { email: post.author },
  });

  const handleLikeClick = () => {
    const userEmail = localStorage.getItem('email');

    addLikeToPost({ variables: { postId: post.idPrimary, userEmail } })
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
    const userEmail = localStorage.getItem('email');

    addDislikeToPost({ variables: { postId: post.idPrimary, userEmail } })
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

  const handleDeleteClick = async () => {
    const userEmail = localStorage.getItem('email');

    if (userEmail === post.author) {
      try {
        const response = await deletePost({ variables: { idPrimary: post.idPrimary } });
        console.log('Post deleted:', response);
        window.location.reload();

        // Aquí puedes realizar alguna acción adicional después de borrar el post, si es necesario.
        // Por ejemplo, puedes recargar la lista de posts o mostrar un mensaje de éxito.

      } catch (error) {
        console.error('Error deleting post:', error);
      }
    } else {
      console.log('No tienes permiso para borrar este post.');
      // Aquí puedes mostrar un mensaje o notificación indicando que el usuario no tiene permiso para borrar el post.
    }
  };

  // Obtén el correo electrónico del usuario logueado desde localStorage
  const userEmail = localStorage.getItem('email');

  // Función para verificar si el usuario logueado es el autor del post
  const isCurrentUserAuthor = userEmail === post.author;

  if (userLoading) {
    return <p>Loading...</p>;
  }

  if (userError) {
    console.error('Error fetching user data:', userError);
    return <p>Error fetching user data</p>;
  }

  const userNickname = userData?.userByEmail?.nickname;

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
      <Typography variant="body2">Author: {userNickname}</Typography>
      <Typography variant="body2">Time: {post.time}</Typography>
      <Button variant="contained" color="primary" onClick={handleLikeClick} sx={{ marginRight: 2, marginTop: 2 }}>
        <ThumbUpIcon />
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </Button>
      <Button variant="contained" color="primary" onClick={handleDislikeClick} sx={{ marginLeft: 2, marginTop: 2, marginRight: 2 }}>
        <ThumbDownIcon />
        {dislikesCount} {dislikesCount === 1 ? 'Dislike' : 'Dislikes'}
      </Button>

      {/* Mostrar el botón de borrado solo si el usuario logueado es el autor del post */}
      {isCurrentUserAuthor && (
        <Button variant="contained" color="secondary" onClick={handleDeleteClick} sx={{ marginLeft: 2, marginTop: 2 }}>
          <DeleteIcon />
          Delete Post
        </Button>
      )}
    </Container>
  );
};

export default PostContainer;
