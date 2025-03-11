import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (email) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://empty-bats-take.loca.lt/api/user/get-user-details/${email}`);
      setUserData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const email = await SecureStore.getItemAsync('userEmail');
      if (email) {
        fetchUserData(email);
      } else {
        setLoading(false);
        setError('No user email found');
      }
    } catch (err) {
      console.error('Error retrieving email from storage:', err);
      setLoading(false);
      setError('Failed to retrieve user session');
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, loading, error, refreshUserData, fetchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
} 
