import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../../contexts/AuthContext";

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { handleResetPasswordMobile } = useAuth();

  useEffect(() => {
    // Load email from secure storage
    const getEmail = async () => {
      const savedEmail = await SecureStore.getItemAsync('resetEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        // If no email is found, go back to the first step
        Alert.alert("Error", "Email not found. Please try again.");
        router.replace("/auth/resetpassword");
      }
    };
    getEmail();
  }, []);

  const handleSubmit = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await handleResetPasswordMobile(email, password, confirmPassword);
      if (result.success) {
        // Clear data before navigation
        await SecureStore.deleteItemAsync('resetEmail');
        await SecureStore.deleteItemAsync('verificationCode');
        
        // Set hasSeenOnboarding to true to prevent onboarding redirect
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        
        // Navigate to success screen
        router.push("/auth/resetpassword/resetsuccess");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Illustration */}
          <Image source={require('../../../assets/otp.png')} style={styles.illustration} />

          {/* Heading */}
          <Text style={styles.title}>Enter New Password</Text>
          <Text style={styles.subtitle}>Set a strong password to protect your account</Text>

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <Text style={styles.label}>Re Type Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Ionicons name={confirmPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Set Password Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Setting Password..." : "Set New Password"}
            </Text>
          </TouchableOpacity>

          {/* Footer Links */}
          <Text style={styles.footerText}>Need Help | FAQ | Terms Of Use</Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  illustration: { width: 300, height: 300, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 5 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7',
    borderRadius: 10, paddingHorizontal: 10, width: '100%', height: 50,
    marginBottom: 15, borderWidth: 1, borderColor: '#4CAF50', justifyContent: 'space-between'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footerText: { fontSize: 12, color: 'gray', marginTop: 20 },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
});

