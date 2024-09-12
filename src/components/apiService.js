import axios from "axios";

// Define the base URL for your API
const API_BASE_URL = "http://localhost:9090";

// Create an Axios instance with default configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the token to every request if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define your API calls here
const apiService = {
  validateToken: () => apiClient.get("/auth/validateToken"),
  
  getProfile: (username) =>
    apiClient.get(`/user/profiles`, {
      params: { username },
    }),

  getStocks: (country) =>
    apiClient.get(`/data/invoke`, {
      params: { country },
    }),

  getWishlist: (username) =>
    apiClient.get(`/wishlist/wishlist/list`, {
      params: { username },
    }),

  addToWishlist: (username, stock) =>
    apiClient.post(`/wishlist/wishlist/add`, stock, {
      params: { username },
    }),

  getFavorites: (username) =>
    apiClient.get(`/wishlist/favorites/list`, {
      params: { username },
    }),

  addToFavorites: (username, stock) =>
    apiClient.post(`/wishlist/favorites/add`, stock, {
      params: { username },
    }),

  removeFromFavorites: (username, symbol) =>
    apiClient.post(`/wishlist/favorites/remove`, null, {
      params: { symbol, username },
    }),

  registerUser: (userData) =>
    apiClient.post(`/user/register`, userData),

  signInUser: (credentials) =>
    apiClient.post(`/auth/login`, credentials),

  // Add other API endpoints as needed
};

export default apiService;
