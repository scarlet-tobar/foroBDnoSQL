// QueryPostsByUser.js
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import PostContainer from '@/components/PostContainer';

const QueryPostsByUser = ({ userEmail }) => {
  const GET_POSTS_BY_USER = gql`
    query GetPostsByUser($userEmail: String!) {
      postsByAuthor(authorEmail: $userEmail) {
        idPrimary
        title
        description
        author
        time
        community
        likes {
          email
        }
        dislikes {
          email
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_POSTS_BY_USER, {
    variables: { userEmail },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data.postsByAuthor.map((post) => (
        <PostContainer key={post.title} post={post} />
      ))}
    </>
  );
};

export default QueryPostsByUser;
