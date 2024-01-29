import React from "react";
import "../assets/css/Footer.css";
import facebookIcon from "../assets/social_media_icons/facebook.png";
import linkedinIcon from "../assets/social_media_icons/linkedin.png";
import xIcon from "../assets/social_media_icons/x.png";
import companyLogo from "../assets/images/brandLogo.png";
import phoneIcon from "../assets/contact_icons/phone.png";
import messageIcon from "../assets/contact_icons/message.png";
import locationIcon from "../assets/contact_icons/location.png";
import { Link } from "react-router-dom";

const linkedUrl = "https://www.linkedin.com/in/web-wizards-team/";
const fbUrl = "https://www.facebook.com/profile.php?id=61552264606950/";
const xUrl = "https://twitter.com/WWizards42028/";
const locationUrl =
  "https://www.google.com/maps/place/Studentenwohnheim+Vettersstra%C3%9Fe+54/@50.8182681,12.9327753,19z/data=!4m6!3m5!1s0x47a7466d601b5829:0xd8b4a69ede3b967!8m2!3d50.8182932!4d12.9336132!16s%2Fg%2F11h0mvq1xw?hl=de&entry=ttu";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className="footer">
      <div className="footer__contents">
        <div className="footer__left">
          <h4 className="footer__subHeading">Follow Us</h4>
          <div className="footer__social-handles">
            <Link to={fbUrl} target="_blank">
              <img src={facebookIcon} alt="" />
            </Link>
            <Link to={linkedUrl} target="_blank">
              <img src={linkedinIcon} alt="" />
            </Link>
            <Link to={xUrl} target="_blank">
              <img src={xIcon} alt="" />
            </Link>
          </div>
        </div>
        <div className="footer__middle">
          <div className="company__logo">
            <img src={companyLogo} alt="" />
          </div>
          <h4 className="footer__subHeading company__initiative">
            Student Service for Across European Cross-Border University
          </h4>
        </div>
        <div className="footer__right">
          <h4 className="footer__subHeading">Contact Us</h4>
          <div className="footer__right-contactIcons">
            <Link to="tel:+4915752491735">
              <img src={phoneIcon} alt="" />
            </Link>
            <Link to="mailto:webwizardsservices@gmail.com?subject=Mail from your Site">
              <img src={messageIcon} alt="" />
            </Link>
            <Link to={locationUrl} target="_blank">
              <img src={locationIcon} alt="" />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer__bottom-contents">
        <div className="footer__copyright-text">
          <small>
            Copyright &copy; <span id="copyright"> {year}</span> Web Wizards.
            All rights reserved
          </small>
        </div>
        <div className="footer__disclaimer-text text-center">
          <small>
            Disclaimer: This website is not associated with an actual company
            but is a part of a web engineering project called Planspiel at the
            Technical University of Chemnitz.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Footer;
