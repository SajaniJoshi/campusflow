import React from "react";
import moduleSvg from "../assets/images/module.svg";
import courseSvg from "../assets/images/course.svg";
import acrossSvg from "../assets/images/across_logo.svg";
import "../assets/css/About.css";

const About = () => {
  return (
    <>
      <section id="about" className="about">
        <div className="container">
          <div className="about__features">
            <div className="feature feature1">
              <img className="svg moduleSvg" src={moduleSvg} alt="" />
              <p className="feature__count text-base">
                1000+ <span>Modules</span>
              </p>
            </div>
            <div className="feature feature2">
              <div className="feature__imgContainer">
                <img className="svg acrossSvg" src={acrossSvg} alt="" />
              </div>
              <p className="feature__count text-base">
                Across <span>Universities</span>
              </p>
            </div>
            <div className="feature feature3">
              <img className="svg courseSvg" src={courseSvg} alt="" />
              <p className="feature__count text-base">
                50+ <span>Courses</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
