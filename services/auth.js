
import api from "./api";
import * as SecureStore from "expo-secure-store";
import { 
  saveUserData, 
  saveUserCredentials, 
  clearUserCredentials, 
  saveRememberMe,
  getRememberMe,
  clearAllData
} from "../utils/storage";

export const signup = async (email, password, firstname, lastname, role) => {
  try {
    const response = await api.post("/signup", { email, password, firstname, lastname, role });
    if (response.data.success) {
      await SecureStore.setItemAsync("authToken", response.data.token || "");
      await saveUserData(response.data.user);
    }
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (email, password, role, rememberMe = false) => {
  try {
    // Validate inputs before sending to server
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    
    const response = await api.post("/login", { email, password, role });
    
    // Check if login was successful
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }
    
    // Save auth token
    if (response.data.token) {
      await SecureStore.setItemAsync("authToken", response.data.token);
    }
    
    // Save user data
    if (response.data.user) {
      await saveUserData(response.data.user);
    }
    
    // Handle Remember Me
    await saveRememberMe(rememberMe);
    if (rememberMe) {
      // Save credentials if Remember Me is checked
      await saveUserCredentials(email, password, role);
    } else {
      // Clear saved credentials if Remember Me is unchecked
      await clearUserCredentials();
    }
    
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    // Enhance error message based on status code
    if (error.response) {
      const { status, data } = error.response;
      
      // Add more specific error handling
      if (status === 400 && data.message.includes("Invalid credentials")) {
        error.emailNotFound = true;
      } else if (status === 400 && data.message.includes("Invalid password")) {
        error.invalidPassword = true;
      }
    }
    
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
    
    // Check if Remember Me is enabled before clearing credentials
    const rememberMe = await getRememberMe();
    
    // If Remember Me is not enabled, clear all data
    if (!rememberMe) {
      await clearAllData();
    } else {
      // If Remember Me is enabled, only clear the auth token but keep credentials
      await SecureStore.deleteItemAsync("authToken");
    }
    
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    
    // Still handle token deletion even if server request fails
    const rememberMe = await getRememberMe();
    if (!rememberMe) {
      await clearAllData();
    } else {
      await SecureStore.deleteItemAsync("authToken");
    }
    
    return { success: true, message: "Logged out successfully" };
  }
};

export const verifyEmail = async (code) => {
  try {
    const response = await api.post("/verify-email", { code });
    return response.data;
  } catch (error) {
    console.error("Email verification error:", error.response?.data || error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    if (!email) throw new Error("Email is required");
    
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    if (!token) throw new Error("Reset token is required");
    if (!password) throw new Error("New password is required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    
    const response = await api.post(`/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/check-auth");
    return response.data;
  } catch (error) {
    // Don't log this as an error since it's expected for non-authenticated users
    console.log("Auth check: User not authenticated");
    return null;
  }
};
