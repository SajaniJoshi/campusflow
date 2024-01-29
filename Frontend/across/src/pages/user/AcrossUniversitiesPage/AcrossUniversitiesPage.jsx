import React from "react";
import "./AcrossUniversitiesPage.css";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import SearchBox from "../../../components/user/SearchBox/SearchBox";

import { AcrossUniversitiesData } from "./AcrossUniversitiesData";
import { NavLink } from "react-router-dom";

const AcrossUniversitiesPage = () => {
  return (
    <>
      <MainLayout>
        {/* <SearchBox /> */}
        <div className="across-universities">
          <h1>Across Universities</h1>
          <div className="universitiesWrapper">
            {AcrossUniversitiesData.map((val, key) => {
              return (
                <NavLink
                  to={val.universityUrl}
                  target="_blank"
                  className="university"
                  key={key}
                >
                  <h4 className="university-name">{val.universityName}</h4>
                  <div className="university-photo">
                    <img src={val.universityImage} alt="university in europe" />
                  </div>
                  <smalll className="university-location">
                    {val.universityLocation}
                  </smalll>
                </NavLink>
              );
            })}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default AcrossUniversitiesPage;
