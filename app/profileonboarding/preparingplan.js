import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';

export default function PreparingPlanScreen() {
  const [progress, setProgress] = useState(0);
  const router = useRouter(); // Expo Router Navigation

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval); // Stop progress
          setTimeout(() => router.push('/profileonboarding/end'), 500); // Navigate after 0.5s
          return 1;
        }
        return prev + 0.1; // Increment progress
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={require('../../assets/logo.png')} style={styles.image} />

      {/* Title */}
      <Text style={styles.title}>Preparing your plan</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Setting up your nutrition plan and analyzing your goals...
      </Text>

      {/* Progress Bar */}
      <Progress.Bar progress={progress} width={200} color="#4CAF50" style={styles.progressBar} />

      {/* Progress Percentage */}
      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBar: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});
