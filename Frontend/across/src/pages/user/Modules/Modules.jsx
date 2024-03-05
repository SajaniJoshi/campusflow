import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import "./Modules.css";
import {
  getAllModules,
  getSearchedModules,
  getModuleDetails,
} from "../../../api/externalApi";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import SearchBox from "../../../components/user/SearchBox/SearchBox";
import { useNavigate } from "react-router-dom";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const toggleView = () => {
    setIsGridView(prevState => !prevState);
  };

  function getFirstNCharacters(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  useEffect(() => {
    const showLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));

      setLoading(false);
    };

    showLoader();

    async function fetchModules() {
      try {
        const response = searchTerm
          ? await getSearchedModules(searchTerm)
          : await getAllModules();
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
  }, [searchTerm]);

  const handleModuleDetails = async moduleUri => {
    try {
      const response = await getModuleDetails(moduleUri);
      if (response.status === 200 && response.statusText === "OK") {
        const moduleId = response.data[0].module_uri.split("#")[1];
        navigate(`/campus-flow/user/modules/${moduleId}`, {
          state: { moduleData: response.data[0] },
        });
      } else {
        toast.error("Failed to retrieve module details.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching module details.");
    }
  };

  const renderedModulesInGridView = modules.map((module, index) => {
    return (
      <div key={index} className="moduleCard">
        <h2 className="moduleName">{module.module_name}</h2>
        <br />
        <h4 className="moduleCreditPoints">
          Module Credits: {module.module_credit_points}
        </h4>
        <h4 className="moduleUniversityName">{module.belongs_to_university}</h4>
        <button
          type="button"
          onClick={() => handleModuleDetails(module.module_uri)}
        >
          More Details
        </button>
      </div>
    );
  });

  const renderedModulesInListView = modules.map((module, idx) => {
    return (
      <div key={idx} style={{ borderRadius: "25px", marginBottom: "15px" }}>
        <section className="list-group-item listItems">
          <h2 className="moduleName">{module.module_name}</h2>
          <h4 className="moduleCreditPoints">
            Module Credits: {module.module_credit_points}
          </h4>
          <h4 className="moduleUniversityName">
            {module.belongs_to_university}
          </h4>
          <p>
            Module Contents: {getFirstNCharacters(module?.module_content, 200)}
          </p>

          <button
            type="button"
            onClick={() => handleModuleDetails(module.module_uri)}
          >
            More Details
          </button>
        </section>
      </div>
    );
  });

  return (
    <>
      {loading && <Loader text="Modules" />}
      <MainLayout>
        {!loading && (
          <div className="modules">
            <h1>Modules Offered by Universities</h1>
            <div className="filterSectionContents">
              <SearchBox
                placeholderText="Search Modules"
                setSearchTerm={setSearchTerm}
              />
              <div className="viewIcons">
                <span>Change View</span>
                {isGridView ? (
                  <div className="gridViewIcon" onClick={toggleView}>
                    <svg
                      style={{ width: "20px" }}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                    >
                      <g fill="currentColor" fillRule="nonzero">
                        <path d="M8 0H0v8h8V0zM7 1v6H1V1h6zM8 12H0v8h8v-8zm-1 1v6H1v-6h6zM20 0h-8v8h8V0zm-1 1v6h-6V1h6zM20 12h-8v8h8v-8zm-1 1v6h-6v-6h6z"></path>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <div className="listViewIcon" onClick={toggleView}>
                    <svg
                      style={{ width: "20px" }}
                      width="20"
                      height="19"
                      viewBox="0 0 20 19"
                    >
                      <g fill="currentColor" fillRule="evenodd">
                        <path d="M0 6h20v1H0zM0 0h20v1H0zM0 12h20v1H0zM0 18h20v1H0z"></path>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <p style={{ textAlign: "center" }}>
              Total number of modules: {modules.length}
            </p>
            {isGridView ? (
              <div className="moduleCards">{renderedModulesInGridView}</div>
            ) : (
              <div style={{ marginBottom: "20px", width: "100%" }}>
                <ul className="list-group">{renderedModulesInListView}</ul>
              </div>
            )}
          </div>
        )}
      </MainLayout>
    </>
  );
};

export default Modules;
