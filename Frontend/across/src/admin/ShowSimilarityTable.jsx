import React, { useState, useEffect } from "react";
import data_static from "../components/data";
import "../assets/css/ShowModules.css";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import { listSimilarModules } from "../api/adminApi";

const ShowSimilarityTable = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getSimilarModules() {
      const response = await listSimilarModules();
      setData(response.data);
    }
    getSimilarModules();
  }, []);

  return (
    <div style={{ flex: 1 }}>
      <AdminNavbar />
      <p id="moduleHeading">Similarity Table</p>
      {data?.map(item => {
        return (
          <div id="module" key={item.id} style={{ margin: "25px", padding: "10px" }}>
            <div id="moduleid">
              {item.id} - {item.name}
            </div>
            <div id="creditPoints">Credit Points : {item.creditPoints}</div>
            <div id="creditPoints">University : {item.university}</div>
            <div id="creditPoints">Course : {item.courseName}</div>
            <div>{item.content}</div>
            <div id="moduleid">
              {item.similarModuleId} - {item.similarModuleName}
            </div>
            <div id="creditPoints">
              Credit Points : {item.similarModuleCreditPoints}
            </div>
            <div id="creditPoints">University : {item.similarUniversity}</div>
            <div id="creditPoints">Course : {item.courseNameSimilar}</div>
            <div>{item.similarModuleContent}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowSimilarityTable;