import React, { useEffect, useState } from "react";
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
  const [userData, setUserData] = useState(null)

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
    setUserData(data?.user)


  }, [])
  const getUsersCompletedModules = () => {
    const data = { email: userData?.email }
    axios
      .post("http://127.0.0.1:8000/user/fetchCompletedModulesofUser",
        data
      )
      .then((response) => {
        if (response.status == 200) {
          const returnedData = response.data.user_profile_data.completed_modules;
          returnedData.forEach((item) => {
            item.selected = false;
          });
          setUsersCompletedModules(returnedData);
        }
        setTimeout(() => {
          setusersModulesLoading(false);
        }, 3000)

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
    let numberTotal = 0
    selectedModules?.forEach((selected) => {
      axios
        .get(
          "http://127.0.0.1:8000/modules/similarModules?moduleUri=" +
          encodeURIComponent(selected.moduleUri)
        )
        .then((response) => {
          if (response.status == 200) {
            list.push(response.data.modules);
            const calculateTotal = response.data.modules
            calculateTotal.forEach((item) => {
              numberTotal = numberTotal + parseInt(item.similarModuleCreditPoints)

            })
            setSimilarModules([...similarModules, ...list]);

          }
        })
        .catch((error) => {
          if (error.response.status == 404) {
            const noContent = {
              nothing: true,
              module: selected.moduleName
            }
            setSimilarModules(...similarModules, ...noContent)
          }
        });
    });

    setTimeout(() => {
      setTotal(total + numberTotal)
      setsimilarModulesLoading(false);
    }, 3000)
  };


  const saveData = () => {
    const transferCreditsRequestList = []
    similarModules.forEach((item) => {
      item.forEach((value) => {
        console.log(value)
        const innerObject = {
          fromModule: [
            {
              moduleUri: value.moduleUri,
              moduleName: value.name,
              moduleId: value.id,
              credits: value.creditPoints
            }
          ],
          toModule: [
            {
              moduleUri: value.similarModuleUri,
              moduleName: value.similarModuleName,
              moduleId: value.similarModuleId,
              credits: value.similarModuleCreditPoints
            }
          ],
          status: "PENDING"
        }
        transferCreditsRequestList.push(innerObject)
      })
    })
    const data = {
      email: userData?.email,
      transferCreditsRequest: transferCreditsRequestList,
      possibleTransferrableCredits: total,
    }
    console.log(data)
    axios
      .post(
        "http://127.0.0.1:8000/transferCredits/saveTransferCreditsofUser",
        data
      )
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          setSaveLoading(false)
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
      module.selected = item.moduleUri == module.moduleUri ? !module.selected : module.selected;
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
    if (event.currentIndex == 1) {
      setusersModulesLoading(true);
      getUsersCompletedModules();
    } else if (event.currentIndex == 2) {
      setsimilarModulesLoading(true);
      getSimilarAgainst();
    } else if (event.currentIndex == 3) {
      setSaveLoading(true)
      saveData()
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
          buttonContentRight={
            <button style={selectedUniversity && buttonStyle}>Next</button>
          }
          buttonContentLeft={
            <button style={selectedUniversity && buttonStyle}>Back</button>
          }
        >
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
                Please choose the modules you have already finished at Technische
                Universität Chemnitz
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
          <div className="sliderParent">
            <div className="center">
              <p>Total Possible Transferable Credits : {total}</p>
              {similarModulesLoading ? (
                <Lottie options={defaultOptions2} height={200} width={200} />
              ) : (
                <div className="scrollView">
                  {similarModules.map((similarModule) => {
                    if (similarModule.nothing) {
                      return (<div id="module" key={1}>
                        No Similar modules found for : {similarModule.module}

                      </div>)
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
                                {item.similarModuleId} - {item.similarModuleName}
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
