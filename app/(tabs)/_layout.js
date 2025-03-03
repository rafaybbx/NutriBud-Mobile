// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import CustomHeader from '../../components/header';


// export default function TabsLayout() {


//  // You would get these values from your authentication context or state management
//   const userName = "Abdul Rafay";
//   const profileImageUrl = null; // Add your profile image URL here
//   const hasNotifications = true;
  
//   const handleProfilePress = () => {
//     // Navigate to profile screen or open profile modal
//     console.log('Profile pressed');
//   };
  
//   const handleNotificationPress = () => {
//     // Navigate to notifications screen or open notifications modal
//     console.log('Notification pressed');
//   };






//   return (

//     <Tabs>
//         <Tabs.Screen 
//             name="progress" 
//             options={{ 
//             title: 'Progress', 
//             tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
            
//             }} 
//         />
//         <Tabs.Screen 
//             name="workout" 
//             options={{ 
//             title: 'Workout', 
//             tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" size={size} color={color} />,
//             }} 
//         />  
//         <Tabs.Screen 
//             name="home" 
//             options={{ 
//             title: 'Home', 
//             tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
            
//             }} 
//         />  
//         <Tabs.Screen 
//             name="marketplace" 
//             options={{ 
//             title: 'Marketplace', 
//             tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
//             headerShown: false,
//             }} 
//         />  
//         <Tabs.Screen 
//             name="services" 
//             options={{ 
//             title: 'Services', 
//             tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
//             }} 
//         />  

//       </Tabs>
//   );
// }
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/header'; // Adjust the import path as needed
import { useRouter } from "expo-router";


export default function AppLayout() {
  // You would get these values from your authentication context or state management
  const userName = "Abdul Rafay";
  const profileImageUrl = null; // Add your profile image URL here
  const hasNotifications = true;
    const router = useRouter();

  const handleProfilePress = () => {
    // Navigate to profile screen or open profile modal
    console.log('Profile pressed');
  };
  
  const handleNotificationPress = () => {
    // Navigate to notifications screen or open notifications modal
    console.log('Notification pressed');
  };

  return (
    <View style={styles.container}>
      {/* Custom Header that stays consistent across tabs */}
      <CustomHeader 
        userName={userName}
        profileImageUrl={profileImageUrl}
        hasNotifications={hasNotifications}
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
      />
      
      {/* Tab Navigation */}
      <Tabs
        screenOptions={{
          headerShown: false, // Hide the default header
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen 
            name="progress" 
            options={{ 
            title: 'Progress', 
            tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
            
            }} 
        />
        <Tabs.Screen 
            name="workout" 
            options={{ 
            title: 'Workout', 
            tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" size={size} color={color} />,
            }} 
        />  
        <Tabs.Screen 
            name="home" 
            options={{ 
            title: 'Home', 
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
            
            }} 
        />  
        <Tabs.Screen 
            name="marketplace" 
            options={{ 
            title: 'Marketplace', 
            tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
            headerShown: false,
            }} 
        />  
        <Tabs.Screen 
            name="services" 
            options={{ 
            title: 'Services', 
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
            }} 
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});
