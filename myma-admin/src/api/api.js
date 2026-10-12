import axios from "axios";

// =====================================================
// ADMIN API CONFIGURATION
// =====================================================

const api = axios.create({
  baseURL: "http://localhost:9090/api",
  // baseURL: "https://devadminapi.mymahappyshoppy.in/api",
  // baseURL: "https://adminapi.mymahappyshoppy.in/api",
});

// =====================================================
// ADD ADMIN JWT TOKEN TO EVERY REQUEST
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("myma_token") ||
      localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // =================================================
    // IMPORTANT
    // =================================================
    // Do NOT force Content-Type here.
    //
    // For JSON requests, Axios will automatically use:
    // application/json
    //
    // For FormData requests, the browser/Axios will
    // automatically use:
    // multipart/form-data; boundary=...
    // =================================================

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// HANDLE UNAUTHORIZED
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response?.status === 401
    ) {
      console.error(
        "Unauthorized Admin API request:",
        error.config?.url
      );
    }

    return Promise.reject(error);
  }
);

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;