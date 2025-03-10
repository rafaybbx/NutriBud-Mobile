import React, { createContext, useState, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const ResetPasswordContext = createContext();

export const ResetPasswordProvider = ({ children }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  
  const saveEmail = async (email) => {
    setResetEmail(email);
    await SecureStore.setItemAsync('resetEmail', email);
  };
  
  const saveCode = async (code) => {
    setResetCode(code);
    await SecureStore.setItemAsync('verificationCode', code);
  };
  
  const clearResetData = async () => {
    setResetEmail('');
    setResetCode('');
    await SecureStore.deleteItemAsync('resetEmail');
    await SecureStore.deleteItemAsync('verificationCode');
  };
  
  return (
    <ResetPasswordContext.Provider value={{
      resetEmail,
      resetCode,
      saveEmail,
      saveCode,
      clearResetData
    }}>
      {children}
    </ResetPasswordContext.Provider>
  );
};

export const useResetPassword = () => useContext(ResetPasswordContext); 
