import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllModules = async () => {
  let response;
  try {
    response = await api.get("/modules/getAllModules");
  } catch (error) {
    return error;
  }
  return response;
};

export const getUniversityUri = async data => {
  let response;
  try {
    response = await api.post("/user/fetchUniversityUri", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const saveCompletedModules = async data => {
  let response;
  try {
    response = await api.post("/user/saveCompletedModulesofUser", data);
  } catch (error) {
    return error;
  }

  return response;
};

export const getCompletedModules = async data => {
  let response;
  try {
    response = await api.post("/user/fetchCompletedModulesofUser", data);
  } catch (error) {
    return error;
  }

  return response;
};
