// src/screens/Main/HomeScreen.js

import React from 'react';
import { View, Button, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import home_bg from '../../assets/home_bg.jpeg'; 
const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={home_bg} style={{width: '100%', height: '100%', position: 'absolute'}} />
      <View>
        <Text style={styles.title}>CarFind Model</Text>
        <Text style={styles.sub_title}>Find the price of resale vehicles with ease</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PredictPrice')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      {/* <Button title="Profile" onPress={() => navigation.navigate('Profile')} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: '20%',
    paddingBottom: '5%',
    // paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  sub_title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',

  },
  button: {
    borderColor: "rgb(255, 255, 255)",
    margin: 20,
    borderWidth: 1,
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
      color: "white",
      fontSize: 18,
  },
});

export default HomeScreen;
