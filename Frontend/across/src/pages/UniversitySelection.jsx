import React, { useEffect, useState } from "react";
import "../assets/css/UniversitySelection.css";
import { Form, InputGroup } from "react-bootstrap";
import { getUniversities } from "../api/compareModuleApi";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { storeUniversityName } from "../api/userApi";
import { useNavigate } from "react-router-dom";

const UniversitySelection = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const userEmail = auth.user.email;

  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [customUniversityName, setCustomUniversityName] = useState("");

  const handleUniversityChange = evt => {
    setSelectedUniversity(evt.target.value);
  };

  const handleCustomUniversityChange = evt => {
    setCustomUniversityName(evt.target.value);
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
  }, []);

  const handleSubmit = async () => {
    console.log("Submit Request Initiated");

    if (selectedUniversity === null) {
      return toast.error("You must choose one of the following options", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }

    if (selectedUniversity === "Other" && customUniversityName === "") {
      return toast.error("You must specify your university name..", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }

    var data;

    if (selectedUniversity === "Other" && customUniversityName !== null) {
      data = { selectedUniversity: customUniversityName, email: userEmail };
    } else {
      data = {
        selectedUniversity: selectedUniversity,
        email: userEmail,
      };
    }

    console.log(data);

    try {
      const response = await storeUniversityName(data);

      if (response.status === 200 && response.statusText === "OK") {
        setAuth({
          ...auth,
          user: {
            ...auth.user,
            university_name: response.data.user.university_name,
          },
        });

        if (auth.user.role === "USER") {
          navigate("/campus-flow/user/home");
        } else {
          navigate("/admin/home");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="universitySelection">
      <div className="universitySelection__wrapper">
        <h2 className="universitySelection__title">
          Please select among following universities
        </h2>
        <Form>
          <div className="mb-3">
            {universities.map((university, index) => {
              return (
                <>
                  <Form.Check
                    key={university.uri}
                    type="radio"
                    id={`check-api-radio-${index}`}
                  >
                    <Form.Check.Input
                      type="radio"
                      name="university"
                      value={university.name}
                      onChange={handleUniversityChange}
                      isValid
                    />
                    <Form.Check.Label>{university.name}</Form.Check.Label>
                  </Form.Check>
                </>
              );
            })}
            <Form.Check type="radio" id="check-api-radio-other">
              <Form.Check.Input
                type="radio"
                name="university"
                value="Other"
                onChange={handleUniversityChange}
                isValid
              />
              <Form.Check.Label>Other</Form.Check.Label>
            </Form.Check>
          </div>
        </Form>

        {selectedUniversity === "Other" && (
          <>
            <InputGroup style={{ width: "50%" }} className="mb-3">
              <InputGroup.Text>Your university name</InputGroup.Text>
              <Form.Control
                aria-label="University name"
                value={customUniversityName}
                onChange={handleCustomUniversityChange}
              />
            </InputGroup>
          </>
        )}
        <button className="universitySelection__button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        // transition={Zoom}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default UniversitySelection;
