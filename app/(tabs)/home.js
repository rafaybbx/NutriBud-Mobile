import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MealCardExample, { MealCard } from '../../components/meal';
import { ProgressCard } from '../../components/todaysprogress';

export default function HomeScreen() {
    const breakfastData = {
    mealType: "Breakfast",
    calories: "426",
    items: [
      { name: "Egg", amount: "2", calories: "80" },
      { name: "Salad", amount: "20gm", calories: "100" }
    ],
    macros: {
      "Protein": "40%",
      "Carbs": "40%",
      "Fat": "40%"
    }
  };

  const progressData = {
    calories: 1284,
    fatPercentage: 29,
    proteinPercentage: 65,
    carbPercentage: 85,
    isCaloriesIncreasing: true
  };


  return (
    <SafeAreaView>
    
    <ScrollView>
    
    <View style={styles.container}>
    
    <ProgressCard {...progressData}/>
    <MealCard {...breakfastData} />
    
    
    </View>
    <Text >Welcome to NutriBud!</Text>
    
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
