import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios for API calls
import config from "../../../config";


export default function ConfirmEmail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Retrieve the email from the params
    if (params && params.email) {
      console.log("Email from params:", params.email);
      setEmail(params.email);
    } else {
      console.log("No email found in params:", params);
      setEmail('your email'); // Fallback text if no email is found
    }
  }, [params]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validate OTP input
  const validateOtp = (text) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    setOtp(numericText);
    
    if (numericText.length === 0) {
      setOtpError('Verification code is required');
    } else if (numericText.length < 6) {
      setOtpError('Verification code must be 6 digits');
    } else {
      setOtpError('');
    }
  };

  // Handle verification API call
  const handleVerification = async () => {
    // Validate OTP before submission
    if (!otp) {
      setOtpError('Verification code is required');
      return;
    }
    
    if (otp.length < 6) {
      setOtpError('Verification code must be 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      
      // Make API call to verify email
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/verify-email`, {
        code: otp
      });
      
      console.log("Verification response:", response.data);
      
      if (response.data.success) {
        Alert.alert(
          "Success", 
          "Email verified successfully! Welcome to our app.",
          [{ 
            text: "Continue", 
            onPress: () => router.push({
              pathname: '/profileonboarding',
              params: { email }
            })
          }]
        );
      } else {
        // This should not happen as non-success responses should throw an error
        // But handling it just in case
        Alert.alert("Verification Failed", response.data.message || "Failed to verify email. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to verify email. Please try again.";
      
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    try {
      setResendDisabled(true);
      setCountdown(60); // 60 seconds cooldown
      
      // You would need to implement this API endpoint on your backend
      await axios.post(`${config.API_BASE_URL}/api/auth/resend-verification`, {
        email: email
      });
      
      Alert.alert("Success", "A new verification code has been sent to your email.");
    } catch (error) {
      console.error("Resend code error:", error);
      Alert.alert("Failed to Resend", "Could not send a new verification code. Please try again later.");
      setResendDisabled(false);
      setCountdown(0);
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
            We've sent a 6-digit verification code to{' '}
            <Text style={styles.email}>{email}</Text>
          </Text>

          {/* OTP Input */}
          <View style={[styles.inputContainer, otpError ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={otpError ? "red" : "#4CAF50"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Verification Code"
              value={otp}
              onChangeText={validateOtp}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#aaa"
            />
            {otp.length === 6 && !otpError && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.validationIcon} />
            )}
          </View>
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

          {/* Resend Code */}
          <TouchableOpacity 
            style={styles.resendContainer} 
            onPress={handleResendCode}
            disabled={resendDisabled}
          >

          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[styles.button, (isLoading || otpError || otp.length !== 6) ? styles.buttonDisabled : null]} 
            onPress={handleVerification}
            disabled={isLoading || !!otpError || otp.length !== 6}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Verifying..." : "Verify and Create Account"}
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
  illustration: { width: 320, height: 320, resizeMode: 'contain', marginBottom: -40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20 },
  email: { color: '#4CAF50', fontWeight: 'bold' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f7f7f7', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    width: '100%', 
    height: 50, 
    marginBottom: 5, 
    borderWidth: 1, 
    borderColor: '#4CAF50' 
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  validationIcon: { marginLeft: 5 },
  resendContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  resendText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  resendDisabled: {
    color: 'gray',
  },
  button: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 15, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonDisabled: { 
    backgroundColor: '#a5d6a7' // Lighter green for disabled state
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footerText: { fontSize: 12, color: 'gray', marginTop: 20 },
});
