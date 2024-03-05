import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUniversities = async () => {
  let response;
  try {
    response = await api.get("/universities/");
  } catch (error) {
    return error;
  }
  return response;
};

export const getCoursesOfParticularUniversity = async data => {
  let response;
  try {
    response = await api.post("/courses/", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const getModulesOfCourse = async data => {
  let response;
  try {
    response = await api.post("/modules/", data);
  } catch (error) {
    return error;
  }

  return response;
};

export const getSimilarModules = async data => {
  let response;
  try {
    response = await api.get("/modules/similarModules", {
      params: {
        moduleUri: data,
      },
    });
  } catch (error) {
    return error;
  }
  return response;
};
