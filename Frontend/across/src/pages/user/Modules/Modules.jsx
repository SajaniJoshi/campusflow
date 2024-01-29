import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import "./Modules.css";
import { getAllModules } from "../../../api/externalApi";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const showLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));

      setLoading(false);
    };

    showLoader();

    async function fetchModules() {
      try {
        const response = await getAllModules();

        if (response.status === 200 && response.statusText === "OK") {
          const shuffledModules = response.data.sort(() => Math.random() - 0.5);
          setModules(shuffledModules);
        } else {
          toast.error("We encountered an issue retrieving modules.");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchModules();
  }, []);

  const renderedModules = modules.map((module, index) => {
    return (
      <div key={index} className="moduleCard">
        <h2 className="moduleName">{module.module_name}</h2>
        <h4 className="moduleCreditPoints">
          Module Credits: {module.module_credit_points}
        </h4>
        <h4 className="moduleUniversityName">{module.belongs_to_university}</h4>
        <p>Course: {module.belongs_to_course}</p>
        <button type="button">More Details</button>
      </div>
    );
  });

  return (
    <>
      {loading && <Loader text="Modules" />}
      <MainLayout>
        {!loading && (
          <div className="modules">
            <h1>Modules</h1>
            <p
              style={{
                paddingLeft: "1.5rem",
                background: "#439a86",
                width: "50%",
                margin: "0 auto",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Total number of modules: {modules.length}
            </p>
            <div className="moduleCards">{renderedModules}</div>
          </div>
        )}
      </MainLayout>
    </>
  );
};

export default Modules;
