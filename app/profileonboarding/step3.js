// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function OnboardingStep3() {
//   const router = useRouter();
  
//   // State for input and selected restrictions
//   const [customIngredients, setCustomIngredients] = useState('');
//   const [selectedIngredients, setSelectedIngredients] = useState([]);

//   const ingredients = [
//     'Gluten', 'Dairy', 'Egg', 'Soy', 'Peanut', 'Wheat', 'Milk', 'Fish'
//   ];

//   const toggleIngredient = (ingredient) => {
//     if (selectedIngredients.includes(ingredient)) {
//       setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
//     } else {
//       setSelectedIngredients([...selectedIngredients, ingredient]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Step Indicator */}
//       <View style={styles.stepContainer}>
//         <View style={styles.dot} />
//         <View style={styles.dot} />
//         <View style={[styles.dot, styles.activeDot]} />
//         <View style={styles.dot} />
//       </View>

//       {/* Title & Subtitle */}
//       <Text style={styles.title}>Any ingredient restrictions?</Text>
//       <Text style={styles.subtitle}>
//         To offer you the best tailored diet experience we need to know more about you. 
//         Enter your preferences in a comma-separated list below.
//       </Text>

//       {/* Ingredient Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Ingredients"
//         value={customIngredients}
//         onChangeText={setCustomIngredients}
//       />

//       {/* Ingredient Buttons */}
//       <View style={styles.ingredientContainer}>
//         {ingredients.map((ingredient) => (
//           <TouchableOpacity
//             key={ingredient}
//             style={[styles.ingredientButton, selectedIngredients.includes(ingredient) && styles.selectedButton]}
//             onPress={() => toggleIngredient(ingredient)}
//           >
//             <Text style={selectedIngredients.includes(ingredient) ? styles.selectedText : styles.ingredientText}>
//               {ingredient}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Navigation Buttons */}
//       <View style={styles.navContainer}>
//         <TouchableOpacity style={styles.prevButton} onPress={() => router.back()}>
//           <Text style={styles.prevText}>Previous</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/profileonboarding/step4')}>
//           <Text style={styles.nextText}>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
//   stepContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
//   dot: { width: 8, height: 8, backgroundColor: '#ccc', borderRadius: 4, marginHorizontal: 4 },
//   activeDot: { backgroundColor: '#4CAF50', width: 16 },
//   title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
//   subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
//   input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, marginBottom: 15 },
//   ingredientContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   ingredientButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, margin: 5 },
//   selectedButton: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
//   ingredientText: { color: '#333' },
//   selectedText: { color: '#fff' },
//   navContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
//   prevButton: { backgroundColor: '#F5F5F5', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8 },
//   prevText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
//   nextButton: { backgroundColor: '#4CAF50', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8 },
//   nextText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
// });
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView} from 'react-native';

export default function OnboardingStep3() {
  const router = useRouter();

  // State for input and selected restrictions
  const [customIngredients, setCustomIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const ingredients = [
    'Gluten', 'Dairy', 'Egg', 'Soy', 'Peanut', 'Wheat', 'Milk', 'Fish'
  ];

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Step Indicator */}
          <View style={styles.stepContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Any ingredient restrictions?</Text>
          <Text style={styles.subtitle}>
            To offer you the best tailored diet experience we need to know more about you. 
            Enter your preferences in a comma-separated list below.
          </Text>

          {/* Ingredient Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Ingredients"
            value={customIngredients}
            onChangeText={setCustomIngredients}
          />

          {/* Ingredient Buttons */}
          <View style={styles.ingredientContainer}>
            {ingredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient}
                style={[styles.ingredientButton, selectedIngredients.includes(ingredient) && styles.selectedButton]}
                onPress={() => toggleIngredient(ingredient)}
              >
                <Text style={selectedIngredients.includes(ingredient) ? styles.selectedText : styles.ingredientText}>
                  {ingredient}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navContainer}>
            <TouchableOpacity style={styles.prevButton} onPress={() => router.back()}>
              <Text style={styles.prevText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/profileonboarding/step4')}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  stepContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, backgroundColor: '#ccc', borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#4CAF50', width: 16 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, marginBottom: 15 },
  ingredientContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  ingredientButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, margin: 5 },
  selectedButton: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  ingredientText: { color: '#333' },
  selectedText: { color: '#fff' },
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  prevButton: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
  prevText: { color: 'black', fontWeight: 'bold' },
  nextButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  nextText: { color: 'white', fontWeight: 'bold' },
});
