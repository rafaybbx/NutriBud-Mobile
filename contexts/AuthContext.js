
import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { login, logout, signup, checkAuth } from "../services/auth";
import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { 
  getUserCredentials, 
  getRememberMe, 
  saveUserData, 
  getUserData,
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
        // First check if Remember Me is enabled
        const rememberMe = await getRememberMe();
        
        // Check if user has seen onboarding
        const hasSeenOnboarding = await SecureStore.getItemAsync('hasSeenOnboarding');
        
        if (rememberMe) {
          // Try to get stored user data first for immediate UI update
          const storedUser = await getUserData();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }
          
          // If online, try auto-login with saved credentials
          if (networkConnected) {
            try {
              // First try to verify existing session
              const authData = await checkAuth();
              if (authData?.user) {
                // Update user data if server has newer info
                setUser(authData.user);
                await saveUserData(authData.user);
                setIsAuthenticated(true);
              } else {
                // If server says not authenticated, try to login with saved credentials
                const credentials = await getUserCredentials();
                if (credentials) {
                  const { email, password, role } = credentials;
                  try {
                    const loginData = await login(email, password, role, true);
                    if (loginData.success) {
                      setUser(loginData.user);
                      setIsAuthenticated(true);
                      
                      // Mark that the user has seen onboarding
                      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
                    }
                  } catch (loginErr) {
                    console.log("Auto-login failed:", loginErr);
                    // If auto-login fails, clear authentication state
                    setUser(null);
                    setIsAuthenticated(false);
                  }
                }
              }
            } catch (err) {
              console.log("Error verifying auth with server:", err);
              // If offline but we have stored user data, keep them logged in
              if (storedUser) {
                setIsAuthenticated(true);
              }
            }
          }
        } else {
          // Remember Me is not enabled, check if we have an active session
          if (networkConnected) {
            try {
              const authData = await checkAuth();
              if (authData?.user) {
                setUser(authData.user);
                setIsAuthenticated(true);
                
                // Mark that the user has seen onboarding
                await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
              }
            } catch (err) {
              // No active session
              setUser(null);
              setIsAuthenticated(false);
            }
          }
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
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear user data even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
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
      handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
