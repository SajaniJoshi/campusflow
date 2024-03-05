import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import tucImage from "../../../assets/universities_images/tucImage.jpg";
import bialystokImage from "../../../assets/universities_images/bialystokImage.jpg";
import tucLogo from "../../../assets/universities_images/tucLogo.webp";
import bialystokLogo from "../../../assets/universities_images/bialystokLogo.png";
import "./ModuleDetailsPage.css";
import Navbar from "../../../components/user/Navbar/Navbar";
import Footer from "../../../components/user/Footer/Footer";

const ModuleDetailsPage = () => {
  const location = useLocation();
  const { moduleData } = location.state || "";
  console.log(moduleData);
  const navigate = useNavigate();

  const handleBtnClick = () => {
    navigate(-1);
  };
  return (
    <div>
      <Navbar />
      {moduleData.belongs_to_university === "Bialystok University" ? (
        <img
          style={{ width: "100%", height: "60vh", objectFit: "cover" }}
          src={bialystokImage}
          alt=""
        />
      ) : (
        <img
          style={{ width: "100%", height: "60vh", objectFit: "cover" }}
          src={tucImage}
          alt=""
        />
      )}

      <div className="moduleDetailsContainer">
        <div className="moduleDetails">
          <div className="moduleDetails__left">
            <img
              className="uniLogo"
              src={
                moduleData.belongs_to_university === "Bialystok University"
                  ? bialystokLogo
                  : tucLogo
              }
              alt=""
            />
          </div>
          <div className="moduleDetails__right">
            <div className="u_name">{moduleData.belongs_to_university}</div>
            <h1 className="module_name">{moduleData.module_name}</h1>
            <div className="module_contents">
              Contents: {moduleData.module_content}
            </div>

            <div className="module_features">
              <div className="module_feature">
                <h4>{moduleData.module_credit_points}</h4>
                <p>Credit Points</p>
              </div>
              <div className="module_feature">
                <h4>{moduleData.has_language}</h4>
                <p>Language</p>
              </div>
              <div className="module_feature">
                <h4>{moduleData.module_workload}</h4>
                <p>Workload</p>
              </div>
              <div className="module_feature">
                <h4>{moduleData.module_number}</h4>
                <p>Module Identifier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button
          style={{
            display: "block",
            border: "none",
            outline: "none",
            padding: " 9px 16px 10px 18px",
            background: "#bcd8c1",
            color: "#121212",
            fontWeight: "500",
            marginBottom: "20px",
          }}
          type="button"
          onClick={handleBtnClick}
        >
          Go back
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleDetailsPage;
