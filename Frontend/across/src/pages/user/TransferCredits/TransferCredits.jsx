import React, { useEffect, useState, useCallback } from "react";
import "./TransferCredits.css";
import axios from "axios";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import Lottie from "react-lottie";
import loadingData from "../../../assets/lotties/loading_transfer_v0.json";
import loadingDataV1 from "../../../assets/lotties/loading_transfer_v1.json";
import germany from "../../../assets/lotties/germany_flag.json";
import poland from "../../../assets/lotties/poland_flag.json";
import verified from "../../../assets/lotties/verified.json";
import scanning from "../../../assets/lotties/verifying.json";
import unverified from "../../../assets/lotties/vfailed.json";
import arrow from "../../../assets/lotties/arrow_down.json";
import women from "../../../assets/lotties/women.json";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { api } from "../../../api/adminApi";

const NMAX_BU = 5
const NMIN_BU = 2

const NMAX_TU = 1
const NMIN_TU = 5

const TransferCredits = () => {
  const [universities, setUniversities] = useState([]);
  const [usersCompleteModules, setUsersCompletedModules] = useState([]);
  const [univerisitiesLoading, setUniversitiesLoading] = useState(true);
  const [usersModulesLoading, setusersModulesLoading] = useState(false);
  const [similarModulesLoading, setsimilarModulesLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [similarModules, setSimilarModules] = useState([]); //
  const [selectedUniversity, setSelectedUniverity] = useState(null);
  const [total, setTotal] = useState(0);
  const [lastSelectedModule, setLastSelectedModule] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userData, setUserData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(-1);
  const [transcript, setTranscript] = useState();
  const [grades, setGrades] = useState();
  const [verification, setVerification] = useState(-1);
  const [newGrades, setNewGrads] = useState([])
  const [accept, setAccepted] = React.useState(false);
  const [signature, setSignature] = useState()
  const [base64Signature, setBase64Signature] = useState()

  const buttonStyle = {
    background: "#439a86",
    borderRadius: "10px",
    color: "white",
    width: "70px",
  };

  useEffect(() => {
    api
      .get("/adminapp/universitieslist")
      .then((response) => {
        if (response.status == 200) {
          const returnedData = response.data;
          returnedData.forEach((item) => {
            item.selected = false;
          });
          setUniversities(returnedData);
        }
        setUniversitiesLoading(false);
      })
      .catch((error) => {
        setUniversitiesLoading(false);
      });
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("auth"));
    setUserData(data?.user);
  }, []);

  const calculateNewGrade = (value) => {
    let newGrade = 0
    if (selectedUniversity.id == 2) {
      newGrade = (((NMAX_BU - value) / (NMAX_BU - NMIN_BU)) * 3) + 1
    } else {
      newGrade = (((NMAX_TU + value) * (NMAX_TU + NMIN_TU)) / 3) - 1
    }
    return newGrade
  }

  const handleAccept = () => {
    setAccepted(!accept);
  };

  const handleChange = async (event) => {
    setTranscript(event.target.files[0]);
    setUploadStatus(1);
    try {
      const formData = new FormData();
      formData.append("files", event.target.files[0]);
      const selectedModules = usersCompleteModules.filter(
        (item) => item.selected
      );
      const moduleNameArray = [];
      selectedModules.forEach((module) => {
        moduleNameArray.push(module.moduleName);
      });
      formData.append("data", JSON.stringify({ modules: moduleNameArray }));
      const response = await api.post(
        "/user/verifyTranscript", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
      );
      if (response.status == 200) {
        const grades = response.data.grades_modules;

        setGrades(grades);
        for (let i = 0; i < grades.length; i++) {
          if (grades[i].grade >= 5) {
            setVerification(0);
            break;
          } else {
            setVerification(1);
          }
        }
        const list = []
        for (let i = 0; i < grades.length; i++) {
          const newGradeValue = {
            name: grades[i].name,
            newGrade: calculateNewGrade(grades[i].grade)
          }
          list.push(newGradeValue)
        }
        setNewGrads(list)
        selectedModules.forEach((module) => {
          const found = grades.find((item) => item.name == module.moduleName)
          if (!found) {
            setVerification(0)
          }


        });
        setUploadStatus(2);
      } else {
        setUploadStatus(0);
      }

    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Error uploading files. Please try again.");
    }
  };

  const handleSignature = async (event) => {
    setSignature(URL.createObjectURL(event.target.files[0]));
    const base64 = await convertBase64(event.target.files[0])
    setBase64Signature(base64)

  };
  const getUsersCompletedModules = () => {
    const data = { email: userData?.email };
    api
      .post("/user/fetchCompletedModulesofUser", data)
      .then((response) => {
        if (response.status == 200) {
          const returnedData =
            response.data.user_profile_data.completed_modules;
          returnedData.forEach((item) => {
            item.selected = false;
          });
          setUsersCompletedModules(returnedData);
        }
        setTimeout(() => {
          setusersModulesLoading(false);
        }, 3000);
      })
      .catch((error) => {
        setusersModulesLoading(false);
      });
  };

  const getSimilarAgainst = () => {
    const selectedModules = usersCompleteModules.filter(
      (item) => item.selected
    );
    //"http://tuc.web.engineering/module#CWEA"
    const list = [];
    let numberTotal = 0;
    selectedModules?.forEach((selected) => {
      api
        .get(
          "/modules/similarModules?moduleUri=" +
          encodeURIComponent(selected.moduleUri)
        )
        .then((response) => {
          if (response.status == 200) {
            list.push(response.data.modules);
            const calculateTotal = response.data.modules;
            calculateTotal.forEach((item) => {
              numberTotal =
                numberTotal + parseInt(item.similarModuleCreditPoints);
            });
            setSimilarModules([...similarModules, ...list]);
          }
        })
        .catch((error) => {
          if (error.response.status == 404) {
            const noContent = {
              nothing: true,
              module: selected.moduleName,
            };
            setSimilarModules(...similarModules, ...noContent);
          }
        });
    });

    setTimeout(() => {
      setTotal(total + numberTotal);
      setsimilarModulesLoading(false);
    }, 3000);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const saveData = () => {
    const transferCreditsRequestList = [];
    similarModules.forEach((item) => {
      item.forEach((value) => {
        console.log(value);
        const innerObject = {
          fromModule: [
            {
              moduleUri: value.moduleUri,
              moduleName: value.name,
              moduleId: value.id,
              credits: value.creditPoints,
            },
          ],
          toModule: [
            {
              moduleUri: value.similarModuleUri,
              moduleName: value.similarModuleName,
              moduleId: value.similarModuleId,
              credits: value.similarModuleCreditPoints,
            },
          ],
          status: "PENDING",
          createdAt: new Date().toISOString()
        }
        transferCreditsRequestList.push(innerObject)
      })
    })
    const data = {
      email: userData?.email,
      transferCreditsRequest: transferCreditsRequestList,
      possibleTransferrableCredits: total,
      signature: base64Signature
    };
    console.log(data);
    api
      .post(
        "/transferCredits/saveTransferCreditsofUser",
        data
      )
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          setSaveLoading(false);
        }
      })
      .catch((error) => { });
  };

  const defaultOptionsArrow = {
    loop: true,
    autoplay: true,
    animationData: arrow,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsWomen = {
    loop: true,
    autoplay: true,
    animationData: women,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsScanning = {
    loop: true,
    autoplay: true,
    animationData: scanning,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsVerified = {
    loop: true,
    autoplay: true,
    animationData: verified,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsUnVerified = {
    loop: true,
    autoplay: true,
    animationData: unverified,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingDataV1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const onPressUniversityItem = (item) => {
    const updateList = [];
    universities.forEach((unis) => {
      unis.selected = item.id == unis.id ? true : false;
      updateList.push(unis);
    });
    setUniversities(updateList);
    setSelectedUniverity(item);
  };
  const onPressCompletedModuleItem = (item) => {
    const updateList = [];
    usersCompleteModules.forEach((module) => {
      module.selected =
        item.moduleUri == module.moduleUri ? !module.selected : module.selected;
      updateList.push(module);
    });
    setUsersCompletedModules(updateList);
    setLastSelectedModule(item);
  };
  const getFlagOptions = (id) => {
    if (id == 1) {
      return {
        loop: true,
        autoplay: true,
        animationData: germany,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    } else if (id == 2) {
      return {
        loop: true,
        autoplay: true,
        animationData: poland,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    }
  };
  const onPressNextTransition = (event) => {
    setCurrentIndex(event.currentIndex);
    if (event.currentIndex == 2) {
      setusersModulesLoading(true);
      getUsersCompletedModules();
    } else if (event.currentIndex == 4) {
      setsimilarModulesLoading(true);
      getSimilarAgainst();
    } else if (event.currentIndex == 7) {
      setSaveLoading(true);
      saveData();
    }
  };

  const getNextButtonText = () => {
    if (currentIndex == 0) {
      return "Proceed"
    } else {
      return "Next"
    }
  }

  const getNextButton = () => {
    if (currentIndex == 0 && accept) {
      return <button style={buttonStyle}>{getNextButtonText()}</button>
    } else if (currentIndex == 1 && selectedUniversity) {
      return <button style={buttonStyle}>{getNextButtonText()}</button>
    } else if (currentIndex == 2) {
      return <button style={buttonStyle}>{getNextButtonText()}</button>
    } else if (currentIndex == 3 && uploadStatus == 2) {
      return <button style={buttonStyle}>{getNextButtonText()}</button>
    } else if (currentIndex == 4 && verification == 1) {
      return <button style={buttonStyle}>{getNextButtonText()}</button>
    } else if (currentIndex == 5 || currentIndex == 6) {
      return <button style={buttonStyle}>{getNextButtonText()}</button>
    } else {
      return null
    }


  }


  return (
    <>
      <MainLayout>
        <h1>Transfer Credits</h1>
        <AwesomeSlider
          className="sliderParent"
          onTransitionEnd={(event) => {
            onPressNextTransition(event);
          }}
          infinite={false}
          organicArrows={false}
          buttonContentRight={getNextButton()}
          buttonContentLeft={currentIndex != 7 && <button style={buttonStyle}>Back</button>}
          bullets={false}
        >
          <div className="sliderParent">
            <div className="center">
              <h4>Disclaimer</h4>
              <p><b>
                Please note that decision on whether it is possible to transfer
                your credits achieved abroad or locally depends on decision of relevant examination board.
              </b>
              </p>
              <p>For further information on TUC credit transfer system , please refer to the section 15 of your relevant programmes <a href="https://www.tu-chemnitz.de/zpa/index.php.en">Examination regulation</a> </p>
              <p>For further information on Bialystok University credit transfer system , please refer to the section 13 this  <a href="https://pb.edu.pl/iros/wp-content/uploads/sites/24/2023/12/Regulations-for-studies-at-Bialystok-University-of-Technology.pdf">Document</a> </p>

              <p>By pressing accept you give us a consent that any information required in this digital transfer process can be used and stored by CampusFlow system</p>
              <p><input type="checkbox" checked={accept} onChange={handleAccept} /> I have read all the information and I accept terms and conditions </p>

            </div>
          </div>
          <div className="sliderParent">
            <div className="center">
              <p>
                Please choose university you want to transfer your credits to :{" "}
              </p>

              {univerisitiesLoading ? (
                <Lottie options={defaultOptions} height={200} width={200} />
              ) : (
                <div>
                  {universities.map((university) => {
                    return (
                      <div
                        onClick={() => onPressUniversityItem(university)}
                        className={
                          "universityItem " +
                          (university.selected &&
                            "universityItemSelectedBorder universityItemSelected")
                        }
                        key={university.id}
                      >
                        <div className="universityItemFlag">
                          <Lottie
                            options={getFlagOptions(university.id)}
                            height={30}
                            width={30}
                          />
                        </div>
                        <div className="universityItemText">
                          <p>{university.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="sliderParentSlide2">
            <div className="centerSlide2Image">
              <Lottie options={defaultOptionsWomen} height={200} width={200} />
            </div>
            <div className="centerSlide2">
              <p>
                We will help choose what credits can be possibly transfer to
                Bialystok University of Technology From Technische Universität
                Chemnitz
              </p>
              <p>
                Please choose the modules you have already finished at
                Technische Universität Chemnitz
              </p>

              {usersModulesLoading ? (
                <Lottie options={defaultOptions2} height={200} width={200} />
              ) : (
                <div>
                  {usersCompleteModules.map((completedModule, index) => {
                    return (
                      <div
                        onClick={() =>
                          onPressCompletedModuleItem(completedModule)
                        }
                        className={
                          "completedCourseItem " +
                          (completedModule.selected &&
                            "courseItemSelectedBorder universityItemSelected")
                        }
                        key={completedModule.moduleUri}
                      >
                        <div className="courseItemText">
                          <p>{completedModule.moduleName}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="sliderParentSlide2">

            {uploadStatus == -1 && <div className="centerFile">
              <p>In order to verify your grades we need your transcript</p>
              <div>
                <input type="file" onChange={handleChange} />
              </div>
            </div>}
            {uploadStatus == 1 && <div className="centerFile">
              <div className="centerSlide2Image">
                <Lottie
                  options={defaultOptionsScanning}
                // height={100}
                // width={100}
                />
              </div>
            </div>}
            {uploadStatus == 2 && <div className="centerFile">
              <p>Upload and Scan successfull, you can proceed to next</p>
            </div>}
          </div>
          <div className="sliderParentSlide2">
            <div className="centerSlide2Image">
              <Lottie
                options={
                  verification == 1
                    ? defaultOptionsVerified
                    : defaultOptionsUnVerified
                }
                height={150}
                width={150}
              />
            </div>
            <div className="centerSlide2">
              <h4>Your Grades Verification Results</h4>
              <div>
                {grades?.map((grade, index) => {
                  return (
                    <div className={"universityItem"} key={index}>
                      <div className="universityItemText">
                        <p>
                          {grade.name} - <b>{grade.grade}</b>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {verification == 0 && <p><i>Unfortunetly some of the selected modules could pass the verification phase</i></p>}
              {verification == 1 && <i>Congratulation! Verification passed</i>}
            </div>
          </div>
          <div className="sliderParent">
            <div className="center">
              <p>Total Possible Transferable Credits : {total}</p>
              {similarModulesLoading ? (
                <Lottie options={defaultOptions2} height={200} width={200} />
              ) : (
                <div className="scrollView">
                  {similarModules.map((similarModule) => {
                    if (similarModule.nothing) {
                      return (
                        <div id="module" key={1}>
                          No Similar modules found for : {similarModule.module}
                        </div>
                      );
                    } else {
                      return similarModule.map((item) => {
                        return (
                          <div id="module" key={item.id}>
                            <p>New Possible Grade: {newGrades.find((itemGrade) => itemGrade.name == item.name)?.newGrade}</p>
                            <div className="moduleInner">
                              <div id="moduleid">
                                {item.id} - {item.name}
                              </div>
                              <div id="creditPoints">
                                Credit Points : {item.creditPoints}
                              </div>
                              <div id="creditPoints">
                                University : {item.university}
                              </div>
                              <div id="creditPoints">
                                Course : {item.courseName}
                              </div>
                              <details id="creditPoints">
                                <summary>Show Details</summary>
                                <p>{item.content}</p>
                              </details>
                            </div>
                            <Lottie
                              options={defaultOptionsArrow}
                              height={70}
                              width={100}
                            />
                            <div className="moduleInner">
                              <div id="moduleid">
                                {item.similarModuleId} -{" "}
                                {item.similarModuleName}
                              </div>
                              <div id="creditPoints">
                                Credit Points : {item.similarModuleCreditPoints}
                              </div>
                              <div id="creditPoints">
                                University : {item.similarUniversity}
                              </div>
                              <div id="creditPoints">
                                Course : {item.courseNameSimilar}
                              </div>
                              <details id="creditPoints">
                                <summary>Show Details</summary>
                                <p>{item.similarModuleContent}</p>
                              </details>
                            </div>
                          </div>
                        );
                      });
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="sliderParentSlide2">

            <div className="centerFile">
              <h4>Please upload your signature</h4>
              <div style={{ marginTop: "20px" }}>
                <input type="file" onChange={handleSignature} />

              </div>
              <img src={signature} />
            </div>
          </div>

          <div className="sliderParent">

            <div className="centerFile">
              <p><b>We have send an email with PDF attached with all details</b></p>
              <Lottie options={defaultOptions} height={300} width={300} />

            </div>
          </div>
        </AwesomeSlider>
      </MainLayout>
    </>
  );
};

export default TransferCredits;
