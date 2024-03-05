import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import { useAuth } from "../../../context/AuthContext";
import "./MyProfile.css";
import Gravatar from "../../../components/Gravatar/Gravatar";
import { Tab, Tabs, Form } from "react-bootstrap";

import {
  getCompletedModules,
  getUniversityUri,
  saveCompletedModules,
} from "../../../api/externalApi";
import Dropdown from "../../../components/Dropdown/Dropdown";
import {
  getCoursesOfParticularUniversity,
  getModulesOfCourse,
} from "../../../api/compareModuleApi";
import { ToastContainer, toast } from "react-toastify";

const MyProfile = () => {
  const [auth] = useAuth();
  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [activeTab, setActiveTab] = useState("profileDetails");

  const handleCourseChange = course => {
    setSelectedCourse(course);
  };

  const handleModuleCheckboxChange = module => {
    const isSelected = selectedModules.some(
      selectedModule => selectedModule.moduleUri === module.moduleUri
    );

    if (isSelected) {
      setSelectedModules(prevModules =>
        prevModules.filter(
          selectedModule => selectedModule.moduleUri !== module.moduleUri
        )
      );
    } else {
      setSelectedModules(prevModules => [...prevModules, module]);
    }
  };

  const handleSubmission = async () => {
    if (!selectedModules.length) {
      alert("Please select at least one module before submitting.");
      return;
    }

    try {
      const email = auth.user.email;
      const universityName = university.university_name;
      const courseName = selectedCourse.label;

      const completedModulesList = selectedModules.map(module => ({
        moduleUri: module.moduleUri,
        moduleName: module.moduleName,
        moduleCreditPoints: module.moduleCreditPoints,
      }));

      const requestData = {
        email,
        universityName,
        courseName,
        completedModulesList,
      };

      const response = await saveCompletedModules(requestData);
      console.log(response);
      if (response.status === 200 && response.statusText === "OK") {
        toast.success("Modules submitted successfully");
        setCompletedModules(response.data.data);
        setSelectedCourse(null);
        setActiveTab("profileDetails");
      } else {
        alert("Failed to submit modules. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting modules", error);
      alert("An error occurred while submitting modules. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchCompletedModules() {
      try {
        const response = await getCompletedModules({ email: auth.user.email });
        if (response.status === 200 && response.statusText === "OK") {
          setCompletedModules(
            response.data.user_profile_data.completed_modules
          );
        } else {
          console.log("error retrieving completed modules");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchCompletedModules();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const universityResponse = await getUniversityUri({
          university_name: auth.user.university_name,
        });

        if (
          universityResponse.status === 200 &&
          universityResponse.statusText === "OK"
        ) {
          setUniversity(universityResponse.data.universityDetails);

          const universityName =
            universityResponse.data.universityDetails.university_name;
          const universityUri =
            universityResponse.data.universityDetails.university_uri;

          const coursesResponse = await getCoursesOfParticularUniversity({
            universityName,
            universityUri,
          });

          console.log(coursesResponse);

          if (
            coursesResponse.status === 200 &&
            coursesResponse.statusText === "OK"
          ) {
            setCourses(coursesResponse.data.courses);
          } else {
            console.error("Error fetching courses");
          }
        } else {
          console.error("Error retrieving university");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();

    if (university !== null && selectedCourse !== null) {
      fetchModulesOfCourse();
    }
  }, [auth.user.university_name, selectedCourse]);

  const dropdownOptionsForCourses = courses.map(course => ({
    id: course.courseNumber,
    value: course.courseUri,
    label: course.courseName,
  }));

  const fetchModulesOfCourse = async () => {
    try {
      const courseUri = selectedCourse.value;
      const universityUri = university.university_uri;
      const courseName = selectedCourse.label;

      const data = { courseUri, universityUri, courseName };

      const retrievedModules = await getModulesOfCourse(data);
      setModules(retrievedModules.data.modules);
    } catch (error) {
      console.log("error fetching modules");
    }
  };

  const totalCreditsEarned = completedModules.reduce((sum, cm) => {
    const creditPoints = Number(cm.moduleCreditPoints);
    return sum + creditPoints;
  }, 0);

  return (
    <>
      <MainLayout>
        <div className="myProfile">
          <Tabs
            activeKey={activeTab}
            onSelect={key => setActiveTab(key)}
            id="myProfile-tab"
            className="mb-3"
          >
            <Tab eventKey="profileDetails" title="Profile Details">
              <div className="myProfile__contents">
                <div className="myProfile__userDetails">
                  <div>
                    <Gravatar fullName={auth.user.full_name} size={80} />
                  </div>

                  <h4
                    style={{
                      padding: "0.5rem 0",
                      margin: "0.5rem 0",
                      textAlign: "center",
                    }}
                  >
                    {auth.user.full_name}
                  </h4>
                  <div className="myProfile__dataList">
                    <div className="myProfile__emailGroup">
                      <h4>Email</h4>
                      <p>{auth.user.email}</p>
                    </div>
                    <div className="myProfile__roleGroup">
                      <h4>Current Role</h4>
                      <p>{auth.user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="optedCourses">
                  <h4>Completed Modules List</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Modules</th>
                        <th>Credits Earned</th>
                      </tr>
                    </thead>
                    {completedModules.length > 0 &&
                      completedModules.map((cmodule, idx) => {
                        return (
                          <tbody key={idx}>
                            <tr>
                              <td>{cmodule.moduleName}</td>
                              <td>{cmodule.moduleCreditPoints}</td>
                            </tr>
                          </tbody>
                        );
                      })}
                    <tbody>
                      <tr>
                        <td>
                          <strong>Total Credits Earned</strong>
                        </td>

                        <td>
                          <strong>{totalCreditsEarned}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab>
            <Tab eventKey="profile" title="Academic Data">
              <div className="myProfile__dropdownWrapper">
                <h2>Your University: {auth.user.university_name}</h2>
                <h4>Select one of the Courses Offered by your university</h4>
                <Dropdown
                  options={dropdownOptionsForCourses}
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  placeholderText="Select your course..."
                />
              </div>
              <div className="myProfile__tableWrapper">
                {selectedCourse && (
                  <>
                    <h2 className="text-center m-3">
                      List of modules offered in the {selectedCourse.label}{" "}
                      department
                    </h2>
                    <small
                      style={{ display: "block", padding: "15px 0 !important" }}
                    >
                      Choose the modules you have completed in your course.
                    </small>
                    <table className="cmoduleList__table">
                      <thead>
                        <tr>
                          <th>Module Number</th>
                          <th>Module Name</th>
                          <th>Credits Points</th>
                          <th>Selection</th>
                        </tr>
                      </thead>

                      {modules &&
                        modules.map((module, idx) => {
                          return (
                            <tbody className="cmodulesList" key={idx}>
                              <tr className="cmoduleRow">
                                <td>{module.moduleNumber}</td>
                                <td>{module.moduleName}</td>
                                <td>{module.moduleCreditPoints}</td>
                                <td>
                                  <Form.Check>
                                    <Form.Check.Input
                                      type="checkbox"
                                      onChange={() =>
                                        handleModuleCheckboxChange(module)
                                      }
                                      checked={selectedModules.some(
                                        selectedModule =>
                                          selectedModule.moduleUri ===
                                          module.moduleUri
                                      )}
                                      isValid
                                    />
                                  </Form.Check>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                    </table>
                    <button
                      type="button"
                      className="moduleSubmissionBtn"
                      onClick={() => handleSubmission()}
                    >
                      Submit Selected Modules
                    </button>
                  </>
                )}
              </div>
            </Tab>
          </Tabs>

          <ToastContainer />
        </div>
      </MainLayout>
    </>
  );
};

export default MyProfile;
