
import { Inter } from 'next/font/google'
import Header from '@/components/header'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client';

const query = gql`
          query posts{
            posts
            {
              title
              description
              time
            }
          }
      `;

function Posts({ ttl }) {
    const { loading, error, data } = useQuery(query, {
        fetchPolicy: 'cache-first',
        ...(ttl && { context: { ttl } }),
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <ul>
          {data.posts.map((post) => (
            <li key={post.title}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <p>{post.time}</p>
            </li>
          ))}
        </ul>
      );
    }

            export default function Inicio() {
    return (
            <>
                <Header />
                <Posts />
            </>
            )
}