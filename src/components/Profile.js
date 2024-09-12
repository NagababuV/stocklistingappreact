import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiService from "./apiService";
import "./styles/Profile.css";

function Profile({ onSignOut }) {
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const [passwordMasked, setPasswordMasked] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      handleSignOut();
    }
  }, [token]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const validateToken = async () => {
    try {
      const response = await apiService.validateToken();
      if (response.status === 200) {
        setUsername(response.data.username);
      } else {
        handleSignOut();
      }
    } catch (error) {
      handleSignOut();
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await apiService.getProfile(username);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const togglePasswordMask = () => {
    setPasswordMasked(!passwordMasked);
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Container className="d-flex flex-column min-vh-100">
      <Header username={username} onSignOut={handleSignOut} />
      <Row className="flex-grow-1">
        <Col md={12}>
          <h1 className="my-4">👤 User Profile</h1>
          {profile.username ? (
            <div className="profile-container">
              <div className="profile-field">
                <span>📛 Username:</span> <span>{profile.username}</span>
              </div>
              <div className="profile-field">
                <span>🔒 Password:</span> 
                <span>
                  {passwordMasked ? "********" : profile.password}
                  <Button variant="link" onClick={togglePasswordMask} className="mask-toggle">
                    {passwordMasked ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                </span>
              </div>
              <div className="profile-field">
                <span>📧 Email:</span> <span>{profile.email}</span>
              </div>
              <div className="profile-field">
                <span>📱 Phone:</span> <span>{profile.phone}</span>
              </div>
              <div className="profile-field">
                <span>🌍 Country:</span> <span>{profile.country}</span>
              </div>
            </div>
          ) : (
            <p className="text-muted">Loading profile...</p>
          )}
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}

export default Profile;
