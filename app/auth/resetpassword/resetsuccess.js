import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ResetSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/logo.png')} style={styles.image} />
      <Text style={styles.title}>Yey! Reset Successful</Text>
      <Text style={styles.subtitle}>
        You will be moved to the login screen right now.{'\n'}Login and enjoy the features!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/auth/login')}>
        <Text style={styles.buttonText}>Let's Explore</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
