import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const [searchCommunities, { loading }] = useLazyQuery(SEARCH_COMMUNITIES, {
    onCompleted: (data) => {
      setSearchResults(data.communities);
    },
  });

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      searchCommunities({ variables: { name: searchTerm } });
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?term=${searchTerm}`);
  };

  const handleItemClick = (communityName) => {
    setSearchTerm(communityName);
    setShowResults(false);
  };

  const handleOutsideClick = () => {
    setShowResults(false);
  };

  useEffect(() => {
    const handleOutsideClickEvent = (e) => {
      if (e.target.closest('.search-bar-container')) {
        return;
      }
      handleOutsideClick();
    };

    document.addEventListener('mousedown', handleOutsideClickEvent);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClickEvent);
    };
  }, []);

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          InputProps={{
            style: { backgroundColor: 'white' }, // Change the background color here
          }}
          style={{ marginRight: '8px'}}
        />
        <Button variant="contained" type="submit" style={{ backgroundColor: 'white', color: 'black'  }}>
          Search
        </Button>
      </form>

      {showResults && (
        <div style={{ position: 'relative', marginTop: '8px' }}>
          <ul
            style={{
              position: 'absolute',
              backgroundColor: '#fff',
              listStyle: 'none',
              padding: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {searchResults.map((community2) => (
              <li
                key={community2.name}
                onClick={() => handleItemClick(community2.name)}
                style={{ cursor: 'pointer' }}
              >
                {community2.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
            };
          
const SEARCH_COMMUNITIES = gql`
  query SearchCommunities($name: String!) {
    communities(name: $name) {
      name
      members {
        email
      }
    }
  }
`;

export default SearchBar;
