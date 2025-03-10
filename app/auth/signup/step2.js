import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Make sure axios is imported
import config from "../../../config";



export default function SignupStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  
  // Add state for field validation
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Retrieve the email from the search params
    if (params && params.email) {
      console.log("Email from params:", params.email);
      setEmail(params.email);
    } else {
      console.log("No email found in params:", params);
    }
  }, [params]);

  // Validate first name as user types
  const validateFirstName = (text) => {
    setFirstName(text);
    if (formSubmitted && !text.trim()) {
      setFirstNameError('First name is required');
    } else {
      setFirstNameError('');
    }
  };

  // Validate last name as user types
  const validateLastName = (text) => {
    setLastName(text);
    if (formSubmitted && !text.trim()) {
      setLastNameError('Last name is required');
    } else {
      setLastNameError('');
    }
  };

  // Validate password as user types
  const validatePassword = (text) => {
    setPassword(text);
    
    // Clear error if field is empty (will be caught by required field validation)
    if (!text) {
      if (formSubmitted) {
        setPasswordError('Password is required');
      } else {
        setPasswordError('');
      }
      return;
    }
    
    let errorMessage = '';
    
    // Check length
    if (text.length < 6) {
      errorMessage = 'Password must be at least 6 characters';
    }
    // Check for uppercase letter
    else if (!/[A-Z]/.test(text)) {
      errorMessage = 'Password must contain at least one uppercase letter';
    }
    // Check for number
    else if (!/[0-9]/.test(text)) {
      errorMessage = 'Password must contain at least one number';
    }
    
    setPasswordError(errorMessage);
    
    // Update confirm password validation if it's already filled
    if (confirmPassword) {
      if (confirmPassword !== text) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  // Validate confirm password as user types
  const validateConfirmPassword = (text) => {
    setConfirmPassword(text);
    
    // Clear error if field is empty (will be caught by required field validation)
    if (!text) {
      if (formSubmitted) {
        setConfirmPasswordError('Confirm password is required');
      } else {
        setConfirmPasswordError('');
      }
      return;
    }
    
    // Check if passwords match
    if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateAllFields = () => {
    let isValid = true;
    
    // Validate first name
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    
    // Validate last name
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    } else {
      setLastNameError('');
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      
      // Prepare the data for the API call
      const userData = {
        email,
        password,
        firstname: firstName,
        lastname: lastName,
        role: "user" // Set role as "user" as required
      };
      
      console.log("Sending signup data:", userData);
      
      // Make the API call to the signup endpoint
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/signup`, userData);
      
      console.log("Signup response:", response.data);
      
      // Check if signup was successful
      if (response.data.success) {
        // Navigate to step3 with email parameter
        router.push({
          pathname: '/auth/signup/step3',
          params: { email }
        });
      } else {
        // Handle unexpected success:false response
        Alert.alert("Signup Failed", response.data.message || "Failed to create account. Please try again.");
      }
      
    } catch (error) {
      // Handle API call errors
      console.error("Signup error:", error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to create account. Please try again.";
      
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setFormSubmitted(true);
    
    // Validate all fields
    if (!validateAllFields()) {
      Alert.alert("Error", "Please fill in all required fields correctly");
      return;
    }

    // Call the signup function
    handleSignup();
  };

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
          <View style={[styles.inputContainer, firstNameError ? styles.inputError : null]}>
            <Ionicons name="person-outline" size={20} color={firstNameError ? "red" : "grey"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={validateFirstName}
              placeholderTextColor="#aaa"
            />
            {firstName.trim() && !firstNameError && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.validationIcon} />
            )}
          </View>
          {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

          <View style={[styles.inputContainer, lastNameError ? styles.inputError : null]}>
            <Ionicons name="person-outline" size={20} color={lastNameError ? "red" : "grey"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={validateLastName}
              placeholderTextColor="#aaa"
            />
            {lastName.trim() && !lastNameError && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.validationIcon} />
            )}
          </View>
          {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

          <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color={passwordError ? "red" : "grey"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={validatePassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
            {password && !passwordError && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.validationIcon} />
            )}
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          <Text style={styles.passwordRequirements}>
            Password must be at least 6 characters with at least one uppercase letter and one number
          </Text>

          <View style={[styles.inputContainer, confirmPasswordError ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color={confirmPasswordError ? "red" : "grey"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={validateConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
            {confirmPassword && !confirmPasswordError && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.validationIcon} />
            )}
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          {/* Continue Button */}
          <TouchableOpacity 
            style={[
              styles.button, 
              (isLoading || firstNameError || lastNameError || passwordError || confirmPasswordError) ? styles.buttonDisabled : null
            ]} 
            onPress={handleContinue}
            disabled={isLoading || !!(firstNameError || lastNameError || passwordError || confirmPasswordError)}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Creating Account..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    marginTop: -20 
  },
  
  // Header and title styles
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 14, 
    color: 'gray', 
    marginBottom: 20, 
    marginTop: -20 
  },
  logo: { 
    width: 350, 
    height: 350, 
    marginBottom: -35 
  },
  brandName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  
  // Email container styles
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#4CAF50',
    textAlign: 'center',
  },
  emailValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Input field styles
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f7f7f7', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    width: '100%', 
    height: 50, 
    marginBottom: 5 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: 'black' 
  },
  icon: { 
    marginRight: 10 
  },
  
  // Error and validation styles
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  passwordRequirements: {
    color: 'gray',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  
  // Button styles
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
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  
  // Additional styles for form validation
  validInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  validationIcon: {
    marginLeft: 5,
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  validationText: {
    fontSize: 12,
    marginLeft: 5,
  },
  validationSuccess: {
    color: '#4CAF50',
  },
  validationError: {
    color: 'red',
  }
});
