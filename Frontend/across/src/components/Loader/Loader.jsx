import React from "react";
import { RotatingLines, ProgressBar } from "react-loader-spinner";
import { PulseLoader } from "react-spinners";
import "./Loader.css";

const Loader = ({ text }) => {
  return (
    <div className="loader">
      <h2>Loading {text}</h2>
      {/* <RotatingLines
        visible={true}
        height="106"
        width="200"
        color="gray"
        strokeWidth="4"
        animationDuration="1"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      /> */}

      {/* <ProgressBar
        visible={true}
        height="80px"
        width="200px"
        borderColor="#439a86"
        barColor="#439a86"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      /> */}

      <PulseLoader color="#439a86" />
    </div>
  );
};

export default Loader;
