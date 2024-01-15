import axios from "axios";

const api = axios.create({
  baseURL:  "http://127.0.0.1:8000", //import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async data => {
  let response;
  try {
    response = await api.post("/api/login", data);
    storeUserInLocalStorage(response.data);
  } catch (error) {
    return error;
  }
  return response;
};

export const register = async data => {
  let response;
  try {
    response = await api.post("/api/register", data);
    storeUserInLocalStorage(response.data);
  } catch (error) {
    return error;
  }

  return response;
};

export const googleSignIn = async data => {
  let response;
  try {
    response = await api.post("/api/google/signin", data);
  } catch (error) {
    return error;
  }

  return response;
};

export const storeUserInLocalStorage = data => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};