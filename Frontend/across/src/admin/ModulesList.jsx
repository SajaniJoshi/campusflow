import React, { useState, useEffect } from "react";
import "../assets/css/ModuleList.css";
import Dropdown from "react-bootstrap/Dropdown";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import { api } from "../api/externalApi";

const ModulesList = () => {
  const [universities, setUniversities] = useState([]);
  const [universitiesForAdd, setUniversitiesAdd] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesAdd, setCoursesAdd] = useState([]);
  const [selectedUniversityUri, setSelectedUniversityUri] = useState(null);
  const [selectedUniversityName, setSelectedUniversityName] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseUri, setSelectedCourseUri] = useState(null);
  const [modules, setModules] = useState(null);
  const [loadingModule, setLoadingModules] = useState(-1);
  const [currentModule, setCurrentModule] = useState(null);
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [addUniversityUri, setAddUniversityUri] = useState("");
  const [addCourseUri, setAddCourseUri] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [modulePoints, setModulePoints] = useState("");
  const [moduleContent, setModuleContent] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);
  }, []);

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() == true) {
      setValidated(true);
      postAddData();
    }
  };

  const handleSubmitUpdate = event => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() == true) {
      postUpdateData();
      setValidated(true);
    }
  };

  const postAddData = () => {
    console.log(JSON.stringify({
      email: "dansari@gmail.com",
      university: addUniversityUri,
      course: addCourseUri,
      module_name: moduleName,
      module_number: moduleId,
      module_content: moduleContent,
      module_credit_points: modulePoints,
    }))
    api.post("/adminapp/insertModule", {
      method: "POST",
      body: JSON.stringify({
        email: "dansari@gmail.com",
        university: addUniversityUri,
        course: addCourseUri,
        module_name: moduleName,
        module_number: moduleId,
        module_content: moduleContent,
        module_credit_points: modulePoints,
      }),
    })
      .then(response => response.json())
      .then(json => {
        if (json.message == "Module Insertion successful.") {
          getModuleList(selectedCourseUri, selectedCourse);
          toast("Module Added Successfully");
        } else {
          toast("Failed to add module");
        }
        handleCloseAddModal();
      })
      .catch(error => console.error(error));
  };

  const postUpdateData = () => {
    console.log({
      email: "dansari@gmail.com",
      university: selectedUniversityName,
      course: selectedCourse,
      module_name: currentModule.moduleName,
      module_number: currentModule.moduleNumber,
      module_content: currentModule.moduleContent,
      module_credit_points: currentModule.moduleCreditPoints,
      module_uri: currentModule.moduleUri,
    });
    api.post("adminapp/updateModule", {
      body: JSON.stringify({
        email: "dansari@gmail.com",
        university: selectedUniversityName,
        course: selectedCourse,
        module_name:
          moduleName.length == 0 ? currentModule.moduleName : moduleName,
        module_number:
          moduleId.length == 0 ? currentModule.moduleNumber : moduleId,
        module_content:
          moduleContent.length == 0
            ? currentModule.moduleContent.replace("\n", "\\n")
            : moduleContent,
        module_credit_points:
          modulePoints.length == 0
            ? currentModule.moduleCreditPoints
            : modulePoints,
        module_uri: currentModule.moduleUri,
      }),
    })
      .then(response => response.json())
      .then(json => {
        if (json.message == "Module Updation successful.") {
          getModuleList(selectedCourseUri, selectedCourse);
          toast("Module Updated Successfully");
        } else {
          toast("Failed to update module");
        }
        handleCloseUpdateModal();
      })
      .catch(error => console.error(error));
  };

  const deleteModule = uri => {
    api.post("/adminapp/deleteModule", {
      
      body: JSON.stringify({
        email: "dansari@gmail.com",
        module_uri: uri,
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.message == "Module deletion successful.") {
          setModules(modules =>
            modules.filter(item => {
              return item.moduleUri !== uri;
            })
          );
          toast("Module Deleted Successfully");
        } else {
          toast("Failed to delete module");
        }
      })
      .catch(error => console.error(error));
  };

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = module => {
    setCurrentModule(module);
    setShow(true);
  };

  const handleShowUpdate = module => {
    console.log(JSON.stringify(module));
    setCurrentModule(module);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    api.get("adminapp/universitieslist")
      .then(response => response.json())
      .then(json => {
        setUniversities(json);
        setUniversitiesAdd(json);
      })
      .catch(error => console.error(error));
  }, []);

  const onClickUniversity = item => {
    getCoursesList(item.uri, item.name, false);
  };

  const onClickCourse = item => {
    setSelectedCourse(item.courseName);
    setSelectedCourseUri(item.courseUri);
    setLoadingModules(1);
    getModuleList(item.courseUri, item.courseName);
  };

  const onClickUniversityAdd = item => {
    getCoursesList(item.uri, item.name, true);
    setAddUniversityUri(item.name);
  };

  const onClickCourseAdd = item => {
    setSelectedCourse(item.courseName);
    setAddCourseUri(item.courseName);
  };

  const getModuleList = (uri, name) => {
    api.post("/modules/", {
      body: JSON.stringify({
        universityUri: selectedUniversityUri,
        courseUri: uri,
        courseName: name,
      }),
    })
      .then(response => response.json())
      .then(json => {
        setModules(json.modules);
        setLoadingModules(0);
      })
      .catch(error => console.error(error));
  };

  const getCoursesList = (uri, name, isAdd) => {
    api.post("/courses/", {
      body: JSON.stringify({
        universityUri: uri,
        universityName: name,
      }),
    })
      .then(response => response.json())
      .then(json => {
        if (!isAdd) {
          setCourses(json.courses);
        } else {
          setCoursesAdd(json.courses);
        }
        setSelectedUniversityUri(uri);
        setSelectedUniversityName(name);
      })
      .catch(error => console.error(error));
  };

  const getAddModuleFormModal = () => {
    return (
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dropdowns">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedUniversityName
                  ? selectedUniversityName
                  : "Select Univeristy"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {universitiesForAdd?.map(item => (
                  <Dropdown.Item
                    onClick={() => onClickUniversityAdd(item)}
                    key={item.id}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {universitiesForAdd.length > 0 && selectedUniversityUri && (
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedCourse ? selectedCourse : "Select Course"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {coursesAdd?.map(item => (
                    <Dropdown.Item
                      key={item.courseNumber}
                      onClick={() => onClickCourseAdd(item)}
                    >
                      {item.courseName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          <Form noValidate validated={validated} name="addForm">
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="addForm.id">
                <Form.Label>Id/Number</Form.Label>
                <Form.Control
                  onChange={event => setModuleId(event.target.value)}
                  name="id"
                  required
                  type="text"
                  placeholder="Module Id"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="addForm.name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={event => setModuleName(event.target.value)}
                  name="name"
                  required
                  type="text"
                  placeholder="Module Name"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="addForm.points">
                <Form.Label>Credit Points</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Credit Points"
                  required
                  name="points"
                  onChange={event => setModulePoints(event.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide Credit Points
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="addForm.content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                onChange={event => setModuleContent(event.target.value)}
                name="content"
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Button onClick={handleSubmit} type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const getUpdateModuleFormModal = () => {
    return (
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dropdowns">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {selectedUniversityName
                  ? selectedUniversityName
                  : "Select Univeristy"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {universitiesForAdd?.map(item => (
                  <Dropdown.Item
                    onClick={() => onClickUniversityAdd(item)}
                    key={item.id}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {universitiesForAdd.length > 0 && selectedUniversityUri && (
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedCourse ? selectedCourse : "Select Course"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {coursesAdd?.map(item => (
                    <Dropdown.Item
                      key={item.courseNumber}
                      onClick={() => onClickCourseAdd(item)}
                    >
                      {item.courseName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          <Form noValidate validated={validated} name="updateForm">
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="updateForm.id">
                <Form.Label>Id/Number</Form.Label>
                <Form.Control
                  defaultValue={currentModule?.moduleNumber}
                  onChange={event => setModuleId(event.target.value)}
                  name="id"
                  required
                  type="text"
                  placeholder="Module Id"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="updateForm.name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  defaultValue={currentModule?.moduleName}
                  onChange={event => setModuleName(event.target.value)}
                  name="name"
                  required
                  type="text"
                  placeholder="Module Name"
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="updateForm.points">
                <Form.Label>Credit Points</Form.Label>
                <Form.Control
                  defaultValue={currentModule?.moduleCreditPoints}
                  type="text"
                  placeholder="Credit Points"
                  required
                  name="points"
                  onChange={event => setModulePoints(event.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide Credit Points
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="updateForm.content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                defaultValue={currentModule?.moduleContent}
                onChange={event => setModuleContent(event.target.value)}
                name="content"
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Button onClick={handleSubmitUpdate} type="submit">
              Update Module
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  const getModuleDetailsModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Module Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {" "}
            <Badge bg="secondary">Number</Badge> {currentModule?.moduleNumber}
          </p>
          <p>
            <Badge bg="secondary">Name</Badge> {currentModule?.moduleName}
          </p>
          <p>
            <Badge bg="secondary">Uri</Badge> {currentModule?.moduleUri}
          </p>
          <p>
            <Badge bg="secondary">Credit Points</Badge>{" "}
            {currentModule?.moduleCreditPoints}
          </p>
          <p>{currentModule?.moduleContent}</p>
        </Modal.Body>
      </Modal>
    );
  };
  return (
    <div style={{ flex: 1 }}>
      <AdminNavbar />
      <ToastContainer />
      {getModuleDetailsModal()}
      {getAddModuleFormModal()}
      {getUpdateModuleFormModal()}

      <p id="moduleHeading">Modules Table</p>
      <div className="dropdowns">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Select Univeristy
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {universities?.map(item => (
              <Dropdown.Item
                onClick={() => onClickUniversity(item)}
                key={item.id}
              >
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {universities.length > 0 && selectedUniversityUri && (
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Course
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {courses?.map(item => (
                <Dropdown.Item
                  key={item.courseNumber}
                  onClick={() => onClickCourse(item)}
                >
                  {item.courseName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <Button variant="primary" onClick={() => handleShowAddModal()}>
          Add New Module
        </Button>
      </div>
      {loadingModule == 0 && modules?.length > 0 && (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Module Name</th>
                <th>Module Uri</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(module => {
                return (
                  <tr key={module.moduleNumber}>
                    <td>{module.moduleNumber}</td>
                    <td>{module.moduleName}</td>
                    <td>{module.moduleUri}</td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button
                          onClick={() => handleShow(module)}
                          variant="info"
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => handleShowUpdate(module)}
                          variant="warning"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => deleteModule(module.moduleUri)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      {loadingModule == 0 && loadingModule != -1 && (
        <div className="spinner">
          <Spinner animation="grow" variant="success" />
        </div>
      )}
    </div>
  );
};

export default ModulesList;
