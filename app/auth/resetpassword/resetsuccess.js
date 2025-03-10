import {
  View, Text, Image, StyleSheet, TouchableOpacity, BackHandler
} from 'react-native';
import { useRouter } from "expo-router";
import { useEffect } from 'react';
import * as SecureStore from "expo-secure-store";

export default function ResetSuccess() {
  const router = useRouter();

  // Immediately clear data and set up navigation on component mount
  useEffect(() => {
    // Clear all reset-related data
    const clearAllResetData = async () => {
      try {
        // Clear all reset-specific data
        await SecureStore.deleteItemAsync('resetEmail');
        await SecureStore.deleteItemAsync('verificationCode');
        
        // Set hasSeenOnboarding to true to prevent onboarding redirect
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        
        // Add a small delay before navigation to ensure data is cleared
        setTimeout(async () => {
          console.log("Setting comingFromReset flag before navigating...");
          await SecureStore.setItemAsync('comingFromReset', 'true');  // Explicitly set flag
          router.replace("/auth/login");
        }, 300);

      } catch (error) {
        console.error("Error in reset success cleanup:", error);
        // Even if there's an error, try to navigate to login
        router.replace("/auth/login");
      }
    };
    
    // Prevent back navigation
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace("/auth/login");
      return true;
    });
    
    clearAllResetData();
    
    return () => backHandler.remove();
  }, []);

  // If user clicks the button, also navigate to login
  const handleGoToLogin = () => {
    router.replace("/auth/login");
  };

  // Add this function to directly navigate to login without using the router
  const navigateToLogin = () => {
    // Use a more direct approach to navigate to login
    const resetAction = {
      index: 0,
      routes: [{ name: 'auth', params: { screen: 'login' } }],
    };
    
    // If you have access to the navigation object
    if (navigation) {
      navigation.reset(resetAction);
    } else {
      // Fallback to router
      router.replace("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/succ.png')} style={styles.illustration} />
      
      <Text style={styles.title}>Password Reset Successful!</Text>
      <Text style={styles.subtitle}>
        Your password has been reset successfully. You can now log in with your new password.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGoToLogin}
      >
        <Text style={styles.buttonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  illustration: { 
    width: 200, 
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 30 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center',
    color: '#4CAF50'
  },
  subtitle: { 
    fontSize: 16, 
    color: 'gray', 
    textAlign: 'center', 
    marginBottom: 30,
    paddingHorizontal: 20
  },
  button: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 15, 
    paddingHorizontal: 30,
    borderRadius: 10, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
