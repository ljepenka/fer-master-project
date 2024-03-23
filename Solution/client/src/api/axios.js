import axios from "axios";
import { toast } from "react-toastify";

export const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    try {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token}`;
    } catch (error) {
      console.log(error);
    }
  }

  return req;
});

API.interceptors.response.use(
  (success) => {
    const expectedMessage = success && success.status >= 200 && success.status < 300 && success.data.message;

    if (expectedMessage) {
      toast.success(success.data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    return Promise.resolve(success);
  },
  (error) => {
    const expectedError =
      error && error.response?.status >= 400 && error.response?.status <= 500 && error.response?.data?.error;

    toast.error(expectedError ? error.response.data.error : error.message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    return Promise.reject(error);
  }
);
