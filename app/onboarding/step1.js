import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const Onboarding2 = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/o2.png")} style={styles.image} />
      <Text style={styles.title}>Eat Well</Text>
      <Text style={styles.subtitle}>To your desire</Text>
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/step2")}>
        <Text style={styles.buttonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding2;


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
