// src/navigation/MainNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Main/HomeScreen';
import PredictPriceScreen from '../screens/Main/PredictPriceScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import ResultScreen from '../screens/Main/ResultScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initrialRouteName="Home"> 
      <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name="PredictPrice" component={PredictPriceScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
