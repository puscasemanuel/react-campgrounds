import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

function CampgroundsList({ isLoading, items }) {
  const [search, setSearch] = useState('');
  const [filteredCampings, setFilteredCampings] = useState([]);

  useEffect(() => {
    const filteredCampings = items.filter((camping) =>
      camping.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCampings(filteredCampings);
  }, [search, items]);

  const renderOnSearch = filteredCampings.map((item, index) => (
    <Link to={`/campground/${item.slug}`} key={index}>
      <Col className="movie-item mb-4">
        <Card style={{ width: '18rem' }}>
          <Card.Img
            variant="top"
            src={item.image}
            alt="Camp photo"
            style={{ height: '15rem', width: '18rem' }}
          />
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Link>
  ));

  const renderCampground =
    items.length > 0 &&
    items.map((item, index) => (
      <Link to={`/campground/${item.slug}`} key={index}>
        <Col className="movie-item mb-4">
          <Card style={{ width: '18rem' }}>
            <Card.Img
              variant="top"
              src={item.image}
              alt="Camp photo"
              style={{ height: '15rem', width: '18rem' }}
            />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Link>
    ));
  return isLoading ? (
    <div className="text-center">
      <img
        height="500"
        widt="500"
        src="https://i.ya-webdesign.com/images/loading-gif-png-5.gif"
        alt="Loading gif"
      />
    </div>
  ) : (
    <Container className="movies-list mt-5">
      <Form.Control
        className="search--input mb-4"
        placeholder="Search ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {renderOnSearch ? (
        <>
          <h1 className="movies-list--h1 mb-5">Campgrounds</h1>
          <Row lg={3}>{search ? renderOnSearch : renderCampground}</Row>
        </>
      ) : (
        <h1 className="text-center mt-5">Nici un camping cu acest nume!</h1>
      )}
    </Container>
  );
}

export default CampgroundsList;
