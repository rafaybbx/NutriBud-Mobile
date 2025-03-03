import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const MealCard = ({ mealType, calories, items, macros }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.card}>
        <View style={styles.leftContent}>
          <View style={styles.pillContainer}>
            <LinearGradient
              colors={['#1a1a1a', '#333333']}
              style={styles.pill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.pillText}>Next meal</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.mealTitle}>{mealType}</Text>
          <Text style={styles.caloriesText}>({calories} kcal)</Text>
          
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.bullet} />
              <Text style={styles.itemText}>{item.name} {item.amount}</Text>
              <Text style={styles.itemCalories}>({item.calories} Cal)</Text>
            </View>
          ))}
          
          <View style={styles.macrosContainer}>
            {Object.entries(macros).map(([key, value], index) => (
              <View key={index} style={styles.macroItem}>
                <Text style={styles.macroText}>{key} {value}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.mealImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flex: 3,
    paddingRight: 10,
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContainer: {
    marginBottom: 10,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  pillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  caloriesText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginRight: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#444',
  },
  itemCalories: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  macrosContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'flex-start',
  },
  macroItem: {
    marginRight: 12,
  },
  macroText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

// Example usage
// export default function MealCardExample() {
//   const breakfastData = {
//     mealType: "Breakfast",
//     calories: "426 ",
//     items: [
//       { name: "Egg", amount: "2", calories: "80 " },
//       { name: "Salad", amount: "20gm", calories: "100 " }
//     ],
//     macros: {
//       "Protein": "40%",
//       "Carbs": "40%",
//       "Fat": "40%"
//     }
//   };

//   return <MealCard {...breakfastData} />;
// }
