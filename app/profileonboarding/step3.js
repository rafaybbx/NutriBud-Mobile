import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native';
export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramsProcessed = useRef(false);
  
  // State for input and selected restrictions
  const [customIngredients, setCustomIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [customError, setCustomError] = useState('');
  
  // Store all params from previous screen
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    // Only process params once to prevent infinite loop
    if (!paramsProcessed.current && params) {
      console.log("Processing params in step3 (once):", params);
      
      setUserData({
        email: params.email || '',
        gender: params.gender || '',
        age: params.age || '',
        weight: params.weight || '',
        height: params.height || '',
        activity: params.activity || '',
        activityFactor: params.activityFactor || '',
        cuisine: params.cuisine || ''
      });
      
      paramsProcessed.current = true;
    }
  }, [params]);

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
  
  // Validate custom ingredients input
  const validateCustomIngredients = (text) => {
    setCustomIngredients(text);
    
    if (!text) {
      setCustomError('');
      return;
    }
    
    // Check if there are multiple words without commas
    const words = text.trim().split(/\s+/);
    const commas = text.split(',').length - 1;
    
    // If there are multiple words but not enough commas, it's not properly comma-separated
    if (words.length > 1 && commas === 0) {
      setCustomError('Please separate multiple ingredients with commas');
      return;
    }
    
    // Check if ingredients are comma-separated correctly
    const items = text.split(',').map(item => item.trim()).filter(item => item);
    
    if (items.length > 1) {
      // Multiple items should be comma-separated (already checked above)
      setCustomError('');
    } else if (items.length === 1) {
      // Single item is fine
      setCustomError('');
    } else {
      setCustomError('Please enter valid ingredients');
    }
  };
  
  // Prepare all restrictions (selected + custom)
  const getAllRestrictions = () => {
    let restrictions = [...selectedIngredients];
    
    if (customIngredients) {
      const customItems = customIngredients
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      // Add custom items to restrictions
      restrictions = [...restrictions, ...customItems];
    }
    
    // Remove duplicates
    return [...new Set(restrictions)];
  };
  
  const handleNext = () => {
    // If there's custom input, validate it first
    if (customIngredients) {
      // Re-validate to ensure it's properly formatted
      validateCustomIngredients(customIngredients);
      
      // Check if there's an error after validation
      if (customError) {
        Alert.alert(
          "Invalid Input",
          "Please ensure ingredients are properly comma-separated (e.g., 'Sugar, Nuts, Shellfish').",
          [{ text: "OK" }]
        );
        return;
      }
    }
    
    // Get all restrictions
    const restrictions = getAllRestrictions();
    
    // Log once before navigation
    console.log("Navigating to next screen with data:", {
      ...userData,
      restrictions
    });
    
    // Navigate to next screen with all data
    router.push({
      pathname: '/profileonboarding/step4',
      params: {
        ...userData,
        restrictions: JSON.stringify(restrictions)
      }
    });
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
            Select from common restrictions or enter your own below.
          </Text>
          
          {/* User Profile Summary */}


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

          {/* Custom Ingredient Input */}
          <Text style={styles.inputLabel}>Add your own restrictions (comma-separated):</Text>
          <TextInput
            style={[styles.input, customError ? styles.inputError : null]}
            placeholder="e.g., Sugar, Nuts, Shellfish"
            value={customIngredients}
            onChangeText={validateCustomIngredients}
          />
          {customError ? <Text style={styles.errorText}>{customError}</Text> : null}
          
          {/* Selected Restrictions */}
          {(selectedIngredients.length > 0 || customIngredients) && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedTitle}>Your Restrictions:</Text>
              <Text style={styles.selectedList}>
                {getAllRestrictions().join(', ') || 'None'}
              </Text>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navContainer}>
            <TouchableOpacity style={styles.prevButton} onPress={() => router.back()}>
              <Text style={styles.prevText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={handleNext}
            >
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
  summaryContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4CAF50',
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  input: { 
    backgroundColor: '#F5F5F5', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  ingredientContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 },
  ingredientButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, margin: 5 },
  selectedButton: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  ingredientText: { color: '#333' },
  selectedText: { color: '#fff' },
  selectedContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedList: {
    fontSize: 14,
    color: '#4CAF50',
  },
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  prevButton: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
  prevText: { color: 'black', fontWeight: 'bold' },
  nextButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, flex: 1, alignItems: 'center' },
  nextText: { color: 'white', fontWeight: 'bold' },
});
