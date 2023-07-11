import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Modal from 'react-modal';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updatedPosts, setUpdatedPosts] = useState({ title: '', content: '', author: '', timestamp: '' , likes: ''});

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

  const getCurrentTimestamp = () => {
    const currentTimestamp = new Date().toISOString();
    return currentTimestamp;
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.author) {
      newPost.id = posts.length + 1;
      newPost.timestamp = getCurrentTimestamp();
      posts.push(newPost);
      setNewPost({ title: '', content: '', author: '', timestamp: '' , likes: 0});
      setSubmitted(true);
      closeModal();
    }
  };

  const handleLike = (postId) => {
    // Find the post with the given ID
    const post = posts.find((post) => post.id === postId);
    if (post) {
      // Update the like count of the post
      post.likes = post.likes + 1 || 1;
      // Force a re-render by updating the state of posts
      setUpdatedPosts([...posts]);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Forum</h1>
        <SearchBar onSearch={handleSearch} />

        <button onClick={openModal} style={{ marginBottom: '20px' }}>
          Create a new post
        </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create New Post"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              width: '300px',
              height: '300px',
              margin: 'auto',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '20px'
            }
          }}
        >
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
        </Modal>

        <h2 style={{ fontSize: '20px', marginTop: '30px' }}>Posts</h2>
        {submitted && <p>New post submitted!</p>}
        <ul>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{post.title}</h3>
                <p style={{ marginBottom: '5px' }}>{post.content}</p>
                <p style={{ marginBottom: '5px' }}>Author: {post.author}</p>
                <p style={{ marginBottom: '5px' }}>Timestamp: {post.timestamp}</p>
                <button onClick={() => handleLike(post.id)}>Like ({post.likes || 0})</button>
              </div>
            ))
          ) : (
            <p>No posts found matching the search term.</p>
          )}
        </ul>
      </div>
      <div style={{ width: '20%', marginLeft: '20px' }}>
      <h2>Sidebar</h2>
        <ul>
          <li>
            <a href="/home">Friends</a>
          </li>
          <li>
            <a href="/about">Communities</a>
          </li>
          <li>SignOut</li>
        </ul>
      </div>
    </div>
    
  );
};

export default paginaPrincipal;