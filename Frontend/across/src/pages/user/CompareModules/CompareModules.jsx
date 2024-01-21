import React, { useEffect, useState } from "react";
import "./CompareModules.css";
import MainLayout from "../../../components/user/MainLayout/MainLayout";

import Dropdown from "../../../components/Dropdown/Dropdown";

import SearchBox from "../../../components/user/SearchBox/SearchBox";
import {
  getCoursesOfParticularUniversity,
  getModulesOfCourse,
  getSimilarModules,
  getUniversities,
} from "../../../api/compareModuleApi";

const CompareModules = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [similarModules, setSimilarModules] = useState([]);

  const handleUniversityChange = university => {
    setSelectedUniversity(university);
    setSelectedCourse(null);
    setSelectedModule(null);
    setModules([]);
  };

  const handleCourseChange = course => {
    setSelectedCourse(course);
    setSelectedModule(null);
  };

  const handleModuleChange = module => {
    setSelectedModule(module);
  };

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const retrievedUniversities = await getUniversities();
        if (
          retrievedUniversities.status === 200 &&
          retrievedUniversities.statusText === "OK"
        ) {
          setUniversities(retrievedUniversities.data);
        }
      } catch (error) {
        console.log("error fetching universities");
      }
    }

    fetchUniversities();

    if (selectedUniversity !== null) {
      fetchCoursesOfUniversity();
    }

    if (selectedUniversity !== null && selectedCourse !== null) {
      fetchModulesOfCourse();
    }

    if (selectedModule !== null) {
      fetchSimilarModules();
    }
  }, [selectedUniversity, selectedCourse, selectedModule]);

  const dropdownOptionsForUniversities = universities.map(university => ({
    id: university.id,
    value: university.uri,
    label: university.name,
  }));

  const fetchCoursesOfUniversity = async () => {
    try {
      const universityName = selectedUniversity.label;
      const universityUri = selectedUniversity.value;

      const data = { universityName, universityUri };

      const retrievedCourses = await getCoursesOfParticularUniversity(data);
      setCourses(retrievedCourses.data.courses);
    } catch (error) {
      console.log("error fetching courses");
    }
  };

  const dropdownOptionsForCourses = courses.map(course => ({
    id: course.courseNumber,
    value: course.courseUri,
    label: course.courseName,
  }));

  const fetchModulesOfCourse = async () => {
    try {
      const courseUri = selectedCourse.value;
      const universityUri = selectedUniversity.value;
      const courseName = selectedCourse.label;

      const data = { courseUri, universityUri, courseName };

      const retrievedModules = await getModulesOfCourse(data);
      setModules(retrievedModules.data.modules);
    } catch (error) {
      console.log("error fetching modules");
    }
  };

  const dropdownOptionsForModules = modules.map(module => ({
    id: module.moduleNumber,
    label: module.moduleName,
    value: module.moduleUri,
  }));

  const fetchSimilarModules = async () => {
    try {
      const moduleUri = selectedModule.value;

      const retrievedSimilarModules = await getSimilarModules(moduleUri);

      console.log(retrievedSimilarModules.data.modules);

      setSimilarModules(retrievedSimilarModules.data.modules);
    } catch (error) {
      console.log("error fetching similar modules");
    }
  };

  const renderedSimilarModules = similarModules.map(similarModule => {
    const contentHighlights = similarModule.similarModuleContent.split(". ");

    const contents = contentHighlights.map((indContent, index) => (
      <ul type="circle" key={index} className="similarModuleContent text-sm">
        <li>{indContent}</li>
      </ul>
    ));
    return (
      <div className="similarModuleCard">
        <div className="similarModuleName text-lg">
          {similarModule.similarModuleName}
        </div>
        <div className="similarModuleUniversity text-base">
          {similarModule.similarUniversity}
        </div>
        <div style={{ textAlign: "left" }}>{contents}</div>
      </div>
    );
  });

  return (
    <>
      <MainLayout>
        <SearchBox />
        <h1 className="compareModules__heading">Compare Modules Page</h1>
        <div className="compareModulesWrapper">
          <h4>Universities</h4>
          <Dropdown
            options={dropdownOptionsForUniversities}
            value={selectedUniversity}
            onChange={handleUniversityChange}
            placeholderText="Select your university..."
          />
        </div>
        <div className="compareModulesWrapper">
          <h4>Courses</h4>
          <Dropdown
            options={dropdownOptionsForCourses}
            value={selectedCourse}
            onChange={handleCourseChange}
            placeholderText="Select your course..."
          />
        </div>
        <div className="compareModulesWrapper">
          <h4>Modules</h4>
          <Dropdown
            options={dropdownOptionsForModules}
            value={selectedModule}
            onChange={handleModuleChange}
            placeholderText="Select your module..."
          />
        </div>
        <div className="similarModuleCards">{renderedSimilarModules}</div>
        <div style={{ marginTop: "190px" }}></div>
      </MainLayout>
    </>
  );
};

export default CompareModules;
