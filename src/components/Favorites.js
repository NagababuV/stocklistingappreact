import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt } from "react-icons/fa";
import apiService from "./apiService"; // Import the centralized API service

function Favorites({ onSignOut }) {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      tokenValidate();
    } else {
      handleSignOut();
    }
  }, [token]);

  useEffect(() => {
    if (username) {
      fetchFavorites();
    }
  }, [username]);

  async function tokenValidate() {
    try {
      const response = await apiService.validateToken(); // Use the API service
      if (response.status === 200) {
        setUsername(response.data.username);
      } else {
        handleSignOut();
      }
    } catch (error) {
      handleSignOut();
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await apiService.getFavorites(username); // Use the API service
      setFavorites(response.data);
    } catch (error) {
      toast.error("Failed to fetch favorites.");
      console.error("Error fetching favorites:", error);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await apiService.removeFromFavorites(username, symbol); // Use the API service
      fetchFavorites(); // Refresh the list after removing
    } catch (error) {
      toast.error("Failed to remove from favorites.");
      console.error("Error removing from favorites:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Container className="d-flex flex-column min-vh-100">
      <ToastContainer />
      <Header username={username} onSignOut={handleSignOut} />
      <Row className="flex-grow-1">
        <Col md={12}>
          <h1 className="my-4">Favorites</h1>
          {favorites.length > 0 ? (
            <ListGroup>
              {favorites.map((item) => (
                <ListGroup.Item
                  key={`${item.symbol}-${item.name}-${item.currency}-${item.exchange}-${item.country}`}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-0">
                      <strong>Currency:</strong> {item.currency} &nbsp;|&nbsp;
                      <strong>Exchange:</strong> {item.exchange} &nbsp;|&nbsp;
                      <strong>Country:</strong> {item.country}
                    </p>
                  </div>
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      handleRemove(item.symbol)
                    }
                  >
                    <FaTrashAlt /> Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No items in favorites yet.</p>
          )}
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

export default Favorites;
