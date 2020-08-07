import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const NewCampground = () => {
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(true);
  //const [isDisabled, setIsDisabled] = useState(true);

  const [data, setData] = useState({
    name: '',
    image: '',
    description: '',
    price: '',
    author: {
      id: '',
      username: '',
    },
    errors: {},
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

    // if (data.name !== '' && data.description !== '') {
    //   setIsDisabled(false);
    // }
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
      .post(`http://localhost:8080/api/v1/campgrounds`, data, {
        withCredentials: true,
      })
      .then((res) => {
        window.location = '/';
      })
      .catch((err) => {
        console.log(err);
        setData({
          ...data,
          errors: err.response.data,
        });
        setShow(true);
      });
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
      {Object.keys(data.errors).length > 0 && show ? (
        <Alert
          variant="danger"
          onClose={() => setShow(false)}
          className="mt-5"
          dismissible
        >
          <Alert.Heading>Oh! You got errors!</Alert.Heading>
          {Object.keys(data.errors).map((item) => {
            return <p key={uuidv4()}>{data.errors[item]}</p>;
          })}
        </Alert>
      ) : (
        <></>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
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
            value={data.description}
            name="description"
            onChange={handleInput}
            as="textarea"
            rows="5"
          />
        </Form.Group>

        <div className="text-center">
          <Button block variant="primary" type="submit">
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
