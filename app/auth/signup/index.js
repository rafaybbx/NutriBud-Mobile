import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios'; // Assuming you're using axios for API calls

import config from "../../../config"; // Adjust path if needed


export default function SignupStep1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailRegistered = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/check-email`, { email });
      setLoading(false);
      return response.data.isRegistered;
    } catch (error) {
      setLoading(false);
      console.error("Error checking email:", error);
      Alert.alert("Error", "Failed to check email registration. Please try again.");
      return false;
    }
  };

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const isRegistered = await checkEmailRegistered(email);
    if (isRegistered) {
      Alert.alert("Email Already Registered", "This email is already registered. Please use a different email.");
      return;
    }

    // If email is valid and not registered, proceed to the next step
    router.push({ pathname: '/auth/signup/step2', params: { email } });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Illustration */}
          <Image source={require('../../../assets/login.png')} style={styles.illustration} />
          {/* Title */}
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Create account for easy fitness!</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone Number"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Checking..." : "Continue"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 20 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  illustration: { width: 300, height: 300, resizeMode: 'contain', marginBottom: -10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10, width: '100%', height: 50, backgroundColor: '#f7f7f7' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

