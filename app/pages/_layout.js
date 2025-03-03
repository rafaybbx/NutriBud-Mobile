import { Stack } from "expo-router";
import CustomPageHeader from "../../components/headerpage";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';

export default function PagesLayout() {
  return (
    <View>
    <CustomPageHeader/>
    <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="notifications" />      
    </Stack>
    </View>
  );
}
