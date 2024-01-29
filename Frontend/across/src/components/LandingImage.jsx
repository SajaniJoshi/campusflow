import React from "react";
import "../assets/css/LandingImage.css";

const LandingImage = ({ source, title }) => {
  return (
    <>
      <section id="home" style={{ paddingTop: "75px" }}>
        <div className="landingImage">
          <img
            className="landingImage__banner"
            src={source}
            alt="scene of a student reading a book with a globe kept aside"
          />
        </div>
        <div className="landingImage__slogan">
          <p>"Unity in Learning, Diversity in Experience"</p>
        </div>
      </section>
    </>
  );
};

export default LandingImage;
