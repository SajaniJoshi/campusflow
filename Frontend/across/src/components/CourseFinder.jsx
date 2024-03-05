import React from "react";
import "../assets/css/CourseFinder.css";
import courseFinderImage from "../assets/images/university_match.png";
import { useNavigate } from "react-router-dom";

const CourseFinder = () => {
  const navigate = useNavigate();

  return (
    <div className="courseFinder">
      <div className="courseFinder__details">
        <h2 className="courseFinder__title">
          Find Your Course That Makes Bright Future
        </h2>
        <p className="courseFinder__description text-sm">
          Discover the path to a brighter future with CampusFlow – find your perfect course and embark on a journey toward academic excellence and personal growth.
        </p>
        <button
          type="button"
          className="courseFinder__button"
          onClick={() => navigate("/modules")}
        >
          Get Started
        </button>
      </div>
      <img className="courseFinder__image" src={courseFinderImage} alt="" />
    </div>
  );
};

export default CourseFinder;
