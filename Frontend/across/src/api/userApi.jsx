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

const storeUserInLocalStorage = data => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};
