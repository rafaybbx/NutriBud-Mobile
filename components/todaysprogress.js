import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

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
              stroke="#E6E6E6"
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Progress</Text>
        <TouchableOpacity>
          <Text style={styles.viewMore}>View more</Text>
        </TouchableOpacity>
      </View>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '92%',
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
    backgroundColor: '#F5F5F5',
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
