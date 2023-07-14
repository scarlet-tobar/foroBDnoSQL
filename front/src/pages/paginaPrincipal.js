import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Modal from 'react-modal';

import { gql } from "@apollo/client";
import { useQuery , useMutation} from '@apollo/client';

const GET_POSTS = gql`
    query posts{
      posts
      {
        title
        description
        time
      }
    }
`;

const ADD_POST = gql`
  mutation CreatePost($title: String!, $description: String!, $tags: [TagInput!]!) {
    createPost(input: {
      title: $title
      description: $description
      tags: $tags
    }) {
      title
      description
      tags { name }
    }
  }
`;

const paginaPrincipal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState({ title: '', description: '', tags: '', author: '' });
  const [submitted, setSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updatedPosts, setUpdatedPosts] = useState({ title: '', description: '', author: '', time: '' });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const { loading, error, data } = useQuery(GET_POSTS);
  const [addPost, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });



  if (loading || mutationLoading) {
    return <p>Loading...</p>;
  }

  if (error || mutationError) {
    return <p>Error: {error ? error.message : mutationError.message}</p>;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handlePostSubmit = (event) => {
    event.preventDefault();
  
    const tagsArray = newPost.tags.split(',').map((tag) => tag.trim());
    const tags = tagsArray.map((tagName) => ({ name: tagName }));
    console.log(newPost.title);
    console.log(newPost.description);
    console.log(tags);
    addPost({
      variables: {
        title: newPost.title,
        description: newPost.description,
        tags: tags
      },
    });
  
    // Clear input fields after submission
    setNewPost({ title: '', description: '', tags: '', author: '' });
  };


  const filteredPosts = data.posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
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

            <label htmlFor="postDescription">Description:</label>
            <textarea
              id="postDescription"
              name="description"
              value={newPost.description}
              onChange={handleInputChange}
            ></textarea>

            <label htmlFor="postTags">Tags (comma-separated):</label>
            <input
              type="text"
              id="postTags"
              name="tags"
              value={newPost.tags}
              onChange={handleInputChange}
            />

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
              <div key={post.id_} style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{post.title}</h3>
                <p style={{ marginBottom: '5px' }}>{post.description}</p>
                <p style={{ marginBottom: '5px' }}>Author: {post.author}</p>
                <p style={{ marginBottom: '5px' }}>Time: {post.time}</p>
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