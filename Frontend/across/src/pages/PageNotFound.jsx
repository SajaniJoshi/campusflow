import React from "react";
import "../assets/css/PageNotFound.css";
import pnfImage from "../assets/images/pnf-image.svg";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="pnf">
      <img className="pnf__image" src={pnfImage} alt="" />
      <h1 className="pnf__title">Page Not Found</h1>
      <p>We're sorry, the page you requested could not be found.</p>
      <button type="button" className="pnf__button" onClick={goBack}>
        Go back
      </button>
    </div>
  );
};

export default PageNotFound;
