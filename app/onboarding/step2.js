import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const Onboarding3 = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/o1.png")} style={styles.image} />
      <Text style={styles.title}>Make connections</Text>
      <Text style={styles.subtitle}>To your health journey</Text>
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/auth/login")}>
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding3;

// Use the same styles from previous onboarding screens


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "55%",
    resizeMode: "cover",
    marginBottom: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
