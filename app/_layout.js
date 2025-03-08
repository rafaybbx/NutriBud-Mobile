import { Stack } from "expo-router";
import React, { useEffect } from 'react';
import { Asset } from 'expo-asset';



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

  ];

  // Preload each image
  images.forEach(image => Asset.fromModule(image).downloadAsync());
};


export default function RootLayout() {

    useEffect(() => {
    // Preload images as soon as the screen is loaded
    preloadImages();
  }, []);



  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />      
    </Stack>
  );
}
