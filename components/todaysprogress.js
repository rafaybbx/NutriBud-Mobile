import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const ProgressCard = ({ calories, fatPercentage, proteinPercentage, carbPercentage, isCaloriesIncreasing = true }) => {
  // Function to render a progress circle
  const ProgressCircle = ({ percentage, label, size = 60, strokeWidth = 6 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <View style={styles.progressCircleContainer}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size/2}, ${size/2}`}>
            {/* Background Circle */}
            <Circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke="white"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke="#4CAF50"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressPercentage}>{percentage}%</Text>
          <Text style={styles.progressLabel}>{label}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
colors={['#E8F8E6', '#C1F4C5']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <View style={styles.caloriesContainer}>
            <View style={styles.caloriesTextContainer}>
              <Ionicons 
                name={isCaloriesIncreasing ? "arrow-up" : "arrow-down"} 
                size={20} 
                color={isCaloriesIncreasing ? "#4CAF50" : "#FF5252"} 
              />
              <Text style={styles.caloriesValue}>{calories.toLocaleString()}</Text>
            </View>
            <Text style={styles.caloriesLabel}>Calories</Text>
          </View>
          
          <View style={styles.macrosContainer}>
            <ProgressCircle percentage={fatPercentage} label="Fat" />
            <ProgressCircle percentage={proteinPercentage} label="Pro" />
            <ProgressCircle percentage={carbPercentage} label="Carb" />
          </View>
        </View>
        
        <View style={styles.motivationContainer}>
          <Ionicons name="sunny" size={20} color="#FFC107" />
          <Text style={styles.motivationText}>Keep the pace! You're doing great.</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '92%',
    borderRadius: 16,
    overflow: 'hidden', // Ensure gradient doesn't overflow rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMore: {
    fontSize: 14,
    color: '#4CAF50',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesContainer: {
    flex: 1,
  },
  caloriesTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#666',
  },
  macrosContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 60,
    height: 60,
  },
  progressLabelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 10,
    color: '#666',
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.7)', // Semi-transparent background
    borderRadius: 16,
    padding: 12,
  },
  motivationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

// Example usage
