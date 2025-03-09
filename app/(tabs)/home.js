import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MealCardExample, { MealCard } from '../../components/meal';
import { ProgressCard } from '../../components/todaysprogress';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

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

  // Add state for the timer
  const [timeRemaining, setTimeRemaining] = useState("01:30:00");
  
  // Add state for chat modal
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, message: "Hello! How can I help you today?", isBot: true }
  ]);

  // Add this near the top of your component
  const scrollViewRef = useRef(null);

  // Update the handleSendMessage function to scroll to bottom
  const handleSendMessage = () => {
    if (chatMessage.trim() === '') return;
    
    // Add user message to chat history
    const newUserMessage = { id: chatHistory.length + 1, message: chatMessage, isBot: false };
    setChatHistory([...chatHistory, newUserMessage]);
    
    // Clear input
    setChatMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate bot response (you would replace this with actual API call)
    setTimeout(() => {
      const botResponse = { 
        id: chatHistory.length + 2, 
        message: "I'm your nutrition assistant. I can help you with meal planning and tracking your progress.", 
        isBot: true 
      };
      setChatHistory(prevHistory => [...prevHistory, botResponse]);
      
      // Scroll to bottom again after bot response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  // Timer logic (optional - uncomment if you want a working timer)
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      // Example timer logic - you can customize this
      const [hours, minutes, seconds] = timeRemaining.split(':').map(Number);
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      if (totalSeconds > 0) {
        totalSeconds -= 1;
        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;
        
        setTimeRemaining(
          `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);
  */

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Today's Progress</Text>
            <TouchableOpacity>
              <LinearGradient
                
                colors={['#2d6a4f', '#4CAF50']}
                style={styles.viewMorePill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.viewMore}>View more</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ProgressCard {...progressData} />

          <View style={styles.header}>
            <Text style={styles.title}>Next Meal</Text>
            <LinearGradient
              colors={['#2d6a4f', '#4CAF50']}
              style={styles.viewMorePill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.viewMore}>{timeRemaining}</Text>
            </LinearGradient>
          </View>

          <MealCard {...breakfastData} />

          
          
          {/* Add some padding at the bottom to ensure content isn't hidden behind the chat button */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>
      
      {/* Chat button fixed at bottom */}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => setChatModalVisible(true)}
      >
        <LinearGradient
          colors={['#2d6a4f', '#4CAF50']}
          style={styles.chatButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >

          <Ionicons name="chatbubble-outline" size={20} color="#fff" style={styles.chatIcon} />
          <Text style={styles.chatButtonText}>Ask NutriBud!</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Chat Modal */}
     <Modal
  animationType="slide"
  transparent={true}
  visible={chatModalVisible}
  onRequestClose={() => setChatModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>NutriBud Assistant</Text>
        <TouchableOpacity onPress={() => setChatModalVisible(false)}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyboardShouldPersistTaps="handled" // Allows input taps when keyboard is open
      >
        {chatHistory.map((chat) => (
          <View
            key={chat.id}
            style={[
              styles.chatBubble,
              chat.isBot ? styles.botBubble : styles.userBubble,
            ]}
          >
            <Text style={[styles.chatText, chat.isBot ? {} : { color: "#fff" }]}>
              {chat.message}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Only the input moves up when keyboard appears */}
      <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "position"} 
  keyboardVerticalOffset={171}        style={styles.inputContainer}

      >
        <TextInput
          style={styles.chatInput}
          placeholder="Type your message..."
          value={chatMessage}
          onChangeText={setChatMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    // paddingVertical: 10, // Reduced padding
    // backgroundColor:'green'
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    alignSelf: 'center',
    marginBottom: 11,
    marginTop: 11,
    paddingHorizontal: 4,
  },
    title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  viewMorePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMore: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginVertical: 10, // Reduce margin
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

  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  
  // Chat button styles
  chatButton: {
    position: 'absolute',
    bottom: 20,
    left: '4%',
    right: '4%',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden', // Important to keep the gradient within the rounded corners
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
  },
  chatIcon: {
    marginRight: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
