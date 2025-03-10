import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../../contexts/AuthContext";

export default function ConfirmEmail() {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180); // 3:00 minutes
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { handleVerifyEmail, handleSendVerificationToken } = useAuth();

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

    // Set up timer
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const result = await handleVerifyEmail(code);
      if (result.success) {
        // Store verification code in SecureStore to use in next step
        await SecureStore.setItemAsync('verificationCode', code);
        router.push("/auth/resetpassword/step3");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    try {
      const result = await handleSendVerificationToken(email);
      if (result.success) {
        setTimer(180); // Reset timer
        Alert.alert("Success", "A new verification code has been sent to your email");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to resend code");
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
          <Image source={require('../../../assets/enteremail.png')} style={styles.illustration} />

          {/* Heading */}
          <Text style={styles.title}>Confirm Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to{' '}
            <Text style={styles.email}>{email || 'your email'}</Text>
          </Text>

          {/* OTP Input */}
          <Text style={styles.label}>Enter Verification Code</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Code"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={handleResend} disabled={timer > 0 || loading}>
              <Text style={[styles.resendText, timer === 0 && !loading && styles.activeResend]}>
                {timer > 0 ? `Resend in ${formatTime()}` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify and Continue"}
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
  illustration: { width: 320, height: 320, resizeMode: 'contain', marginBottom: 10, marginBottom: -50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20 },
  email: { color: '#4CAF50', fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 5 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7',
    borderRadius: 10, paddingHorizontal: 10, width: '100%', height: 50,
    marginBottom: 15, borderWidth: 1, borderColor: '#4CAF50', justifyContent: 'space-between'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  resendText: { fontSize: 14, color: 'gray' },
  activeResend: { color: '#4CAF50', fontWeight: 'bold' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footerText: { fontSize: 12, color: 'gray', marginTop: 20 },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
});
