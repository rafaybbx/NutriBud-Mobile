

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { clearAllData } from "../utils/storage";

const API_URL = "https://modern-donkeys-appear.loca.lt/api/auth";

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // 10 second timeout
});

// Add token to request headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error setting auth token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear all auth data
      await clearAllData();
      
      // You could redirect to login here if needed
      // But for now, just let the error propagate
    }
    
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error Request:", error.request);
      
      // Customize the error for timeout
      if (error.code === 'ECONNABORTED') {
        error.response = {
          status: 408,
          data: { message: "Request timeout. Server took too long to respond." }
        };
      } else {
        error.response = {
          status: 0,
          data: { message: "Network error. Please check your internet connection." }
        };
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error Setup:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
