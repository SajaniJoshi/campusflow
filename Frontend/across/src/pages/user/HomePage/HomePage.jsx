import React, { useEffect, useState } from "react";
import "./HomePage.css";
import SearchBox from "../../../components/user/SearchBox/SearchBox";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import { NavLink } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const showLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      setLoading(false);
    };

    showLoader();
  }, []);
  return (
    <>
      {loading && <Loader text="Dashboard" />}
      {!loading && (
        <MainLayout>
          <div className="homePage">
            <SearchBox />
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
                <NavLink className="quicklink quicklinkOne">
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
                <NavLink  to="/campus-flow/user/transfer-credits" className="quicklink quicklinkThree">
                  <h4>Transferring the Credits</h4>
                  <p>
                    Transferring the selected credits from one university to
                    another
                  </p>
                </NavLink>
                <NavLink className="quicklink quicklinkFour">
                  <h4>Studying Abroad</h4>
                  <p>Suggestions on studying abroad,</p>
                </NavLink>
              </div>
            </section>
            <section className="homePage__notifications">
              <h2>Notifications</h2>
              <h4>You have one new notification</h4>
              <p>
                Your application status of transfering your credits to TU
                Chemnitz has changed.
              </p>

              <button className="notification__button" type="button">
                See More
              </button>
            </section>
          </div>
        </MainLayout>
      )}
    </>
  );
};

export default HomePage;
