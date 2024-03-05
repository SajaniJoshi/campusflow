import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "../assets/css/AdminHome.css";
import "../assets/css/Footer.css";
import Footer from "../components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [auth, setAuth] = useAuth();

  return (
    <div style={{ backgroundColor: "#EDEDED", minHeight: "100vh" }}>
      <AdminNavbar />
      <PageBody auth={auth} />
      <Footer />
    </div>
  );
};

function PageBody({ auth }) {
  const cardData = [
    {
      title: "Users",
      description:
        "Effortlessly oversee and manage user accounts, ensuring smooth access and interactions within the platform.",
      buttonText: "Show Users",
      link: "/admin/userlist",
    },
    {
      title: "Modules",
      description:
        "Take control of the courses and learning modules, ensuring a seamless and organized educational experience for students.",
      buttonText: "Show Modules",
      link: "/admin/modulelist",
    },
    {
      title: "Universities",
      description:
        "Facilitate the management and coordination of universities, fostering collaboration and excellence across educational institutions.",
      buttonText: "Show Universitites",
      link: "/manage-universities",
    },
    {
      title: "Automation Tool",
      description:
        "Facilitate the management and coordination of universities, fostering collaboration and excellence across educational institutions.",
      buttonText: "Run Automation",
      link: "/admin/generateRDF",
    },
    {
      title: "Similar Modules",
      description:
        "Facilitate the management and coordination of universities, fostering collaboration and excellence across educational institutions.",
      buttonText: "Show Similar Modules",
      link: "/admin/similaritytable",
    },
    {
      title: "PDF to RDF",
      description:
        "Facilitate the management and coordination of universities, fostering collaboration and excellence across educational institutions.",
      buttonText: "Convert to RDF",
      link: "/admin/generateRDF",
    },
    {
      title: "Transfer Credit Requests",
      description:
        "Facilitate the management and coordination of universities, fostering collaboration and excellence across educational institutions.",
      buttonText: "Show Transfer Credit Requests",
      link: "/admin/users/transferCreditRequests",
    },
  ];
  return (
    <Container style={{ backgroundColor: "#EDEDED" }}>
      <h1 className="my-4 text-left">
        Hi {auth.user.full_name}, Welcome to the ADMIN panel
      </h1>
      <div
        className="intro-container mb-4 p-4 border rounded bg-light"
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          marginLeft: "5px",
          marginRight: "5px",
        }}
      >
        <h2 className="text-left text-primary mb-4">Admin Activities</h2>
        <p
          className="justify-content-left"
          style={{ fontFamily: "monospace", textAlign: "justify" }}
        >
          Welcome to the heart of the cross-university platform! As
          administrators, you hold the key to shaping the educational landscape.
          In your role, you have various responsibilities, such as managing
          users, organizing courses and learning materials, and promoting
          collaboration among universities. Your dynamic role involves breaking
          down barriers, ensuring a smooth educational experience, and shaping
          the future for our students.
        </p>
      </div>

      <div
        className="mb-4 bg-light"
        style={{
          padding: "20px",
          borderRadius: "10px",
          marginLeft: "5px",
          marginRight: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-left text-primary mb-4">Manage</h2>
        <Row className="justify-content-center bg-light" style={{}}>
          {cardData.map((card, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={3}
              className="d-flex align-items-stretch"
              style={{ marginBottom: "10px" }}
            >
              <Card
                className="mb-4 w-100"
                style={{ backgroundColor: "#e5f1f4", color: "#000" }}
              >
                <Card.Body
                  className="d-flex flex-column align-items-center"
                  style={{ backgroundColor: "#e5f1f4" }}
                >
                  <Card.Title
                    className="text-center"
                    style={{
                      backgroundColor: "#e5f1f4",
                      marginBottom: "14px",
                      fontSize: "20px",
                    }}
                  >
                    {card.title}
                  </Card.Title>
                  <Button
                    style={{
                      backgroundColor: "#b2d6de",
                      color: "#000",
                      border: "#b2d6de",
                      marginBottom: "3px",
                      fontSize: "16px",
                    }}
                    href={card.link}
                  >
                    {card.buttonText}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default Home;
