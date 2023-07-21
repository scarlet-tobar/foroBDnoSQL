import React from 'react';
import { gql, useQuery } from '@apollo/client';
import PostContainer from './PostContainer';

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
        dislikes {
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

export default QueryPostsByCommunity;
