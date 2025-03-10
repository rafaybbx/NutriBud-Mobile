import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import { AuthProvider } from "../contexts/AuthContext";
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useAuth } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";

const preloadImages = () => {
  const images = [
    require('../assets/o1.png'),
    require('../assets/o2.png'),
    require('../assets/o3.png'),
    require('../assets/succ.png'),
    require('../assets/otp.png'),
    require('../assets/enteremail.png'),
    require('../assets/resetpass.png'),
    require('../assets/welcome.png'),
    require('../assets/welcome2.png'),
    require('../assets/enterdetails.png'),
    require('../assets/bg3.png'),
    require('../assets/food.png'),
    require('../assets/ramen.png'),
  ];

  // Preload each image
  return Promise.all(images.map(image => Asset.fromModule(image).downloadAsync()));
};

// Helper function to check if user has seen onboarding
async function getHasSeenOnboarding() {
  try {
    const value = await SecureStore.getItemAsync('hasSeenOnboarding');
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

// Root layout with navigation logic
function RootLayoutNav() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images on mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        await preloadImages();
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        // Continue even if image loading fails
        setImagesLoaded(true);
      }
    };
    
    loadAssets();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    // Wait for both auth check and images to load
    if (authLoading || !imagesLoaded) return;

    const navigateBasedOnAuth = async () => {
      try {
        if (isAuthenticated) {
          console.log("User is authenticated, navigating to home");
          await router.replace("/(tabs)/home");
        } else {
          // Check if we should show onboarding
          const hasSeenOnboarding = await getHasSeenOnboarding();
          
          if (hasSeenOnboarding) {
            console.log("User has seen onboarding, navigating to login");
            await router.replace("/auth/login");
          } else {
            console.log("First time user, showing onboarding");
            await router.replace("/onboarding/index");
          }
        }
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        // Set loading to false after navigation completes
        setLoading(false);
      }
    };

    // Add a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      navigateBasedOnAuth();
    }, 500);

    return () => clearTimeout(timer);
  }, [authLoading, imagesLoaded, isAuthenticated, router]);

  // Render the app structure
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Full-screen loading spinner */}
      {(loading || authLoading || !imagesLoaded) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}
      
      {/* Stack navigator */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// Main export
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 999, // Ensure it's above everything else
  },
});
