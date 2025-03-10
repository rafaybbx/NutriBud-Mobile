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
import { checkEmailRegistered as apiCheckEmailRegistered } from "./api";

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
    // Try to call the server logout endpoint
    await api.post("/logout");
  } catch (error) {
    console.error("Logout server request error:", error.response?.data || error.message);
    // Continue with local logout even if server request fails
  }
  
  try {
    // Save the onboarding flag before clearing data
    const hasSeenOnboarding = await SecureStore.getItemAsync('hasSeenOnboarding');
    
    // Clear all data
    await clearAllData();
    
    // Restore the onboarding flag
    if (hasSeenOnboarding === 'true') {
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    }
    
    // Force clear any navigation history by setting a flag
    await SecureStore.setItemAsync('forceLogout', 'true');
    
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Error clearing local data:", error);
    throw error;
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

export const sendVerificationTokenMobile = async (email) => {
  try {
    if (!email) throw new Error("Email is required");
    
    const response = await api.post("/send-verification-token-mobile", { email });
    return response.data;
  } catch (error) {
    console.error("Send verification token error:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyEmailMobile = async (code) => {
  try {
    if (!code) throw new Error("Verification code is required");
    
    const response = await api.post("/verify-email-mobile", { code });
    return response.data;
  } catch (error) {
    console.error("Email verification error:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPasswordMobile = async (email, password, confirmPassword) => {
  try {
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!confirmPassword) throw new Error("Confirm password is required");
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    
    const response = await api.post("/reset-password-mobile", { 
      email, 
      password, 
      confirmPassword 
    });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error;
  }
};


