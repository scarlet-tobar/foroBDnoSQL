import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Typography, Button, Grid, Container } from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import FriendList from "@/components/friends";
import CommunityList from "@/components/CommunityList";
import QueryPostsByCommunity from "@/components/QueryPostsByCommunity";

const GET_COMMUNITY = gql`
  query GetCommunity($name: String!) {
    community(name: $name) {
      name
      description
      createdby
      members
      tags {
        name
      }
    }
  }
`;

const ADD_MEMBER_TO_COMMUNITY = gql`
  mutation AddMemberToCommunity($name: String!, $memberEmail: String!) {
    addMemberToCommunity(name: $name, memberEmail: $memberEmail) {
      name
      description
      createdby
      members
      tags {
        name
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $description: String!
    $author: String!
    $community: String!
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

const Community = () => {
  const router = useRouter();
  const { communityName } = router.query;

  const { loading, error, data } = useQuery(GET_COMMUNITY, {
    variables: { name: communityName },
  });

  const [addMemberToCommunity] = useMutation(ADD_MEMBER_TO_COMMUNITY);

  const handleJoinCommunity = () => {
    const userEmail = localStorage.getItem("email");
    addMemberToCommunity({
      variables: { name: community.name, memberEmail: userEmail },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: GET_COMMUNITY,
          variables: { name: communityName },
          data: { community: data.addMemberToCommunity },
        });
      },
    });
  };

  // State to manage the popup visibility
  const [showPopup, setShowPopup] = useState(false);

  // State variables to hold post information
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostTags, setNewPostTags] = useState("");

  // Function to open the popup
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Input change handlers for the popup
  const handleTitleChange = (event) => {
    setNewPostTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setNewPostDescription(event.target.value);
  };

  const handleTagsChange = (event) => {
    setNewPostTags(event.target.value);
  };

  // Mutation function to add a new post
  const [createPost] = useMutation(CREATE_POST);

  const handleCreatePost = () => {
    const tagsArray = newPostTags.split(",").map((tag) => ({ name: tag.trim() }));

    createPost({
      variables: {
        title: newPostTitle,
        description: newPostDescription,
        author: localStorage.getItem("email"),
        community: community.name,
        tags: tagsArray,
      },
    });

    // Close the popup after adding the post
    setShowPopup(false);
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { community } = data;

  return (
    <div>
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          paddingLeft: "16px",
          paddingRight: "16px",
          marginLeft: 0,
          marginRight: "auto",
          marginTop: "30px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Container
              maxWidth="xl"
              sx={{
                marginBottom: 2,
                padding: 2,
                border: "1px solid blue",
                width: "75%",
              }}
            >
              <Typography variant="h4" gutterBottom>
                {community.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {community.description}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Created by: {community.createdby}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Members: {community.members.length}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Tags: {community.tags.map((tag) => tag.name).join(", ")}
              </Typography>
              {!community.members.includes(localStorage.getItem("email")) && (
                <Button variant="contained" onClick={handleJoinCommunity}>
                  Unirse
                </Button>
              )}
              {community.members.includes(localStorage.getItem("email")) && (
                <Button variant="contained" onClick={handleOpenPopup}>
                  Añadir Nuevo Post
                </Button>
              )}
            </Container>
            {community.members.includes(localStorage.getItem("email")) && (
              <QueryPostsByCommunity communityName={community.name} />
            )}
          </Grid>
          <Grid item xs={3}>
            <FriendList />
            <CommunityList />
          </Grid>
        </Grid>
      </Container>

      {/* Popup */}
      {showPopup && (
        <div>
          <div
            onClick={handleClosePopup}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.7)",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              zIndex: 9999,
            }}
          >
            <Typography variant="h6">Añadir Nuevo Post</Typography>
            <input
              type="text"
              value={newPostTitle}
              onChange={handleTitleChange}
              placeholder="Título del post"
            />
            <textarea
              value={newPostDescription}
              onChange={handleDescriptionChange}
              placeholder="Descripción del post"
            />
            <input
              type="text"
              value={newPostTags}
              onChange={handleTagsChange}
              placeholder="Etiquetas (separadas por comas)"
            />
            <Button variant="contained" onClick={handleCreatePost}>
              Crear Post
            </Button>
            <Button variant="contained" onClick={handleClosePopup}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
