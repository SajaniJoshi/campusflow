import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import { Form, Col, Row, Container, Button, Modal } from "react-bootstrap";
import "../assets/css/FileUpload.css";
import { useNavigate } from "react-router-dom";
import { api, fetchDepartmentsData } from "../api/adminApi";
import { getUniversities } from "../api/compareModuleApi";

const PdfToRdf = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);

  const [formData, setFormData] = useState({
    courseName: "",
    belongsToUniversity: "",
    belongsToProgram: "",
    belongsToDepartment: "",
    hasLanguage: "",
  });

  const [departments, setDepartments] = useState([]);

  const [showModal, setShowModal] = useState(true);
  const [universityOptions, setUniversityOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUniversitiesData() {
      try {
        const response = await getUniversities();
        setUniversityOptions(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getUniversitiesData();
  }, []);

  useEffect(() => {
    async function getAllDepartments() {
      try {
        const response = await fetchDepartmentsData();
        const departments = response.data;
        const newDepartments = [...departments];
        newDepartments.splice(9, 0, { department: "Other" });
        setDepartments(newDepartments);

        if (response.status === 200 && response.statusText === "OK") {
        } else {
          toast.error("We encountered an issue retrieving departments.");
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAllDepartments();
  }, []);

  const handleUniversityChange = selectedUniversity => {
    // Find the selected university object based on its id
    const selectedUniversityObject = universityOptions.find(
      option => option.id === selectedUniversity
    );

    // Update formData with the selected university
    setFormData(prevData => ({
      ...prevData,
      belongsToUniversity: selectedUniversityObject["name"],
    }));
  };

  // GET COURSES FROM UNIVERSITIES IMPLEMENTED FUNCTION (FOR FUTURE USE)
  // const handleUniversityChange = async (selectedUniversityId) => {
  //     try {
  //         // Find the selected university object based on the id
  //         const selectedUniversity = universityOptions.find((option) => option.id === selectedUniversityId);
  //         // Create a new object with renamed keys
  //         const updatedSelectedUniversity = {
  //             universityId: selectedUniversity.id,
  //             universityName: selectedUniversity.name,
  //             universityUri: selectedUniversity.uri
  //         };
  //         // Update the state with the selected university
  //         setFormData((prevData) => ({
  //             ...prevData,
  //             belongsToUniversity: selectedUniversity,
  //             courseName: '',  // Reset courseName when university changes
  //         }));

  //         // Call your second API here based on the selected university
  //         const courseApiResponse = await axios.post('http://127.0.0.1:8000/courses/', updatedSelectedUniversity);

  //         // Handle the second API response as needed
  //         console.log(courseApiResponse.data);
  //     } catch (error) {
  //         console.error('Error:', error);
  //     }
  // };

  const handleCloseModal = () => {
    // Check if all required data is filled before closing modal
    if (
      formData.courseName &&
      formData.belongsToUniversity &&
      formData.belongsToProgram &&
      formData.belongsToDepartment &&
      formData.hasLanguage
    ) {
      setShowModal(false);
    } else {
      // Optionally, display a message to the user about the missing data
      alert("Please fill in all required fields before submitting.");
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onDrop = useCallback(
    async acceptedFiles => {
      try {
        const filesFormData = new FormData();

        acceptedFiles.forEach(file => {
          filesFormData.append("files", file);
        });

        // Create a JSON object with the required data
        const jsonData = {
          courseName: formData.courseName,
          belongsToUniversity: formData.belongsToUniversity,
          belongsToProgram: formData.belongsToProgram,
          belongsToDepartment: formData.belongsToDepartment,
          hasLanguage: formData.hasLanguage,
        };

        // Append JSON data to FormData
        filesFormData.append("jsonData", JSON.stringify(jsonData));

        const response = await api.post(
          "/pdf_To_rdf/api/pdfToRdf", filesFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
        );
        if (response.status == 200) {
          const filePath = response.data.rdf_File_Path;
          const universityName = response.data.university_name;
          const belongs_to_department = response.data.belongs_to_department;
          const course_name = response.data.course_name;
          const course_uri = response.data.course_uri;
          const belongs_to_program = response.data.belongs_to_program;
          const has_language = response.data.has_language;
          setTimeout(async () => {
            await localStorage.setItem("filePath", filePath);
            await localStorage.setItem("universityName", universityName);
            console.log("filePath", filePath, "universityName", universityName);
            navigate("/admin/automation", {
              state: {
                filePath,
                universityName,
                belongs_to_department,
                course_name,
                course_uri,
                belongs_to_program,
                has_language,
              },
            });
          }, 2000);
        }
        console.log("Upload response:", response.data);

        setUploadedFiles(acceptedFiles);
        setUploadStatus("Files uploaded successfully!");
      } catch (error) {
        console.error("Error uploading files:", error);
        setUploadStatus("Error uploading files. Please try again.");
      }
    },
    [formData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Container className="file-upload-container">
      <div className="instructions">
        <p className="instructions-font">
          This is utility to update or insert modules in RDF file using PDF
          files
        </p>
        <p className="instructions-font-subtext">How to use this utility</p>
        <ul>
          <li>
            Upload PDF files with modules you want to update or insert in RDF
            file.
          </li>
        </ul>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mandatory Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="belongsToUniversity">
                  <Form.Label>Belongs To University:</Form.Label>
                  <Form.Control
                    as="select"
                    name="belongsToUniversity"
                    value={
                      formData.belongsToUniversity
                        ? formData.belongsToUniversity.id
                        : ""
                    }
                    onChange={e => handleUniversityChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select University
                    </option>
                    {universityOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="courseName">
                  <Form.Label>Course Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="belongsToProgram">
                  <Form.Label>Course Belongs To Program:</Form.Label>
                  <Form.Control
                    type="text"
                    name="belongsToProgram"
                    value={formData.belongsToProgram}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="belongsToDepartment">
                  <Form.Label>Course Belongs To Department:</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleChange}
                    name="belongsToDepartment"
                  >
                    <option>Select Department</option>
                    {departments.map((dept, idx) => {
                      return (
                        <option key={idx} value={dept.department}>
                          {dept.department}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {formData.belongsToDepartment === "Other" && (
              <Row>
                <Col>
                  <Form.Group controlId="specifyDepartment">
                    <Form.Label>Specify your Department:</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <Form.Group controlId="hasLanguage">
                  <Form.Label>Has Language:</Form.Label>
                  <Form.Control
                    type="text"
                    name="hasLanguage"
                    value={formData.hasLanguage}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag 'n' drop University module files here, or click to select files
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="upload-info">
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map(file => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
          <div className="upload-status">
            <FiCheckCircle size={24} color="#4CAF50" />
            <p>{uploadStatus}</p>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PdfToRdf;
