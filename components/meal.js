import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";

export const MealCard = ({ mealType, calories, items, macros }) => {
    const router = useRouter();



  return (
    <TouchableOpacity style={styles.card}  onPress={() => router.push({ pathname: "/pages/mealdetails", params: { title: " Meal Details" } })}>
      <LinearGradient
colors={['#C1F4C5', '#E8F8E6']}
        style={styles.gradient}
         start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.mealTitle}>{mealType}</Text>
            <Text style={styles.caloriesText}>({calories} kcal)</Text>
            {items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.bullet} />
                <Text style={styles.itemText}>{item.name} {item.amount}</Text>
                <Text style={styles.itemCalories}>({item.calories} Cal)</Text>
              </View>
            ))}
          </View>

          <View style={styles.rightContent}>
            <Image
              source={require('../assets/food.png')}
              style={styles.mealImage}
              resizeMode="contain"
            />
          </View>
        </View>
        
        <View style={styles.macrosContainer}>
          {Object.entries(macros).map(([key, value], index) => (
            <View key={index} style={styles.macroItem}>
              <Text style={styles.macroText}>{key} {value}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  macroItem: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  macroText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
    // backgroundColor:'red',
    marginLeft:-40,
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
