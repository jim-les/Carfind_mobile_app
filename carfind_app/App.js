import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { base_url } from './src/Utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateToken = async (token) => {
  try {
    await fetch(`${base_url}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'success'){
        console.log("Success");
        return true;
      } else {
        console.log(data.message)
        return false
      }
    })

  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    await AsyncStorage.removeItem('userToken'); // Clear invalid token

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (await validateToken(token)) {
        setIsAuthenticated(true);
      } else {
        // console.error(token)
        setIsAuthenticated(true);
        await AsyncStorage.removeItem('userToken'); // Clear invalid token
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Show a loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Styles for loading container
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
