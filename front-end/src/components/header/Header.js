import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Cookies from 'js-cookie';

const Header = () => {
  const [data, setData] = useState();
  const cookie = Cookies.get('session');

  useEffect(() => {
    const userData = window.localStorage.getItem('data');
    const parsedData = JSON.parse(userData);

    setData(parsedData);
  }, []);

  const logOut = () => {
    window.localStorage.removeItem('data');
    document.cookie = 'session=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    alert('Disconnected!');
    setTimeout(() => {
      window.location = '/';
    }, 500);
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Campgrounds Master</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/new-campground">Create campground</Nav.Link>
        </Nav>

        <Nav className="mr-auto">
          {!data || !cookie ? (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Sign up</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link>Welcome, {data.name}</Nav.Link>
              <Nav.Link href="#" onClick={logOut}>
                Logout
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
