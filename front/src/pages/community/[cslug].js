import React, { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import Modal from 'react-modal';
import { useRouter } from 'next/router';
import path from 'path';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client';
import { createMuiTheme } from '@mui/material';

const GET_COMMUNITY_NAMES = gql`
query communities{
communities {
    name
}}
`;

const GET_COMMUNITY = gql`
query cname($cslug:String!){ 
  community(name:$cslug){
    name
    description
    createdby {
        email
    }
    members{
        nickname
    }
}
}
`;

function CommunityName() {
  const { loading, error, data } = useQuery(GET_COMMUNITY_NAMES);
  return (
    data.community.name
  )

};


function Community({cslug}) {
  const { loading, error, data } = useQuery(GET_COMMUNITY, {variables: {cslug}});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    data
  )
};

export async function getStaticPaths() {
  const paths = CommunityName();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = Community(params.cslug);
  return {
    props: {
      data,
    },
  };
}

export default function Cslug({data}) {    
<div>
  <h1>{data.community.name}</h1>
  <h2>{data.community.description}</h2>
  <h3>Creado por: {data.community.createdby.email}</h3>
  <p>Miembros:</p>
  {data.community.members.nickname.map((nick) => (
    <li>{nick}</li>
  ))}
</div>

}

