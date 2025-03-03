import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingStep4() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState(null);

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
        style={[styles.option, selectedGoal === 'lose' && styles.selectedOption]}
        onPress={() => setSelectedGoal('lose')}
      >
        <Text style={styles.optionText}>Lose weight</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selectedGoal === 'gain' && styles.selectedOption]}
        onPress={() => setSelectedGoal('gain')}
      >
        <Text style={styles.optionText}>Gain weight</Text>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.prevButton} onPress={() => router.back()}>
          <Text style={styles.prevText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !selectedGoal && styles.disabledButton]}
          onPress={() => selectedGoal && router.push('/profileonboarding/preparingplan')}
          disabled={!selectedGoal}
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
