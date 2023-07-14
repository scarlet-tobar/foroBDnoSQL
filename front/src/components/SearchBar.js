import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{ marginRight: '8px' }}
      />
      <Button variant="contained" type="submit">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;