import React, { useEffect, useState, useCallback } from "react";
import "./TransferCredits.css";
import axios from "axios";
import MainLayout from "../../../components/user/MainLayout/MainLayout";
import Lottie from "react-lottie";
import loadingData from "../../../assets/lotties/loading_transfer_v0.json";
import loadingDataV1 from "../../../assets/lotties/loading_transfer_v1.json";
import germany from "../../../assets/lotties/germany_flag.json";
import poland from "../../../assets/lotties/poland_flag.json";
import arrow from "../../../assets/lotties/arrow_down.json";
import women from "../../../assets/lotties/women.json";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import { useDropzone } from "react-dropzone";

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
  const [uploadStatus, setUploadStatus] = useState(null);
 
  const buttonStyle = {
    background: "#439a86",
    borderRadius: "10px",
    color: "white",
    width: "60px",
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/adminapp/universitieslist")
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

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        console.log(JSON.stringify(file));
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/user/verifyTranscript",
        formData
      );

      console.log("Upload response:", response.data);

      setUploadedFiles(acceptedFiles);
      setUploadStatus("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Error uploading files. Please try again.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getUsersCompletedModules = () => {
    const data = { email: userData?.email };
    axios
      .post("http://127.0.0.1:8000/user/fetchCompletedModulesofUser", data)
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
      axios
        .get(
          "http://127.0.0.1:8000/modules/similarModules?moduleUri=" +
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
        };
        transferCreditsRequestList.push(innerObject);
      });
    });
    const data = {
      email: userData?.email,
      transferCreditsRequest: transferCreditsRequestList,
      possibleTransferrableCredits: total,
    };
    console.log(data);
    axios
      .post(
        "http://127.0.0.1:8000/transferCredits/saveTransferCreditsofUser",
        data
      )
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          setSaveLoading(false);
        }
      })
      .catch((error) => {});
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
    } else if (event.currentIndex == 3) {
      setsimilarModulesLoading(true);
      getSimilarAgainst();
    } else if (event.currentIndex == 4) {
      setSaveLoading(true);
      saveData();
    }
  };
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
          buttonContentRight={<button style={buttonStyle}>Next</button>}
          buttonContentLeft={<button style={buttonStyle}>Back</button>}
        >
          <div className="sliderParent">
            <div className="center">
              <h2>Disclaimer</h2>
              <p>
                Please note: Decisions on whether it is possible to convert
                grades gained abroad into grades under the German system are the
                responsibility of the relevant examination board. The following
                information is provided by the International Office purely
                intended as guidance and is not legally binding. (1) Study
                times, course achievements and examination achievements from
                other study programs will be taken into account at the student's
                request, unless there are significant differences in the skills
                acquired. Included There is no need to make a schematic
                comparison, but rather an overall consideration and overall
                assessment. The credit can be refused if more than 80 credit
                points or the master's thesis are to be taken into account. The
                examination committee decides on the crediting. When recognizing
                and crediting study periods and academic achievements and
                examination achievements that were completed outside the Federal
                Republic of Germany, the equivalence agreements approved by the
                Conference of Ministers of Education (KMK) and the Conference of
                Rectors of the University (HRK) as well as agreements within the
                framework of university cooperation agreements must be observed.
                (2) The examination board can credit relevant practical work
                activities upon application by the student. (3) Applicants with
                university entrance qualifications will be placed in a higher
                semester if they pass have demonstrated the required knowledge
                and skills through a special university examination (placement
                test). (4) If study and examination achievements are taken into
                account, the credit points and the grades - as long as the
                grading systems are comparable - must be taken over. In the case
                of incomparable grading systems, the note “passed” is included.
                (5) Students must submit the documents required for the
                crediting of study periods, course achievements and examination
                achievements.
              </p>
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
            <div className="centerSlide2Image">
              <Lottie options={defaultOptionsWomen} height={200} width={200} />
            </div>
            <div className="centerSlide2">
              <p>In order to verify your grades we need your transcript</p>
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "active" : ""}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop your transcript here ...</p>
                ) : (
                  <p>
                    Drag 'n' drop or click to
                    select transcript
                  </p>
                )}
              </div>
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

          <div className="sliderParent">
            <p>We have send an email with PDF attached with all details</p>
            <Lottie options={defaultOptions} height={300} width={300} />
          </div>
        </AwesomeSlider>
      </MainLayout>
    </>
  );
};

export default TransferCredits;
