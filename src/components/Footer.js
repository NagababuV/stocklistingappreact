import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <Container>
        <Row>
          <Col>&copy; {new Date().getFullYear()} Stock Dashboard. All Rights Reserved.</Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
