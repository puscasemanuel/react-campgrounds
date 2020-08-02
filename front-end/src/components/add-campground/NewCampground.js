import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';

export const NewCampground = () => {
  const [userData, setUserData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  const [data, setData] = useState({
    name: '',
    image: '',
    description: '',
    price: '',
    author: {
      id: '',
      username: '',
    },
  });

  useEffect(() => {
    const user = window.localStorage.getItem('data');
    const parsedData = JSON.parse(user);
    setUserData(parsedData);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (data.name !== '' && data.description !== '') {
      setIsDisabled(false);
    }
    setData(() => {
      return {
        ...data,
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
      .post(`/api/v1/campgrounds`, data, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
      });

    window.location = '/';
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
          <Form.Label>Title</Form.Label>
          <Form.Control
            required
            name="name"
            value={data.name}
            onChange={handleInput}
            type="text"
            placeholder="Enter title"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Image</Form.Label>
          <Form.Control
            required
            value={data.image}
            onChange={handleInput}
            name="image"
            type="text"
            placeholder="Photo link"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Price</Form.Label>
          <Form.Control
            required
            name="price"
            onChange={handleInput}
            value={data.price}
            type="text"
            placeholder="Enter the price or type free"
          />
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            value={data.description}
            name="description"
            onChange={handleInput}
            as="textarea"
            rows="5"
          />
        </Form.Group>

        <div className="text-center">
          <Button disabled={isDisabled} block variant="primary" type="submit">
            Add new campground
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
