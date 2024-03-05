import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async data => {
  let response;
  try {
    response = await api.post("/auth/login", data);
    storeUserInLocalStorage(response.data);
  } catch (error) {
    return error;
  }
  return response;
};

export const register = async data => {
  let response;
  try {
    response = await api.post("/auth/register", data);
    storeUserInLocalStorage(response.data);
  } catch (error) {
    return error;
  }

  return response;
};

export const googleSignIn = async data => {
  let response;
  try {
    response = await api.post("/auth/google/signin", data);
  } catch (error) {
    return error;
  }

  return response;
};

export const storeUniversityName = async data => {
  let response;
  try {
    response = await api.patch("/user/selectUniversity", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const storeUserInLocalStorage = data => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};
