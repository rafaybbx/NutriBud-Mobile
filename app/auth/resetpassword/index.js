import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";


export default function ResetPassword() {
      const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Illustration */}
          <Image source={require('../../../assets/resetpass.png')} style={styles.illustration} />

          {/* Heading */}
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address below and we’ll send you a link with instructions
          </Text>

          {/* Email Input */}
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Email Address"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
          </View>

          {/* Send Code Button */}
          <TouchableOpacity style={styles.button}  onPress={() => router.push("/auth/resetpassword/step2")}>
            <Text style={styles.buttonText}>Send Verification Code</Text>
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
    marginBottom: 15, borderWidth: 1, borderColor: '#4CAF50'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footerText: { fontSize: 12, color: 'gray', marginTop: 20 },
});
