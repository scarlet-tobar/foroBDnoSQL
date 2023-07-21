import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import Navbar from '@/components/navbar';
import PostContainer from '@/components/PostContainer';
import CommunityList from '@/components/CommunityList';
import FriendList from '@/components/friends';
import CreatePostPopup from '@/components/CreatePostPopup';
import CreateCommunity from '@/components/CreateCommunityPopup';

const GET_COMMUNITIES_BY_USER_EMAIL = gql`
  query GetCommunitiesByUserEmail($email: String!) {
    communitiesByUserEmail(email: $email) {
      name
      description
      createdby
      members
      tags {
        name
      }
    }
  }
`;

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      idPrimary
      title
      description
      community
      author
      time
      likes {
        email
      }
      dislikes {
        email
      }
    }
  }
`;

const IndexPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [communities, setCommunities] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual
  const postsPerPage = 5; // Mostraremos 5 posts por página

  useEffect(() => {
    // Obtener el email del usuario logeado desde el localStorage
    const email = localStorage.getItem('email');
    if (!email) {
      window.location.href = '/login';
    }
    setUserEmail(email);
  }, []);

  const { loading: communityLoading, error: communityError, data: communityData } = useQuery(GET_COMMUNITIES_BY_USER_EMAIL, {
    variables: { email: userEmail },
  });

  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_ALL_POSTS);

  useEffect(() => {
    if (!communityLoading && communityData) {
      setCommunities(communityData.communitiesByUserEmail);
    }
  }, [communityLoading, communityData]);

  useEffect(() => {
    if (!postsLoading && postsData) {
      const allPosts = postsData.posts;
      // Create a new copy of the array and sort by the "time" field in descending order
      const sortedPosts = Array.from(allPosts).sort((a, b) => b.time.localeCompare(a.time));
      setSortedPosts(sortedPosts);
    }
  }, [postsLoading, postsData]);

  if (communityLoading || postsLoading) return <p>Loading...</p>;
  if (communityError || postsError) return <p>Error: {communityError?.message || postsError?.message}</p>;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calcular la cantidad total de páginas
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Lógica para mostrar solo dos botones de página
  const showPrevButton = currentPage > 1;
  const showNextButton = currentPage < totalPages;

  // Lógica para obtener los posts de la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

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
            {currentPosts.map((post) => (
              <PostContainer key={post.idPrimary} post={post} />
            ))}
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                {showPrevButton && (
                  <Button variant="contained" onClick={handlePrevPage}>Anterior</Button>
                )}
              </Grid>
              <Grid item>
                {showNextButton && (
                  <Button variant="contained" onClick={handleNextPage}>Siguiente</Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item>
                <CreatePostPopup userEmail={userEmail} />
              </Grid>
              <Grid item>
                <CreateCommunity userEmail={userEmail} />
              </Grid>
            </Grid>
            <FriendList />
            <CommunityList communities={communities} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default IndexPage;
