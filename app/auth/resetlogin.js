// Copy your login.js code here but with a different route
// Then navigate to this page from resetsuccess.js 
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { getUserCredentials, getRememberMe, setHasSeenOnboarding } from "../../utils/storage";

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { handleLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load saved credentials if Remember Me was checked
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedRememberMe = await getRememberMe();
        setRememberMe(savedRememberMe);
        
        if (savedRememberMe) {
          const credentials = await getUserCredentials();
          if (credentials) {
            setEmail(credentials.email || "");
            setPassword(credentials.password || "");
          }
        }
      } catch (error) {
        console.error("Error loading saved credentials:", error);
      }
    };
    
    loadSavedCredentials();
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    
    // Validate inputs
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    
    if (!isValid) return;
    
    try {
      setLoading(true);
      await handleLogin(email, password, "admin", rememberMe);
      
      // Mark that the user has seen onboarding
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
      
      router.replace("/auth/loginsuccess");
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            if (data.message.includes("Invalid credentials")) {
              setEmailError("Email not found");
            } else if (data.message.includes("Invalid password")) {
              setPasswordError("Incorrect password");
            } else if (data.message.includes("Invalid role")) {
              Alert.alert("Login Failed", "You don't have permission to access this role");
            } else if (data.message.includes("User not verified")) {
              Alert.alert(
                "Account Not Verified", 
                "Please verify your email before logging in",
                [
                  { text: "OK" },
                  { 
                    text: "Resend Verification", 
                    onPress: () => router.push("/auth/resendverification")
                  }
                ]
              );
            } else {
              Alert.alert("Login Failed", data.message || "Invalid login details");
            }
            break;
          case 401:
            Alert.alert("Unauthorized", "Your session has expired. Please login again.");
            break;
          case 403:
            Alert.alert("Access Denied", "You don't have permission to access this resource");
            break;
          case 429:
            Alert.alert("Too Many Attempts", "Please try again later");
            break;
          case 500:
            Alert.alert("Server Error", "Something went wrong on our end. Please try again later.");
            break;
          default:
            Alert.alert("Login Failed", data.message || "An error occurred during login");
        }
      } else if (error.request) {
        // Network error
        Alert.alert(
          "Connection Error", 
          "Unable to connect to the server. Please check your internet connection.",
          [
            { text: "OK" },
            { text: "Try Again", onPress: () => handleSignIn() }
          ]
        );
      } else {
        // Something else happened
        Alert.alert("Login Error", error.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent going back with hardware back button (Android)
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default behavior
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container2}>
          {/* Logo */}
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.subText2}>Let's login to start your fitness journey!</Text>
          
          {/* Email Input */}
          <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
            <FontAwesome name="envelope" size={20} color={emailError ? "red" : "gray"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone Number"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(""); // Clear error when typing
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.includes("@") && !emailError && 
              <FontAwesome name="check-circle" size={20} color="green" style={styles.iconRight} />
            }
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password Input */}
          <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
            <Feather name="lock" size={20} color={passwordError ? "red" : "gray"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(""); // Clear error when typing
              }}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Feather 
                name={passwordVisible ? "eye-off" : "eye"} 
                size={20} 
                color={passwordError ? "red" : "gray"} 
                style={styles.iconRight} 
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Remember Me & Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkboxContainer}>
              <FontAwesome 
                name={rememberMe ? "check-square" : "square-o"} 
                size={20} 
                color="#4CAF50" 
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/auth/resetpassword")}>
              <Text style={styles.forgotPassword}>Forgot password</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sign-in Button */}
          <TouchableOpacity 
            style={[styles.signInButton, loading ? styles.signInButtonDisabled : null]} 
            onPress={handleSignIn} 
            disabled={loading}
          >
            <Text style={styles.signInText}>{loading ? "Signing in..." : "Sign in"}</Text>            
          </TouchableOpacity>
          
          {/* Social Logins */}
          <Text style={styles.connectText}>You can Connect with</Text>
          <View style={styles.socialIcons}>
            <FontAwesome name="facebook" size={30} color="#1877F2" />
            <FontAwesome name="google" size={30} color="#4CAF50" />
            <FontAwesome name="apple" size={30} color="black" />
          </View>
          
          {/* Sign-up Link */}
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink} onPress={() => router.push("/auth/signup")}>Sign Up here</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

login.options = {
  headerShown: false,
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
    container2: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
    // marginTop:120,
    // backgroundColor:'red',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  subText2: {
    fontSize: 16,
    color: "gray",
    marginBottom: 15,
    textAlign: 'center',
  },
  logo: {
    width: 250,
    height: 63,
    marginBottom: -20,
    alignSelf: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 5,
    fontSize: 14,
  },
  forgotPassword: {
    color: "#4CAF50",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  connectText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 14,
    color: "gray",
  },
  signUpLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },

    topimage: {
    width: "100%",
    height: "55%",
    resizeMode: "cover",
    marginBottom: 20,
    marginTop: -100,
  },
  bottomimage: {
    width: "100%",
    height: "55%",
    resizeMode: "cover",
    marginTop: 0,
    marginBottom: -400,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: -5,
    marginBottom: 5,
  },
  signInButtonDisabled: {
    backgroundColor: "#a5d6a7", // Lighter green when disabled
  },
});
