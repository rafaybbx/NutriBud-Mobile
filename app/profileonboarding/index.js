import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/food.png")}// Replace with actual image URL
        style={styles.image}
      />
      <Text style={styles.title}>Enjoy your lunch time</Text>
      <Text style={styles.description}>
        Just relax and not overthink what to eat. This is on our side with our 
        personalized meal plans just prepared and adapted to your needs.
      </Text>
      <View style={styles.pagination}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/profileonboarding/step2')}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  image: {
    width: '320',
    height: 320,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 10,
  },
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
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
