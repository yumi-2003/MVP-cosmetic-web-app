import axios from "axios";

/**
 * Centeralized Axios Instance
 * 
 * We create this instance to avoid repeating the base URL and 
 * other common configurations (like headers) in every API call.
 */
const api = axios.create({
  // The base URL for all API requests. In a real-world scenario, 
  // this would typically be stored in an environment variable (e.g., import.meta.env.VITE_API_URL).
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Add a timeout if needed
  timeout: 10000,
});

/**
 * Request Interceptor
 * 
 * This allows us to modify the request before it's sent.
 * Common use case: Adding an Authorization header (JWT token) to every request.
 */
api.interceptors.request.use(
  (config) => {
    // Generate or retrieve persistent Session ID for guest carts
    let sessionId = localStorage.getItem("x-session-id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("x-session-id", sessionId);
    }
    config.headers["x-session-id"] = sessionId;

    // You can retrieve the token from local storage or persistent state here
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Try to extract user ID if Redux state is persisted
    try {
      const persistedState = localStorage.getItem("persist:root");
      if (persistedState) {
        const auth = JSON.parse(JSON.parse(persistedState).auth);
        if (auth?.user?._id) {
          config.headers["x-user-id"] = auth.user._id;
        }
      }
    } catch (e) {
      // ignore
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * This allows us to handle common responses (like 401 Unauthorized) in one place.
 */
api.interceptors.response.use(
  (response) => {
    // Simply return the data from the response to simplify usage in slices
    return response;
  },
  (error) => {
    // Centralized error handling
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login, clear storage)
      console.error("Unauthorized access - logging out...");
      // localStorage.clear();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
