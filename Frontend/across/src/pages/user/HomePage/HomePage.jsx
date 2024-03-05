import React, { useEffect, useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import "./HomePage.css";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import { NavLink } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { useAuth } from "../../../context/AuthContext";
import { retrieveNotifications } from "../../../api/externalApi";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [transferCreditRequests, setTransferCreditRequests] = useState([]);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate an asynchronous operation (API call)
        await new Promise(resolve => setTimeout(resolve, 800));

        const response = await retrieveNotifications({
          email: auth.user.email,
        });
        setTransferCreditRequests(response.data.updates);
      } catch (error) {
        console.error("Error fetching transfer credit requests:", error);
      } finally {
        // After the API call is completed, set loading to false
        setLoading(false);
      }
    };

    // Show the initial loader for 800 milliseconds
    const initialLoaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 800);

    // Perform the API call after the initial loader timeout
    fetchData();

    // Clear the initial loader timeout when the component unmounts or when the API call is complete
    return () => clearTimeout(initialLoaderTimeout);
  }, []);
  return (
    <>
      {loading && <Loader text="Dashboard" />}
      {!loading && (
        <MainLayout>
          <div className="homePage">
            <div className="app__features">
              <h2>Welcome to CampusFlow</h2>
              <h4>
                The CampusFlow by Web Wizards provides a variety of functions
                for students to organise and administer their across courses.
              </h4>
              <p>
                It's available online 24/7. Here are some of the available
                services:
              </p>
              <ul className="highlighted__features">
                <li className="app__feature">
                  List of Across Universities updated information
                </li>
                <li className="app__feature">Module comparisons</li>
                <li className="app__feature">Transferring the credits</li>
                <li className="app__feature">Credit Transfer applications</li>
                <li className="app__feature">
                  Checkin your application status
                </li>
                <li className="app__feature">Guideline on Studying Abroad</li>
              </ul>
              <small>
                Answers to questions related to Across studies can be found
                under “Help and Contact”.This page also shows you notifications
                (Quick Links, News, Notifications.).
              </small>
            </div>

            <section className="homePage__quick__links">
              <h2>Quick Links for the Services</h2>
              <div className="quicklinksWrapper">
                <NavLink
                  className="quicklink quicklinkOne"
                  to="/campus-flow/user/universities"
                >
                  <h4>List of Across Universities</h4>
                  <p>
                    Information of the Across Universities, their departments
                    and modules
                  </p>
                </NavLink>
                <NavLink
                  className="quicklink quicklinkTwo"
                  to="/campus-flow/user/compare-modules"
                >
                  <h4>Compare of the Modules</h4>
                  <p>
                    Comparing the modules quickly without full module
                    descriptions
                  </p>
                </NavLink>
                <NavLink
                  to="/campus-flow/user/transfer-credits"
                  className="quicklink quicklinkThree"
                >
                  <h4>Transferring the Credits</h4>
                  <p>
                    Transferring the selected credits from one university to
                    another
                  </p>
                </NavLink>
              </div>
            </section>
            <div className="homePage__notifications">
              <h2>Notifications</h2>
              <h4>
                You have {transferCreditRequests.length} new notification(s)
              </h4>

              {transferCreditRequests.map((request, index) => (
                <Alert
                  key={index}
                  variant={request.status === "ACCEPTED" ? "primary" : "danger"}
                  style={{ margin: "5px", width: "100%" }}
                >
                  <p>
                    <small>
                      <b>{new Date(request.updated_at).toLocaleString()}</b>
                    </small>
                    &nbsp;Your application status of transferring your credits
                    from <strong>{request.fromModuleName}</strong> to{" "}
                    <strong>{request.toModuleName}</strong> has got
                    <span
                      style={{
                        fontWeight: "bold",
                        color: request.status === "ACCEPTED" ? "green" : "red",
                      }}
                    >
                      {" "}
                      {request.status}
                    </span>
                  </p>
                </Alert>
              ))}
              <NavLink
                to="/campus-flow/user/notifications"
                className="notifications"
              >
                See More
              </NavLink>
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
};

export default HomePage;
