import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/onboarding");
    }, 2000); // 2 seconds delay
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>NutriBud</Text>
      <ActivityIndicator size="large" color="##4CAF50" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
