import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Navbar from '@/components/navbar';
import PostContainer from '@/components/PostContainer';
import CommunityList from '@/components/CommunityList';
import { Container, Grid } from '@mui/material';
import FriendList from '@/components/friends';

const GET_ALL_POSTS_QUERY = gql`
  query GetAllPosts {
    posts {
      idPrimary
      title
      description
      author
      time
      likes {
        email
      }
      dislikes {
        email
      }
      tags {
        name
      }
      community
    }
  }
`;

const Search = () => {
  const router = useRouter();
  const { term } = router.query;

  const { loading, error, data } = useQuery(GET_ALL_POSTS_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const searchResults = term
  ? data.posts.filter((result) =>
      result.title.toLowerCase().includes(term.toLowerCase()) ||
      result.description.toLowerCase().includes(term.toLowerCase()) ||
      result.tags.some((tag) => tag.name.toLowerCase().includes(term.toLowerCase()))
    )
  : data.posts;


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
        marginTop: '30px',
      }}
    >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            {/* Renderizar los resultados de búsqueda */}
            <div>
              {searchResults.map((result) => (
                <PostContainer key={result.idPrimary} post={result} />
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={3}>
            {/* Renderizar el componente CommunityList */}
            <div>
                <FriendList/>
              <CommunityList />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Search;
