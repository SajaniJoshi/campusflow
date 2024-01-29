import React from "react";
import footerStyles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";

import { PiPhoneCallFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { MdLocationPin } from "react-icons/md";

import companylogo from "../../../assets/images/userpage-company-logo.svg";

const linkedUrl = "https://www.linkedin.com/in/web-wizards-team/";
const fbUrl = "https://www.facebook.com/profile.php?id=61552264606950/";
const xUrl = "https://twitter.com/WWizards42028/";
const locationUrl =
  "https://www.google.com/maps/place/Studentenwohnheim+Vettersstra%C3%9Fe+54/@50.8182681,12.9327753,19z/data=!4m6!3m5!1s0x47a7466d601b5829:0xd8b4a69ede3b967!8m2!3d50.8182932!4d12.9336132!16s%2Fg%2F11h0mvq1xw?hl=de&entry=ttu";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <>
      <section id="footer">
        <footer className={footerStyles.footer}>
          <div className="container">
            <div className={footerStyles.footer__contents}>
              <div className={footerStyles.footer__left}>
                <h4>Follow Us</h4>
                <div className={footerStyles.footer__left__icons}>
                  <Link to={fbUrl} target="_blank">
                    <FaFacebookSquare
                      className={footerStyles.footer__left__icon}
                    />
                  </Link>
                  <Link to={linkedUrl} target="_blank">
                    <FaLinkedin className={footerStyles.footer__left__icon} />
                  </Link>
                  <Link to={xUrl} target="_blank">
                    <FaSquareXTwitter
                      className={footerStyles.footer__left__icon}
                    />
                  </Link>
                </div>
              </div>
              <div className={footerStyles.footer__middle}>
                <img src={companylogo} alt="web wizards with twinkling stars" />
                <h4>
                  Student Service for Across European Cross-Border University
                </h4>
              </div>
              <div className={footerStyles.footer__right}>
                <h4>Contact Us</h4>
                <div className={footerStyles.footer__right__icons}>
                  <Link to="tel:+4915752491735">
                    <PiPhoneCallFill
                      className={footerStyles.footer__right__icon}
                    />
                  </Link>
                  <Link to="mailto:webwizardsservices@gmail.com?subject=Mail from your Site">
                    <MdEmail className={footerStyles.footer__right__icon} />
                  </Link>
                  <Link to={locationUrl} target="_blank">
                    <MdLocationPin
                      className={footerStyles.footer__right__icon}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className={footerStyles.infoContainer}>
            <div className={footerStyles.copyrightText}>
              <small>
                Copyright &copy; <span> {year}</span> Web Wizards. All rights
                reserved
              </small>
            </div>
            <div className={footerStyles.disclaimerText}>
              <small>
                Disclaimer: This website is not associated with an actual
                company but is a part of a web engineering project called
                Planspiel at the Technical University of Chemnitz.
              </small>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default Footer;
