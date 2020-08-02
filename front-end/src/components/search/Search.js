import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

const Search = ({ items }) => {
  const [text, setText] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const filteredMovies = items.filter((movie) =>
      movie.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMovies(filteredMovies);
  }, [text]);

  return <Container className="search--container mt-5"></Container>;
};

export default Search;
