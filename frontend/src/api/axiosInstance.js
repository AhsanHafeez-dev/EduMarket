// "use client"

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000",
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = JSON.parse(localStorage.getItem("accessToken")) || "";

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (err) => Promise.reject(err)
// );

// export default axiosInstance;



"use client"

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {  // ✅ Ensure we're on client
      const accessToken = JSON.parse(localStorage.getItem("accessToken")) || "";
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
