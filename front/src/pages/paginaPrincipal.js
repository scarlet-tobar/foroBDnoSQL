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
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '', timestamp: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.author) {
      newPost.id = posts.length + 1;
      posts.push(newPost);
      setNewPost({ title: '', content: '', author: '', timestamp: '' });
      setSubmitted(true);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Forum</h1>
      <SearchBar onSearch={handleSearch} />

      <h2>Create New Post</h2>
      <form onSubmit={handlePostSubmit}>
        <label htmlFor="postTitle">Title:</label>
        <input
          type="text"
          id="postTitle"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
        />

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="content"
          value={newPost.content}
          onChange={handleInputChange}
        ></textarea>

        <label htmlFor="postAuthor">Author:</label>
        <input
          type="text"
          id="postAuthor"
          name="author"
          value={newPost.author}
          onChange={handleInputChange}
        />

        <button type="submit">Post</button>
      </form>

      <h2>Posts</h2>
      {submitted && <p>New post submitted!</p>}
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