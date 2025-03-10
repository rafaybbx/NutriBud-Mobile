import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { login, logout, signup, checkAuth, sendVerificationTokenMobile, verifyEmailMobile, resetPasswordMobile } from "../services/auth";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { 
  getUserCredentials, 
  getRememberMe, 
  saveUserData, 
  getUserData,
  getToken,
  setItem,
  getItem
} from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkConnected, setNetworkConnected] = useState(true);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkConnected(state.isConnected);
      if (!state.isConnected) {
        console.log("No internet connection");
      }
    });

    return () => unsubscribe();
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if we have a force logout flag
        const forceLogout = await SecureStore.getItemAsync('forceLogout');
        if (forceLogout === 'true') {
          // Clear the flag
          await SecureStore.deleteItemAsync('forceLogout');
          // Ensure user is logged out
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // First check if Remember Me is enabled
        const rememberMe = await getRememberMe();
        
        // Check if user has seen onboarding
        const hasSeenOnboarding = await SecureStore.getItemAsync('hasSeenOnboarding');
        
        // Check if a token exists
        const token = await getToken();
        
        if (token) {
          // If a token exists, try to verify existing session
          if (networkConnected) {
            try {
              const authData = await checkAuth();
              if (authData?.user) {
                setUser(authData.user);
                await saveUserData(authData.user);
                setIsAuthenticated(true);
              } else {
                // If server says not authenticated, clear authentication state
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (err) {
              console.log("Error verifying auth with server:", err);
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else if (rememberMe) {
          // If no token but Remember Me is enabled, try to login with saved credentials
          const storedUser = await getUserData();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
        } else {
          // No token and Remember Me not enabled, clear authentication state
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [networkConnected]);

  const handleLogin = async (email, password, role, rememberMe = false, showAlerts = true) => {
    if (!networkConnected && showAlerts) {
      Alert.alert(
        "No Internet Connection", 
        "Please check your internet connection and try again."
      );
      throw new Error("No internet connection");
    }

    setError(null);
    try {
      const data = await login(email, password, role, rememberMe);
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Mark that the user has seen onboarding
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        
        return data;
      } else {
        setError(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      let errorMessage = "Login failed";
      
      if (err.emailNotFound) {
        errorMessage = "Email not found";
      } else if (err.invalidPassword) {
        errorMessage = "Incorrect password";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  const handleSignup = async (email, password, firstname, lastname, role) => {
    if (!networkConnected) {
      Alert.alert(
        "No Internet Connection", 
        "Please check your internet connection and try again."
      );
      throw new Error("No internet connection");
    }

    setError(null);
    try {
      const data = await signup(email, password, firstname, lastname, role);
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Mark that the user has seen onboarding
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        
        return data;
      } else {
        setError(data.message || "Signup failed");
        throw new Error(data.message || "Signup failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Signup failed";
      setError(errorMessage);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      // Show loading state if needed
      setLoading(true);
      
      // Call the logout API
      const result = await logout();
      
      // Clear user state regardless of API response
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear user data even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationToken = async (email) => {
    if (!networkConnected) {
      Alert.alert(
        "No Internet Connection", 
        "Please check your internet connection and try again."
      );
      throw new Error("No internet connection");
    }

    setError(null);
    try {
      const data = await sendVerificationTokenMobile(email);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to send verification code";
      setError(errorMessage);
      throw err;
    }
  };

  const handleVerifyEmail = async (code) => {
    if (!networkConnected) {
      Alert.alert(
        "No Internet Connection", 
        "Please check your internet connection and try again."
      );
      throw new Error("No internet connection");
    }

    setError(null);
    try {
      const data = await verifyEmailMobile(code);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to verify code";
      setError(errorMessage);
      throw err;
    }
  };

  const handleResetPasswordMobile = async (email, password, confirmPassword) => {
    if (!networkConnected) {
      Alert.alert(
        "No Internet Connection", 
        "Please check your internet connection and try again."
      );
      throw new Error("No internet connection");
    }

    setError(null);
    try {
      const data = await resetPasswordMobile(email, password, confirmPassword);
      
      // Clear any stored reset data on success
      if (data.success) {
        try {
          await SecureStore.deleteItemAsync('resetEmail');
          await SecureStore.deleteItemAsync('verificationCode');
        } catch (clearError) {
          console.error("Error clearing reset data:", clearError);
        }
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reset password";
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      error,
      networkConnected,
      handleLogin, 
      handleSignup, 
      handleLogout,
      handleSendVerificationToken,
      handleVerifyEmail,
      handleResetPasswordMobile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
