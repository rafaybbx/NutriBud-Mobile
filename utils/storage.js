import * as SecureStore from "expo-secure-store";

export const saveToken = async (token) => {
  try {
    if (!token) {
      console.warn("Attempted to save empty token");
      return false;
    }
    await SecureStore.setItemAsync("token", token);
    return true;
  } catch (error) {
    console.error("Error saving token:", error);
    return false;
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync("token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync("token");
    return true;
  } catch (error) {
    console.error("Error removing token:", error);
    return false;
  }
};

// Remember Me functionality
export const saveRememberMe = async (value) => {
  try {
    await SecureStore.setItemAsync("rememberMe", value ? "true" : "false");
    return true;
  } catch (error) {
    console.error("Error saving remember me:", error);
    return false;
  }
};

export const getRememberMe = async () => {
  try {
    const value = await SecureStore.getItemAsync("rememberMe");
    return value === "true";
  } catch (error) {
    console.error("Error getting remember me:", error);
    return false;
  }
};

// Onboarding status
export const setHasSeenOnboarding = async (value) => {
  try {
    await SecureStore.setItemAsync("hasSeenOnboarding", value ? "true" : "false");
    return true;
  } catch (error) {
    console.error("Error saving onboarding status:", error);
    return false;
  }
};

export const getHasSeenOnboarding = async () => {
  try {
    const value = await SecureStore.getItemAsync("hasSeenOnboarding");
    return value === "true";
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return false;
  }
};

// User data management
export const saveUserData = async (userData) => {
  try {
    await SecureStore.setItemAsync("userData", JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// User credentials for Remember Me
export const saveUserCredentials = async (email, password, role) => {
  try {
    const credentials = JSON.stringify({ email, password, role });
    await SecureStore.setItemAsync("userCredentials", credentials);
    return true;
  } catch (error) {
    console.error("Error saving credentials:", error);
    return false;
  }
};

export const getUserCredentials = async () => {
  try {
    const credentials = await SecureStore.getItemAsync("userCredentials");
    return credentials ? JSON.parse(credentials) : null;
  } catch (error) {
    console.error("Error getting credentials:", error);
    return null;
  }
};

export const clearUserCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync("userCredentials");
    return true;
  } catch (error) {
    console.error("Error clearing credentials:", error);
    return false;
  }
};

// Generic AsyncStorage-like API
export const setItem = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
};

export const getItem = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    // Save the onboarding flag
    const hasSeenOnboarding = await SecureStore.getItemAsync('hasSeenOnboarding');
    
    // Clear all authentication-related data
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userData");
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("rememberMe");
    await SecureStore.deleteItemAsync("userCredentials");
    
    // Restore the onboarding flag
    if (hasSeenOnboarding === 'true') {
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    }
    
    return true;
  } catch (error) {
    console.error("Error clearing all data:", error);
    return false;
  }
};
