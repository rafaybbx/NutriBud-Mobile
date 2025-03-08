import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons";

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView contentContainerStyle={styles.scrollView}>

 {/* Sign-up Link 
    <Image source={require("../../assets/bg3.png")} style={styles.topimage} />
*/}
    <View style={styles.container2}>
 
      {/* Logo */}
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.subText2}>Let's login to start your fitness journey!</Text>
      
          {/* Email Input */}
          <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone Number"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {email.includes("@") && <FontAwesome name="check-circle" size={20} color="green" style={styles.iconRight} />}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Feather name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" style={styles.iconRight} />
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkboxContainer}>
              <FontAwesome name={rememberMe ? "check-square" : "square-o"} size={20} color="#4CAF50" />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => router.push("/auth/resetpassword")}>
              <Text style={styles.forgotPassword}>Forgot password</Text>
            </TouchableOpacity>
            </View>
            
            {/* Sign-in Button */}
            <TouchableOpacity style={styles.signInButton} onPress={() => router.push("/auth/loginsuccess")}>
            <Text style={styles.signInText}>Sign in</Text>
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
         {/* Sign-up Link 
        <Image source={require("../../assets/bg2.png")} style={styles.bottomimage} />
        */}
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
});
