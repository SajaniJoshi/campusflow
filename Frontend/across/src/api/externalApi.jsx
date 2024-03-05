import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
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

export const getSearchedModules = async data => {
  let response;
  try {
    response = await api.get("/modules/search", {
      params: { queryTerm: data },
    });
  } catch (error) {
    return error;
  }
  return response;
};

export const getModuleDetails = async data => {
  let response;
  try {
    response = await api.get("/modules/moduleDetails", {
      params: { moduleUri: data },
    });
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

export const retrieveNotifications = async data => {
  let response;
  try {
    response = await api.post("/user/retrieveNotifications", data);
  } catch (error) {
    return error;
  }

  return response;
};

export const retrieveTransferCreditRequestsforUser = async data => {
  let response;
  try {
    response = await api.post(
      "/transferCredits/fetchTransferCreditsRequests",
      data
    );
  } catch (error) {
    return error;
  }

  return response;
};
