import React, { useEffect, useState } from "react";
import { Col, Container, Row, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart } from 'react-icons/fa';
import apiService from './apiService';
import Header from "./Header";
import Footer from "./Footer";
import "./styles/Dashboard.css";

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [country, setCountry] = useState("INDIA");
  const [visibleStocks, setVisibleStocks] = useState(10);
  const [username, setUsername] = useState("");
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      tokenValidate();
    } else {
      handleSignOut();
    }
  }, [country]);

  const tokenValidate = async () => {
    try {
      const response = await apiService.validateToken();
      if (response.status === 200) {
        setUsername(response.data.username);
        fetchStocks();
        fetchFavorites();
      } else {
        handleSignOut();
      }
    } catch (error) {
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchStocks = async () => {
    try {
      const response = await apiService.getStocks(country);
      if (response.data) {
        const uniqueStocks = response.data.reduce((acc, current) => {
          const exists = acc.find(stock => stock.symbol === current.symbol && stock.exchange === current.exchange);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        setStocks(uniqueStocks);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized: Invalid or expired token. Please sign in again.");
        handleSignOut();
      } else {
        toast.error("Failed to fetch stocks. Please try again later.");
      }
      setStocks([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await apiService.getFavorites(username);
      setFavorites(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch favorites.");
    }
  };

  const loadMoreStocks = () => {
    setVisibleStocks((prevValue) => prevValue + 10);
  };

  const addToFavorites = async (stock) => {
    try {
      const response = await apiService.addToFavorites(username, stock);
      if (response.status === 200) {
        setFavorites([...favorites, stock]);
        toast.success(`${stock.name} added to favorites.`);
      } else if (response.status === 208) {  // Handling 208 Already Reported
        toast.warn(`${stock.name} is already in your favorites.`);
      }
    } catch (error) {
      toast.error("Failed to add to favorites.");
    }
  };

  return (
    <Container className="dashboard-container">
      <ToastContainer />
      <Header username={username} onSignOut={handleSignOut} />
      <Row className="flex-grow-1">
        <Col md={12} className="d-flex justify-content-end mb-3">
          <DropdownButton id="dropdown-country" title={country} className="dropdown-country">
            {["INDIA", "USA", "CHINA", "BELGIUM", "UK", "AUSTRALIA", "JAPAN"].map((countryName) => (
              <Dropdown.Item key={countryName} onClick={() => setCountry(countryName)}>
                {countryName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col md={12}>
          <h2 className="text-center">Stocks Listing</h2>
          <div className="stock-list-container">
            <div className="stock-list">
              {stocks.slice(0, visibleStocks).map((stock) => (
                <div key={`${stock.symbol}-${stock.exchange}`} className="stock-item mb-3 p-3 border rounded">
                  <h5>{stock.name}</h5>
                  <p>Currency: {stock.currency}</p>
                  <p>Exchange: {stock.exchange}</p>
                  <p>MIC Code: {stock.mic_code}</p>
                  <p>Country: {stock.country}</p>
                  <div className="stock-actions">
                    <Button variant="outline-danger" onClick={() => addToFavorites(stock)}>
                      <FaHeart /> Add to Favorites
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {visibleStocks < stocks.length && (
              <Button onClick={loadMoreStocks} className="mt-3" variant="success">
                Load More
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

export default Dashboard;
