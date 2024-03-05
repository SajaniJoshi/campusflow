import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";

import { useAuth } from "../../../context/AuthContext";
import MenuOpenButton from "../../MenuOpenButton/MenuOpenButton";
import MenuCloseButton from "../../MenuCloseButton/MenuCloseButton";

const Navbar = ({ borderColor }) => {
  const [auth, setAuth] = useAuth();

  const handleSignOut = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const navRef = useRef();

  const showNavbar = () => {
    console.log(navRef.current);
    navRef.current.classList.toggle("navbar__responsive-nav");
  };

  return (
    <>
      <section id="navbar" style={{ borderBottom: `4px solid ${borderColor}` }}>
        <div className="navbar__container">
          <header className="navbar__contents">
            <h1 className="navbar__brand">
              campus<span>flow</span>
            </h1>
            <nav ref={navRef} className="navbar__right-contents">
              <ul className="navbar__links">
                {auth.token && (
                  <Link className="navbar__link userName">
                    {auth.user.full_name}
                    <span>Student</span>
                  </Link>
                )}

                <Link className="navbar__link" to="/campus-flow/user/profile">
                  <FaUserGraduate />
                </Link>
                <Link
                  className="navbar__link"
                  to="/campus-flow/user/notifications"
                >
                  <FaBell />
                </Link>
                <Link
                  onClick={handleSignOut}
                  className="navbar__link"
                  to="/campus-flow/login"
                >
                  <RiLogoutBoxRFill />
                </Link>
                <Link
                  onClick={showNavbar}
                  className="navbar__menu-icons navbar__menu-close-icon"
                >
                  <MenuCloseButton />
                </Link>
              </ul>
            </nav>
            <Link
              onClick={showNavbar}
              style={{ marginRight: "0.875rem" }}
              className="navbar__menu-icons navbar__menu-open-icon"
            >
              <MenuOpenButton />
            </Link>
          </header>
        </div>
      </section>
    </>
  );
};

export default Navbar;
