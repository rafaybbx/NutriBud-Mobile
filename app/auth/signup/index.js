import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function SignupStep1() {
  const router = useRouter();
  const [email, setEmail] = useState('');

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
          <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/signup/step2')}>
            <Text style={styles.buttonText}>Continue</Text>
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

