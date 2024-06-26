import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { base_url } from './src/Utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateSession = async () => {
  try {
    const response = await fetch(`${base_url}/validate-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': await AsyncStorage.getItem('sessionCookie'), // Retrieve session cookie if necessary
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });

    const data = await response.json();
    if (data.status === 'success') {
      console.log("Session valid");
      return true;
    } else {
      console.log(data.message);
      return false;
    }
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const isValidSession = await validateSession();
      setIsAuthenticated(isValidSession);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on component mount and set up interval for continuous checking
  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 60000); // Check every minute (adjust as needed)
    return () => clearInterval(interval); // Cleanup on unmount
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
