import axios from "axios";

const Authorization = null;
var instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Authorization: Authorization,
  },
});

instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    let token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = sessionStorage
        .getItem("token")
        .split(":")
        .join("");
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    if (
      response.config.url === "users" &&
      sessionStorage.getItem("role") !== "admin"
    )
      window.location.href = "/employees";
    if (
      response.status === 200 &&
      response.data === "authentication required for this call"
    ) {
      //add your code
      alert("Session has been expired. Please login it again.");
      sessionStorage.clear();
      window.location.href = "/";
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  }
);

export default instance;
