import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function OnboardingStep4() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [goal, setGoal] = useState(null);
  const [userData, setUserData] = useState({});
  const [email, setEmail] = useState('');
  const [restrictions, setRestrictions] = useState([]);

  useEffect(() => {
    if (params) {
      console.log("Received params in step4:", params);
      
      // Extract email separately
      if (params.email) {
        setEmail(params.email);
      }
      
      // Parse restrictions from JSON string
      let parsedRestrictions = [];
      if (params.restrictions) {
        try {
          parsedRestrictions = JSON.parse(params.restrictions);
          setRestrictions(parsedRestrictions);
        } catch (error) {
          console.error("Error parsing restrictions:", error);
        }
      }
      
      // Set other user data with proper type conversion
      setUserData({
        age: params.age ? parseInt(params.age) : 0,
        height: params.height ? parseFloat(params.height) : 0,
        weight: params.weight ? parseFloat(params.weight) : 0,
        gender: params.gender || '',
        activity_factor: params.activityFactor ? parseFloat(params.activityFactor) : 1.5,
        cuisine: params.cuisine || ''
      });
    }
  }, []);

  const handleNext = () => {
    if (!goal) return;
    
    // Format data in the required order and format
    const formattedData = {
      age: userData.age,
      height: userData.height,
      weight: userData.weight,
      gender: userData.gender,
      goal: goal,
      activity_factor: userData.activity_factor,
      cuisine: userData.cuisine,
      restrictions: restrictions
    };
    
    // Log the formatted data
    console.log("Formatted user data:", formattedData);
    console.log("User email:", email);
    
    // Navigate to the next screen with all data
    router.push({
      pathname: '/profileonboarding/preparingplan',
      params: {
        ...formattedData,
        email: email,
        // Convert objects/arrays to JSON strings for passing as params
        restrictions: JSON.stringify(restrictions)
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.stepContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>What is Your Goal?</Text>
      <Text style={styles.subtitle}>It will help us make your personal plan</Text>

      {/* Goal Selection */}
      <TouchableOpacity
        style={[styles.option, goal === 'Fat Loss' && styles.selectedOption]}
        onPress={() => setGoal('Fat Loss')}
      >
        <Text style={styles.optionText}>Fat Loss</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, goal === 'Muscle Gain' && styles.selectedOption]}
        onPress={() => setGoal('Muscle Gain')}
      >
        <Text style={styles.optionText}>Muscle Gain</Text>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.prevButton} onPress={() => router.back()}>
          <Text style={styles.prevText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !goal && styles.disabledButton]}
          onPress={handleNext}
          disabled={!goal}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  activeCircle: { backgroundColor: '#4CAF50' },
  circleText: { color: '#fff', fontWeight: 'bold' },
  line: { width: 30, height: 4, backgroundColor: '#ccc', marginHorizontal: 5 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  option: { backgroundColor: '#F5F5F5', padding: 20, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  selectedOption: { backgroundColor: '#4CAF50' },
  optionText: { fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  prevButton: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
  prevText: { color: 'black', fontWeight: 'bold' },
  nextButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  disabledButton: { backgroundColor: '#A5D6A7' },
  nextText: { color: 'white', fontWeight: 'bold' },
  stepContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, backgroundColor: '#ccc', borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#4CAF50', width: 16 },
});
