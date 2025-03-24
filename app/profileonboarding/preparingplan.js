import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Progress from 'react-native-progress';
import config from '../../config';

export default function PreparingPlanScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing your plan...');
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(() => {
    // Parse and format the data from params
    const formatUserData = () => {
      try {
        // Parse restrictions from JSON string
        let restrictions = [];
        if (params.restrictions) {
          try {
            restrictions = JSON.parse(params.restrictions);
          } catch (error) {
            console.error("Error parsing restrictions:", error);
          }
        }
        
        // Format data in the required structure
        return {
          age: params.age ? parseInt(params.age) : 0,
          height: params.height ? parseFloat(params.height) : 0,
          weight: params.weight ? parseFloat(params.weight) : 0,
          gender: params.gender || '',
          goal: params.goal || '',
          activity_factor: params.activity_factor ? parseFloat(params.activity_factor) : 1.5,
          cuisine: params.cuisine || '',
          restrictions: restrictions
        };
      } catch (error) {
        console.error("Error formatting user data:", error);
        return null;
      }
    };

    const makeApiCalls = async () => {
      try {
        const userData = formatUserData();
        if (!userData) {
          throw new Error("Failed to format user data");
        }
        
        console.log("Formatted user data for API:", userData);
        console.log("User email:", params.email);
        
        // Update progress
        setProgress(0.2);
        setStatus('Creating your diet plan...');
        
        // First API call to create diet plan
        const dietPlanResponse = await fetch(`${config.API_BASE_URL}/api/dietplan/dietplan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!dietPlanResponse.ok) {
          throw new Error(`Diet plan API error: ${dietPlanResponse.status}`);
        }
        
        const dietPlanData = await dietPlanResponse.json();
        console.log("Diet plan created successfully:", dietPlanData);
        
        // Update progress
        setProgress(0.6);
        setStatus('Updating your profile...');
        
        // Second API call to update user details
        const email = params.email;
        if (!email) {
          throw new Error("Email is required for updating user details");
        }
        
        // Prepare data for the second API call
        const userDetailsData = {
          age: userData.age,
          gender: userData.gender,
          height: userData.height,
          weight: userData.weight,
          cuisine: Array.isArray(userData.cuisine) ? userData.cuisine : [userData.cuisine],
          goal: userData.goal,
          activity_factor: userData.activity_factor,
          profilePicture: "https://example.com/profile.jpg",
          bmi: dietPlanData.bmi || 0,
          bmi_category: dietPlanData.bmi_category || "Unknown",
          calories: dietPlanData.calories || 0,
          restrictions: userData.restrictions,
          dietPlan: dietPlanData.dietPlan || {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
          }
        };
        
        // Log the exact request being sent - using raw email instead of encoded
        console.log("PUT Request URL:", `${config.API_BASE_URL}/api/user/set-user-details/${email}`);
        console.log("PUT Request Body:", JSON.stringify(userDetailsData, null, 2));
        
        try {
          const userDetailsResponse = await fetch(`${config.API_BASE_URL}/api/user/set-user-details/${email}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(userDetailsData),
          });
          
          // Log the response status and headers
          console.log("Response Status:", userDetailsResponse.status);
          console.log("Response Headers:", JSON.stringify(Object.fromEntries([...userDetailsResponse.headers.entries()]), null, 2));
          
          // Try to get the response body even if status is not OK
          const responseText = await userDetailsResponse.text();
          console.log("Response Body:", responseText);
          
          if (!userDetailsResponse.ok) {
            throw new Error(`User details API error: ${userDetailsResponse.status} - ${responseText}`);
          }
          
          // Parse the response if it's JSON
          let userDetails;
          try {
            userDetails = JSON.parse(responseText);
          } catch (e) {
            console.warn("Could not parse response as JSON:", e);
            userDetails = { message: responseText };
          }
          
          console.log("User details updated successfully:", userDetails);
        } catch (error) {
          console.error("Error in user details API call:", error);
          throw error; // Re-throw to be caught by the outer try/catch
        }
        
        // Complete progress and navigate
        setProgress(1);
        setStatus('All set! Redirecting...');
        
        // Navigate after a short delay, passing the email to the next screen
        setTimeout(() => {
          router.push({
            pathname: '/profileonboarding/end',
            params: { email: email }
          });
        }, 1000);
        
      } catch (error) {
        console.error("API call error:", error);
        setStatus(`Error: ${error.message}`);
        Alert.alert(
          "Error",
          `Failed to complete setup: ${error.message}`,
          [{ text: "OK", onPress: () => router.push('/profileonboarding/end') }]
        );
      }
    };
    
    // Start the API calls
    makeApiCalls();
    
  }, []);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image source={require('../../assets/logo.png')} style={styles.image} />

      {/* Title */}
      <Text style={styles.title}>Preparing your plan</Text>

      {/* Status Text */}
      <Text style={styles.subtitle}>{status}</Text>

      {/* Progress Bar */}
      <Progress.Bar progress={progress} width={200} color="#4CAF50" style={styles.progressBar} />

      {/* Progress Percentage */}
      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBar: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});
