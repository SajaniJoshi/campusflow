import React, { useState, useEffect } from "react";
import "../assets/css/UsersofTransferCredits.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import { fetchUserData } from "../api/adminApi";

const UsersofTransferCredits = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserData();
        console.log(response);
        setUserData(response.data.user_data);
      } catch (error) {
        console.error("Error fetching transfer requests:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ flex: 1 }} className="users__transferCredits">
      <AdminNavbar />
      <p id="usersTransferHeading">Users List of Transfer Credit Requests</p>
      <h4>
        <Badge pill bg="dark">
          Manage users transfer credit request from here once university gives
          approval
        </Badge>
      </h4>
      <UserDataCards userData={userData} navigate={navigate} />
    </div>
  );
};

const handleManageRequestApprove = async (email, full_name, navigate) => {
  navigate("/admin/transferCredits", { state: { email, full_name } });
};

function UserDataCards({ userData, navigate }) {
  return (
    <Container fluid>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {userData.map((user, index) => (
          <Col key={index}>
            <Card
              style={{ width: "100%", margin: "20px 0px 20px 0px" }}
              className="text-center"
            >
              <Card.Body>
                <Card.Title>{user.full_name}</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {user.email}
                  <br />
                  <strong>University:</strong> {user.university || "N/A"}
                  <br />
                  <strong>Role:</strong> {user.role}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    handleManageRequestApprove(
                      user.email,
                      user.full_name,
                      navigate
                    )
                  }
                >
                  Manage Request
                </Button>
              </Card.Body>
              {/* <Card.Footer className="text-muted">VALID USER</Card.Footer> */}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default UsersofTransferCredits;
