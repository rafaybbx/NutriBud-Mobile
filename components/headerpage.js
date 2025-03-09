import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const CustomPageHeader = ({ pageTitle = "Page Title" }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#333" />
      </TouchableOpacity>
      
      <View style={styles.centerSection}>
        <Text style={styles.nameText}>{pageTitle}</Text>
      </View>
      <View style={styles.notificationButton2}>
        <Text style={styles.nameText}></Text>
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
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  notificationButton2: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
});

export default CustomPageHeader;
