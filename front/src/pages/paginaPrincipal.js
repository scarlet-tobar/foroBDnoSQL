import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Modal from 'react-modal';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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

  const handleVote = (postId, voteType) => {
    // Logic to handle voting on a post
  };

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
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <Typography variant="h4" style={{ marginBottom: '20px' }}>Forum</Typography>
        <SearchBar onSearch={handleSearch} />

        <div style={{ marginBottom: '20px' }}>
          <Button variant="contained" onClick={openModal}>
            Create a new post
          </Button>
        </div>

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
          <Typography variant="h6" style={{ marginBottom: '10px' }}>Create New Post</Typography>
          <form onSubmit={handlePostSubmit}>
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />

            <label htmlFor="postDescription">Description:</label>
            <textarea
              id="postDescription"
              name="description"
              value={newPost.description}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            ></textarea>

            <label htmlFor="postTags">Tags (comma-separated):</label>
            <input
              type="text"
              id="postTags"
              name="tags"
              value={newPost.tags}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />

            <label htmlFor="postAuthor">Author:</label>
            <input
              type="text"
              id="postAuthor"
              name="author"
              value={newPost.author}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />

            <Button variant="contained" type="submit">Post</Button>
          </form>
        </Modal>

        <Typography variant="h5" style={{ marginTop: '30px' }}>Posts</Typography>
        {submitted && <p>New post submitted!</p>}
        <ul>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.id_} style={{ marginBottom: '20px' }}>
                <CardContent>
                  <Typography variant="h6" style={{ marginBottom: '10px' }}>{post.title}</Typography>
                  <Typography style={{ marginBottom: '5px' }}>{post.description}</Typography>
                  <Typography style={{ marginBottom: '5px' }}>Author: {post.author}</Typography>
                  <Typography style={{ marginBottom: '5px' }}>Time: {post.time}</Typography>
                  <div>
                    <IconButton onClick={() => handleVote(post.id_, 'upvote')}>
                      <ThumbUpIcon />
                    </IconButton>
                    <Typography>{post.votes}</Typography>
                    <IconButton onClick={() => handleVote(post.id_, 'downvote')}>
                      <ThumbDownIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No posts found matching the search term.</p>
          )}
        </ul>
      </div>
      <div style={{ width: '20%', marginLeft: '20px' }}>
        <Typography variant="h5">Sidebar</Typography>
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