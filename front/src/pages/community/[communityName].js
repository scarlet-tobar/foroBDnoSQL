// Community.js

import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Typography, Button, Grid, Container } from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import FriendList from "@/components/friends";
import CommunityList from "@/components/CommunityList";
import QueryPostsByCommunity from "@/components/QueryPostsByCommunity";
import CreatePostPopup from "@/components/CreatePostPopup"; // Import the CreatePostPopup component

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
    addMemberNeo4j(email: $memberEmail, comm: $name)
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
      variables: { name: communityName, memberEmail: userEmail },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: GET_COMMUNITY,
          variables: { name: communityName },
          data: { community: data.addMemberToCommunity },
        });
      },
    });
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
              {!community.members.includes(localStorage.getItem("email")) && communityName != "General" &&(
                <Button variant="contained" onClick={handleJoinCommunity}>
                  Unirse
                </Button>
              )}
              {community.members.includes(localStorage.getItem("email")) && (
                // Use the CreatePostPopup component here for adding a new post
                <CreatePostPopup userEmail={localStorage.getItem("email")} communityName={community.name} />
              )}
            </Container>
            {community.members.includes(localStorage.getItem("email")) && (
              <QueryPostsByCommunity communityName={community.name} />
            )}
            {communityName == "General" && !community.members.includes(localStorage.getItem("email")) && (<QueryPostsByCommunity communityName={community.name} />)}
          </Grid>
          <Grid item xs={3}>
            <FriendList />
            <CommunityList />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Community;
