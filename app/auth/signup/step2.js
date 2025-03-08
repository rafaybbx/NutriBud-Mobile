import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SignupStep2() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Logo */}
          <Image source={require('../../../assets/enterdetails.png')} style={styles.logo} />
          <Text style={styles.brandName}>Enter Your Details</Text>
          <Text style={styles.subtitle}>Create Your Profile!</Text>


          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="grey" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="grey" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="grey" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="grey" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/signup/step3')}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20,marginTop: -20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 20,marginTop: -20 },
  logo: { width: 350, height: 350, marginBottom: -35 },
  brandName: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 10, paddingHorizontal: 10, width: '100%', height: 50, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
