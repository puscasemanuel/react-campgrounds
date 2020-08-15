import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { v4 as uuidv4 } from 'uuid';

export const UserProfile = () => {
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const fetchItems = async () => {
      const result = await axios('/api/v1/user', {
        withCredentials: true,
      });
      setUserData(result.data.userData);
    };

    fetchItems();
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    const data = {
      oldPassword,
      newPassword,
      confirmNewPassword,
    };
    axios
      .put('/api/v1/user/changePassword', data, {
        withCredentials: true,
      })
      .then((res) => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
        window.location = '/profile';
      })
      .catch((err) => {
        setErrors(err.response.data);
        setShow(true);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return userData.length < 1 ? (
    <>...Loading</>
  ) : (
    <div className="container">
      <h1 className="mt-5 mb-3">Hello, {userData.name}</h1>
      <img
        src={`/${userData.photo}`}
        height="300"
        width="300"
        alt="test"
        className="rounded"
      />

      <div>
        <Button variant="primary" className="mt-2" onClick={handleShow}>
          Change password
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Alert show={showSuccess} variant="success" className="mt-5">
          <Alert.Heading>Password changed successfully</Alert.Heading>

          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setShowSuccess(false)}
              variant="outline-success"
            >
              Close
            </Button>
          </div>
        </Alert>
        <Modal.Header closeButton>
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

          <Modal.Title>Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Old password</Form.Label>
              <Form.Control
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                type="password"
                placeholder="Enter old password"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group controlId="formBasicNewPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleChangePassword} variant="primary">
            Change
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
