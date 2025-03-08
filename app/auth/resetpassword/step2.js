import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function ConfirmEmail() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(180); // 3:00 minutes
    const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
            We've sent a 5-digit verification code to{' '}
            <Text style={styles.email}>Hello@tyler.com</Text>
          </Text>

          {/* OTP Input */}
          <Text style={styles.label}>Enter Verification Code</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#aaa"
            />
            <Text style={styles.resendText}>
              {timer > 0 ? `Resend in ${formatTime()}` : 'Resend'}
            </Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/resetpassword/step3")}>
            <Text style={styles.buttonText}>Verify and Set New Password</Text>
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
  illustration: { width: 320, height: 320, resizeMode: 'contain', marginBottom: 10,marginBottom:-50 },
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
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footerText: { fontSize: 12, color: 'gray', marginTop: 20 },
});
