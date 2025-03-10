import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";


const CustomHeader = ({
  userName = "Abdul Rafay",
  profileImageUrl,
  hasNotifications = true,
  onProfilePress,
  onNotificationPress
}) => {
  const insets = useSafeAreaInsets();
    const router = useRouter();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome Back,</Text>
        <Text style={styles.nameText}>{userName}!</Text>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => router.push({ pathname: "/pages/notifications", params: { title: " Notifications " } })}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {hasNotifications && (
            <View style={styles.notificationDot} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push({ pathname: "/pages/profile", params: { title: " Settings & Profile " } })}
          activeOpacity={0.8}
        >
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: '#F5F5F5',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
  },
});

export default CustomHeader;
