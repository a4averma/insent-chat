import axios from "axios";
import { API_HEADERS } from "./constants";

const Axios = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    Authorization: API_HEADERS.authToken,
    post: {
      "Content-Type": "application/json",
    },
  },
});

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.clear();
      window.location.replace("/");
      Promise.reject(error);
    } else {
      return Promise.reject(error.response);
    }
  }
);
export const setupNetworkConfigurator = (id) => {
  Axios.defaults.headers.common["userid"] = id;
};
export default Axios;
