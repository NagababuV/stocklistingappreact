import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FaSignOutAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";
import './styles/Header.css';

function Header({ username, onSignOut }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header">
      <Navbar.Brand as={Link} to="/">Stock Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
          {/* <Nav.Link as={Link} to="/wishlist">Follow</Nav.Link> */}
          <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
          <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
        </Nav>
        <Nav className="ml-auto align-items-center">
          <Nav.Link className="text-info username">{username}</Nav.Link>
          <Nav.Link className="text-danger signout" onClick={onSignOut}>
            <FaSignOutAlt /> Sign Out
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
