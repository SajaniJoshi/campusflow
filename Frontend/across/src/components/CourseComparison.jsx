import React from "react";
import "../assets/css/CourseComparison.css";
import courseCompareImage from "../assets/images/compare_modules.png";

const CourseComparison = () => {
  return (
    <div className="courseComparison">
      <img
        className="courseComparison__image"
        src={courseCompareImage}
        alt=""
      />
      <div className="courseComparison__contents">
        <h2 className="courseComparison__title">
          Elevating Education: Unmatched Modules, Unique Features
        </h2>
        <p className="courseComparison__description text-sm">
          CampusFlow provides a superior educational journey by offering exceptional modules and unique features, setting it apart from other platforms. It highlights the platform's commitment to delivering a distinctive and elevated learning experience for users.
        </p>
        <button type="button" className="courseComparison__button">
          Explore Here
        </button>
      </div>
    </div>
  );
};

export default CourseComparison;
