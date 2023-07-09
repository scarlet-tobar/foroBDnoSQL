import React from 'react';
import SearchBar from '../components/SearchBar';

const paginaPrincipal = () => {
  // Mock forum posts data
  const forumPosts = [
    { id: 1, title: 'Post 1', content: 'Content of Post 1' },
    { id: 2, title: 'Post 2', content: 'Content of Post 2' },
    { id: 3, title: 'Post 3', content: 'Content of Post 3' },
  ];

  return (
    <div>
      <h1>Forum</h1>
      <SearchBar />
      <ul>
        {forumPosts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default paginaPrincipal;