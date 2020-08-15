import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(true);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: confirmPassword,
    };

    axios
      .post('/api/v1/signup', data)
      .then((result) => {
        if (result.data.status === 'success') {
          setSuccess(true);
          setTimeout(() => {
            window.location = '/login';
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.response.data);
        setShow(true);
      });
  };

  return (
    <Container className="mt-5 shadow-lg p-3 mb-5 bg-white rounded p-5">
      <div className="text-center">
        <h1>Sign up</h1>
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
          Account successfully created!
        </Alert>
      ) : (
        <></>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicText">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            type="text"
            placeholder="Enter your name"
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">
            Sign up!
          </Button>
        </div>
      </Form>
    </Container>
  );
};
