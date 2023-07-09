import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';

const posts = [
  {
    id: 1,
    title: 'Welcome to the Forum',
    content: 'Hello everyone, welcome to our forum! Feel free to introduce yourself and start engaging in discussions.',
    author: 'JohnDoe',
    timestamp: '2023-07-04T10:30:00Z'
  },
  {
    id: 2,
    title: 'Tips for Productivity',
    content: 'Do you have any tips or strategies for improving productivity? Share your insights and help others be more productive.',
    author: 'JaneSmith',
    timestamp: '2023-07-05T14:45:00Z'
  },
  // Add more posts as needed
];

const paginaPrincipal = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>
      <h1>Forum</h1>
      <SearchBar onSearch={handleSearch} />
      <ul>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Author: {post.author}</p>
              <p>Timestamp: {post.timestamp}</p>
            </li>
          ))
        ) : (
          <p>No posts found matching the search term.</p>
        )}
      </ul>
    </div>
  );
};

export default paginaPrincipal;