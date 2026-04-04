import axios from "axios";

/**
 * Centeralized Axios Instance
 * 
 * We create this instance to avoid repeating the base URL and 
 * other common configurations (like headers) in every API call.
 */
const api = axios.create({
  // In development: falls back to localhost.
  // In production: uses VITE_API_URL set in .env.production / Vercel env vars.
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
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

    // x-user-id is now derived from JWT on server for security.
    // persist:root parsing is removed to prevent stale data usage.

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
