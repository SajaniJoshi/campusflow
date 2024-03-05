import React, { useRef, useState } from "react";
import "../assets/css/Header.css";
import { Link } from "react-scroll";
import { NavLink } from "react-router-dom";
import brandLogo from "../assets/images/brandLogo.png";
import MenuCloseButton from "./MenuCloseButton/MenuCloseButton";
import MenuOpenButton from "./MenuOpenButton/MenuOpenButton";
import { Navbar } from "react-bootstrap";

const duration = 500;
const Header = () => {
  const navRef = useRef();

  const showNavbar = () => {
    console.log(navRef.current);
    navRef.current.classList.toggle("responsive-nav");
  };

  return (
    <div className="header">
      <div className="header__left">
        <Navbar
          expand="lg"
          style={{
            width: "100%",
            margin: "auto",
            padding: "0 20px",
          }}
        >
          <Navbar.Brand
            href="/admin/home"
            style={{
              fontSize: "40px",
              color: "#000",
              textShadow: "2px 2px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            campus<b style={{ color: "#51829B" }}>flow</b>
          </Navbar.Brand>
        </Navbar>
      </div>
      <nav ref={navRef} className="header__contents">
        <div className="header__middle">
          <ul className="header__links">
            <li className="header__link">
              <Link activeClass="active" to="/" spy smooth duration={duration}>
                Home
              </Link>
            </li>
            <li className="header__link">
              <Link activeClass="active" to="#" spy smooth duration={duration}>
                About
              </Link>
            </li>
            <li className="header__link">
              <Link activeClass="active" to="#" spy smooth duration={duration}>
                Universities
              </Link>
            </li>
            <li className="header__link">
              <Link
                activeClass="active"
                to="modules"
                spy
                smooth
                duration={duration}
              >
                ACROSS
              </Link>
            </li>
            <li className="header__link">
              <Link activeClass="active" to="#" spy smooth duration={duration}>
                Reach Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="header__right">
          <li className="header__link">
            <NavLink className="login__link" to="/campus-flow/login">
              Log in
            </NavLink>
          </li>
          <li className="header__signup-btn">
            <NavLink className="register__link" to="/campus-flow/register">
              Sign Up
            </NavLink>
          </li>
        </div>
        <li
          className="header__menu-icons header__menu-close-icon"
          onClick={showNavbar}
        >
          <MenuCloseButton />
        </li>
      </nav>

      <li
        className="header__menu-icons header__menu-open-icon"
        onClick={showNavbar}
      >
        <MenuOpenButton />
      </li>
    </div>
  );
};

export default Header;
