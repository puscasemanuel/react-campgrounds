import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(true);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    axios
      .post('/api/v1/login', data, {
        withCredentials: true,
      })
      .then((result) => {
        if (result.data.status === 'success') {
          window.localStorage.setItem(
            'data',
            JSON.stringify(result.data.userData)
          );
          setSuccess(true);
          setTimeout(() => {
            window.location = '/';
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setErrors(err.response.data);
        setShow(true);
      });
  };

  return (
    <Container className="mt-5 shadow-lg p-3 mb-5 bg-white rounded p-5">
      <div className="text-center">
        <h1>Login</h1>
      </div>

      {Object.keys(errors).length > 0 && show ? (
        <Alert
          variant="danger"
          onClose={() => setShow(false)}
          className="mt-5"
          dismissible
        >
          <Alert.Heading>Oh! You got errors!</Alert.Heading>
          {Object.keys(errors).map((item) => {
            return <p key={uuidv4()}>{errors[item]}</p>;
          })}
        </Alert>
      ) : (
        <></>
      )}

      {success ? (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Success!
        </Alert>
      ) : (
        <></>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};
