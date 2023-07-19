// CreatePostPopup.js

import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useMutation, gql } from '@apollo/client';

const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $description: String!
    $author: String!
    $community: String
    $tags: [TagInput!]!
  ) {
    createPost(
      input: {
        title: $title
        description: $description
        author: $author
        community: $community
        tags: $tags
      }
    ) {
      idPrimary
      title
      description
      author
      time
      likes {
        email
        nickname
      }
      tags {
        name
      }
      community
    }
  }
`;

const CreatePostPopup = ({ userEmail, communityName }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const [createPost] = useMutation(CREATE_POST);

  const handleCreatePost = () => {
    const tagsArray = tags.split(',').map((tag) => ({ name: tag.trim() }));

    createPost({
      variables: {
        title,
        description,
        author: userEmail,
        community: communityName ? communityName : null,
        tags: tagsArray,
      },
    });

    // Clear the form after adding the post
    setTitle('');
    setDescription('');
    setTags('');

    // Close the popup after adding the post
    setOpen(false);
    window.location.reload();
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create Post
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Post</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreatePostPopup;
