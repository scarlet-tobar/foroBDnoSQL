import React, { useState } from 'react';
  import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
  import { useMutation, gql } from '@apollo/client';
  
  const CREATE_COMMUNITY = gql`
    mutation CreateCommunity(
      $name: String!
      $description: String!
      $createdby: String!
      $tags: [String!]!
    ) {
      createCommunity(
        name: $name
        description: $description
        createdby: $createdby
        tags: $tags
      ) {
        name
        description
        createdby
        members
        tags {
          name
        }
      }
      createCommNeo4j(commInput:{
        name: $name
        description: $description
        author: $createdby
        tag: $tags
      }){
        name
        description
      }
    }
  `;
  
  const CreateCommunity = ({ userEmail }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const [createCommunity] = useMutation(CREATE_COMMUNITY);
  
    const handleCreateCommunity = () => {
      const tagsArray = tags.split(',').map((tag) => tag.trim());
  
      createCommunity({
        variables: {
          name,
          description,
          createdby: userEmail,
          tags: tagsArray,
        },
      });
  
      // Clear the form after creating the community
      setName('');
      setDescription('');
      setTags('');
  
      // Close the popup after creating the community
      setOpen(false);
      window.location.reload();
    };
  
    return (
      <div>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Community
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a New Community</DialogTitle>
          <DialogContent>
            <TextField fullWidth margin="dense" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
            <Button onClick={handleCreateCommunity} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  
  export default CreateCommunity;