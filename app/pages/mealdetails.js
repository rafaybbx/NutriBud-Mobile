import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define the heights and positions
const HEADER_HEIGHT = 100; // Approximate header height including safe area
const START_HEIGHT = SCREEN_HEIGHT * 0.5; // Start at 50% of the screen
const MAX_HEIGHT = SCREEN_HEIGHT * 0.75;  // Max height is 75% of the screen
const MIN_TRANSLATE_Y = -(MAX_HEIGHT - START_HEIGHT); // Negative value to move up

export default function RecipeDetailScreen() {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current; 
  const lastGestureDy = useRef(0);
  const scrollOffset = useRef(0);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy } = gestureState;
        
        // If sheet is fully expanded and user is trying to scroll down, 
        // let the ScrollView handle it
        if (isFullyExpanded && lastGestureDy.current === MIN_TRANSLATE_Y && dy > 0) {
          // Only if we're at the top of the ScrollView
          if (scrollOffset.current <= 0) {
            return true; // Let the pan responder handle it
          }
          return false; // Let the ScrollView handle it
        }
        
        // Otherwise, always let the pan responder handle vertical gestures
        return Math.abs(dy) > 5;
      },
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (_, gestureState) => {
        if (scrollOffset.current > 0) return;

        const { dy } = gestureState;
        let newValue = dy;

        // Limit upward movement to not go beyond MAX_HEIGHT (75% of screen)
        if (lastGestureDy.current + newValue < MIN_TRANSLATE_Y) {
          newValue = MIN_TRANSLATE_Y - lastGestureDy.current;
        }
        
        // Limit downward movement to not go below starting position
        if (lastGestureDy.current + newValue > 0) {
          newValue = -lastGestureDy.current;
        }

        translateY.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        const { dy } = gestureState;

        if (scrollOffset.current > 0) return;

        // If swiped up significantly, snap to expanded position
        if (dy < -20) {
          snapToExpanded();
        } 
        // If swiped down significantly, snap to starting position
        else if (dy > 20) {
          snapToStart();
        }
        // Otherwise, snap to closest position
        else {
          const currentPosition = lastGestureDy.current + dy;
          if (currentPosition < MIN_TRANSLATE_Y / 2) {
            snapToExpanded();
          } else {
            snapToStart();
          }
        }
      }
    })
  ).current;

  const snapToExpanded = () => {
    lastGestureDy.current = MIN_TRANSLATE_Y;
    Animated.spring(translateY, {
      toValue: MIN_TRANSLATE_Y,
      useNativeDriver: true,
    }).start(() => {
      setIsFullyExpanded(true);
    });
  };

  const snapToStart = () => {
    lastGestureDy.current = 0;
    setIsFullyExpanded(false);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/ramen.png')} style={styles.recipeImage} />
      
      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          { transform: [{ translateY }] }
        ]}
        {...panResponder.panHandlers}
      >


        <View style={styles.handleIndicator} />

        <View style={styles.titleContainer}>

          <Text style={styles.recipeTitle}>Ramen</Text>
          <Text style={styles.recipeSubtitle}>Lunch / 15 mins</Text>
        </View>

        <View style={styles.nutritionContainer}>
          {["100 k", "15 g", "58 g", "20 g"].map((value, index) => (
            <View key={index} style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{value}</Text>
              <Text style={styles.nutritionLabel}>
                {["Energy", "Protein", "Carbs", "Fat"][index]}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredients</Text>

          <Text style={styles.servings}>2 serves</Text>
          <View style={styles.servingControls}>

            <TouchableOpacity style={styles.servingButton}>
              <Ionicons name="remove" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.servingButton}>
              <Ionicons name="add" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>



        {/* Scrollable Ingredients List */}
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.ingredientsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          scrollEnabled={isFullyExpanded}
        >
          {[
            { name: "Chicken breasts", amount: "250 g" },
            { name: "Unsalted butter", amount: "1 tbsp" },
            { name: "Sesame oil", amount: "2 tsp" },
            { name: "Fresh ginger", amount: "2 tsp" },
            { name: "Large eggs", amount: "100 g" },
            { name: "Ramen noodles", amount: "200 g" },
            { name: "Bok choy", amount: "2 pieces" },
            { name: "Green onions", amount: "3 stalks" },
          ].map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Fixed "Start Cooking" Button - Always Stays at Bottom */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.startCookingButton}>
          <Text style={styles.startCookingText}>Start cooking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
    // backgroundColor: 'blue' 
  },
  recipeImage: { 
    width: '100%', 
    height: SCREEN_HEIGHT * 0.5, 
    resizeMode: 'cover' 
  },
  bottomSheet: {
    position: 'absolute',
    bottom: -200, // Extend 100px below the screen
    left: 0,
    right: 0,
    height: START_HEIGHT + 200, // Add extra height to compensate
    backgroundColor: 'white', // Changed to orange as requested earlier
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  handleIndicator: { 
    width: 40, 
    height: 5, 
    backgroundColor: '#e0e0e0', // Change back from green to light gray
    borderRadius: 3, 
    alignSelf: 'center', 
    marginVertical: 10 
  },
  titleContainer: { 
    alignItems: 'center', 
    marginBottom: 20,
  },
  refreshButton: { 
    position: 'absolute', 
    left: 0, 
    top: 0, 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  recipeTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  recipeSubtitle: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center' 
  },
  nutritionContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  nutritionItem: { 
    alignItems: 'center' 
  },
  nutritionValue: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  nutritionLabel: { 
    fontSize: 14, 
    color: '#666' 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  servings: { 
    fontSize: 14, 
    color: '#666', 
    marginLeft: 10 
  },
  servingControls: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  servingButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  ingredientsList: { 
    flex: 1, 
    height: '100%',
  },
  ingredientItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  ingredientName: { 
    fontSize: 16 
  },
  ingredientAmount: { 
    fontSize: 16, 
    color: '#999' 
  },
  fixedButtonContainer: { 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20,
    zIndex: 10 // Ensure button stays on top
  },
  startCookingButton: { 
    backgroundColor: '#4CAF50', 
    borderRadius: 10, 
    paddingVertical: 15, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  startCookingText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
