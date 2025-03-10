import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Error states
  const [ageError, setAgeError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [activityError, setActivityError] = useState('');
  const [cuisineError, setCuisineError] = useState('');

  useEffect(() => {
    // Retrieve the email from the params
    if (params && params.email) {
      console.log("Email from params in step2:", params.email);
      setEmail(params.email);
    } else {
      console.log("No email found in params:", params);
    }
  }, [params]);

  // Dropdown States
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);

  const [activityOpen, setActivityOpen] = useState(false);
  const [activity, setActivity] = useState(null);
  const [activityItems, setActivityItems] = useState([
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'light' },
    { label: 'Moderately Active', value: 'moderate' },
    { label: 'Very Active', value: 'active' },
  ]);

  // New cuisine preference dropdown
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [cuisine, setCuisine] = useState(null);
  const [cuisineItems, setCuisineItems] = useState([
    { label: 'Pakistani', value: 'Pakistani' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Mexican', value: 'Mexican' },
    { label: 'American', value: 'American' },
    { label: 'Korean', value: 'Korean' },
  ]);

  // Input States
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Validation functions
  const validateAge = (value) => {
    const ageNum = parseInt(value);
    if (!value) {
      return 'Age is required';
    } else if (isNaN(ageNum)) {
      return 'Age must be a number';
    } else if (ageNum < 18 || ageNum > 60) {
      return 'Age must be between 18 and 60 years';
    }
    return '';
  };

  const validateWeight = (value) => {
    const weightNum = parseFloat(value);
    if (!value) {
      return 'Weight is required';
    } else if (isNaN(weightNum)) {
      return 'Weight must be a number';
    } else if (weightNum < 30 || weightNum > 120) {
      return 'Weight must be between 30kg and 120kg';
    }
    return '';
  };

  const validateHeight = (value) => {
    const heightNum = parseFloat(value);
    if (!value) {
      return 'Height is required';
    } else if (isNaN(heightNum)) {
      return 'Height must be a number';
    } else if (heightNum < 152.4 || heightNum > 187.96) {
      return 'Height must be between 152.4cm and 187.96cm';
    }
    return '';
  };

  // Handle input changes with validation
  const handleAgeChange = (text) => {
    setAge(text);
    if (formSubmitted) {
      setAgeError(validateAge(text));
    }
  };

  const handleWeightChange = (text) => {
    setWeight(text);
    if (formSubmitted) {
      setWeightError(validateWeight(text));
    }
  };

  const handleHeightChange = (text) => {
    setHeight(text);
    if (formSubmitted) {
      setHeightError(validateHeight(text));
    }
  };

  const handleGenderChange = (value) => {
    setGender(value);
    if (formSubmitted && !value) {
      setGenderError('Gender is required');
    } else {
      setGenderError('');
    }
  };

  const handleActivityChange = (value) => {
    setActivity(value);
    if (formSubmitted && !value) {
      setActivityError('Activity factor is required');
    } else {
      setActivityError('');
    }
  };

  const handleCuisineChange = (value) => {
    setCuisine(value);
    if (formSubmitted && !value) {
      setCuisineError('Cuisine preference is required');
    } else {
      setCuisineError('');
    }
  };

  // Map activity level to numeric factor
  const getActivityFactor = (activityValue) => {
    const activityMap = {
      'sedentary': 1.3,
      'light': 1.5,
      'moderate': 1.7,
      'active': 1.9
    };
    return activityMap[activityValue] || 1.5; // Default to 1.5 if not found
  };

  const validateAllFields = () => {
    const ageValidation = validateAge(age);
    const weightValidation = validateWeight(weight);
    const heightValidation = validateHeight(height);
    
    setAgeError(ageValidation);
    setWeightError(weightValidation);
    setHeightError(heightValidation);
    
    if (!gender) {
      setGenderError('Gender is required');
    } else {
      setGenderError('');
    }
    
    if (!activity) {
      setActivityError('Activity factor is required');
    } else {
      setActivityError('');
    }
    
    if (!cuisine) {
      setCuisineError('Cuisine preference is required');
    } else {
      setCuisineError('');
    }
    
    return !ageValidation && !weightValidation && !heightValidation && 
           gender && activity && cuisine;
  };

  const handleNext = () => {
    setFormSubmitted(true);
    
    if (validateAllFields()) {
      // Calculate activity factor
      const activity_factor = getActivityFactor(activity);
      
      // Pass all data to the next screen
      router.push({
        pathname: '/profileonboarding/step3',
        params: { 
          email,
          gender,
          age,
          weight,
          height,
          activity_factor: activity_factor.toString(),
          cuisine
        }
      });
    } else {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all required fields correctly before proceeding.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Step Indicator */}
          <View style={styles.stepContainer}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Let's Complete Your Profile</Text>
          <Text style={styles.subtitle}>It will help us know more about you</Text>

          {/* Display email if available */}


          {/* Gender Dropdown */}
          <DropDownPicker
            open={genderOpen}
            value={gender}
            items={genderItems}
            setOpen={setGenderOpen}
            setValue={handleGenderChange}
            setItems={setGenderItems}
            placeholder="Choose Gender"
            containerStyle={styles.dropdownContainer}
            style={[styles.dropdown, genderError ? styles.inputError : null]}
            zIndex={3000}
          />
          {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}

          {/* Age Input */}
          <View style={[styles.inputContainer, ageError ? styles.inputError : null]}>
            <Ionicons name="calendar-outline" size={20} color={ageError ? "red" : "gray"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Age (18-60 years)"
              value={age}
              onChangeText={handleAgeChange}
              keyboardType="numeric"
            />
          </View>
          {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

          {/* Weight Input */}
          <View style={[styles.inputContainer, weightError ? styles.inputError : null]}>
            <Ionicons name="barbell-outline" size={20} color={weightError ? "red" : "gray"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Weight in kg's (30-120kg)"
              value={weight}
              onChangeText={handleWeightChange}
              keyboardType="numeric"
            />
          </View>
          {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}

          {/* Height Input */}
          <View style={[styles.inputContainer, heightError ? styles.inputError : null]}>
            <Ionicons name="body-outline" size={20} color={heightError ? "red" : "gray"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Height in cm's (152.4-187.96cm)"
              value={height}
              onChangeText={handleHeightChange}
              keyboardType="numeric"
            />
          </View>
          {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}

          {/* Activity Factor Dropdown */}
          <DropDownPicker
            open={activityOpen}
            value={activity}
            items={activityItems}
            setOpen={setActivityOpen}
            setValue={handleActivityChange}
            setItems={setActivityItems}
            placeholder="Activity Factor"
            containerStyle={styles.dropdownContainer}
            style={[styles.dropdown, activityError ? styles.inputError : null]}
            zIndex={2000}
          />
          {activityError ? <Text style={styles.errorText}>{activityError}</Text> : null}

          {/* Cuisine Preference Dropdown */}
          <DropDownPicker
            open={cuisineOpen}
            value={cuisine}
            items={cuisineItems}
            setOpen={setCuisineOpen}
            setValue={handleCuisineChange}
            setItems={setCuisineItems}
            placeholder="Cuisine Preference"
            containerStyle={styles.dropdownContainer}
            style={[styles.dropdown, cuisineError ? styles.inputError : null]}
            zIndex={1000}
          />
          {cuisineError ? <Text style={styles.errorText}>{cuisineError}</Text> : null}

          {/* Next Button */}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  stepContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20 },
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emailValue: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 5,
  },
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
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  dropdownContainer: { marginBottom: 5 }, // Reduced to accommodate error text
  dropdown: { backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: 'gray' },
  button: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    width: 16,
  },
});
