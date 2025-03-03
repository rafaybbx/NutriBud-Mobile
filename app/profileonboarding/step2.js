import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

export default function OnboardingStep2() {
  const router = useRouter();

  // Dropdown States
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ]);

  const [activityOpen, setActivityOpen] = useState(false);
  const [activity, setActivity] = useState(null);
  const [activityItems, setActivityItems] = useState([
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'light' },
    { label: 'Moderately Active', value: 'moderate' },
    { label: 'Very Active', value: 'active' },
  ]);

  // Input States
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

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

          {/* Gender Dropdown */}
          <DropDownPicker
            open={genderOpen}
            value={gender}
            items={genderItems}
            setOpen={setGenderOpen}
            setValue={setGender}
            setItems={setGenderItems}
            placeholder="Choose Gender"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
          />

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="barbell-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Weight in kg's"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          {/* Height Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="body-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Height in cm's"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>

          {/* Activity Factor Dropdown */}
          <DropDownPicker
            open={activityOpen}
            value={activity}
            items={activityItems}
            setOpen={setActivityOpen}
            setValue={setActivity}
            setItems={setActivityItems}
            placeholder="Activity Factor"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
          />

          {/* Next Button */}
          <TouchableOpacity style={styles.button} onPress={() => router.push('/profileonboarding/step3')}>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  dropdownContainer: { marginBottom: 15, zIndex: 1000 }, // Ensures dropdown works properly
  dropdown: { backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: 'gray' },
  button: { backgroundColor: 'green', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  pagination: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30,
  },
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
