// src/screens/Auth/ForgotPasswordScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = () => {
    // Password reset logic here
    alert('Password reset link sent to your email');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.description}>
        Enter your email address below to receive a password reset link.
      </Text>
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 25,
    paddingHorizontal: 25,
    borderRadius: 30,
    color: 'rgb(30, 20, 100)',
    borderWidth: 0,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, .7)",
    shadowOffset: {
        width: 5,
        height: 5,
    },
    shadowOpacity: 10,
    shadowRadius: 30,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: 'gray',
    textAlign: 'center',
  },

});

export default ForgotPasswordScreen;
