import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export const UpdateCampground = () => {
  let { id } = useParams();

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const user = window.localStorage.getItem('data');
    const parsedData = JSON.parse(user);
    setUserData(parsedData);
  }, []);

  const [camping, setCamping] = useState([
    {
      name: '',
      image: '',
      description: '',
      price: '',
      author: {
        id: '',
        username: '',
      },
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const campData = async () => {
      const result = await axios.get(`/api/v1/campgrounds/${id}`, {
        withCredentials: true,
      });
      setCamping(result.data.data.campground);
      setIsLoading(false);
    };
    campData();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setCamping(() => {
      return {
        ...camping,
        [name]: value,
        author: {
          id: userData._id,
          username: userData.name,
        },
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/v1/campgrounds/${camping._id}`, camping, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
      });

    window.location = `/campground/${id}`;
  };

  return isLoading ? (
    <div className="text-center">
      <img
        height="500"
        width="500"
        src="https://i.ya-webdesign.com/images/loading-gif-png-5.gif"
        alt="Loading gif"
      />
    </div>
  ) : (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={camping.name}
            onChange={handleInput}
            name="name"
            type="text"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">Error will go here</Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Image</Form.Label>
          <Form.Control
            value={camping.image}
            onChange={handleInput}
            name="image"
            type="text"
            placeholder="image link"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={camping.price}
            onChange={handleInput}
            name="price"
            type="text"
            placeholder="price"
          />
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            value={camping.description}
            name="description"
            onChange={handleInput}
            as="textarea"
            rows="5"
          />
        </Form.Group>
        <div className="text-center">
          <Button block variant="dark" type="submit">
            Update campground
          </Button>
        </div>
      </Form>

      <Link to="/">
        <Button className="mt-5" variant="success">
          BACK
        </Button>
      </Link>
    </Container>
  );
};
