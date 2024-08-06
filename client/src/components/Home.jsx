import React from 'react';
import { Carousel, Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg"; 

export default function Home() {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Bike Service</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <LinkContainer to="/register">
                                <Nav.Link>Register</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/auth/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        style={{ height: '90vh', objectFit: 'cover' }}
                        src={image1}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                            <h3>Best Bike Services</h3>
                            <p>We provide the best services for your bikes.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        style={{ height: '90vh', objectFit: 'cover' }}
                        className="d-block w-100"
                        src={image2}
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Professional Mechanics</h3>
                        <p>Our mechanics are well-trained and experienced.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        style={{ height: '90vh', objectFit: 'cover' }}
                        className="d-block w-100"
                        src={image3}
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                            <h3>Quick Service</h3>
                            <p>Get your bike serviced quickly and efficiently.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="text-center mt-5">
                <h1>Welcome to Bike Service Web App</h1>
                <p>Click on the links to learn more about us</p>
            </Container>

            <Container className="mt-5">
                <Row>
                    <Col>
                        <h2>About Us</h2>
                        <p>
                            We are dedicated to providing the best bike service in town. Our team of
                            professional mechanics ensures that your bike is in top condition.
                        </p>
                    </Col>
                </Row>
            </Container>

            <footer className="bg-dark text-white text-center p-3 mt-5">
                <p>&copy; 2024 Bike Service. All rights reserved.</p>
            </footer>
        </div>
    );
}
