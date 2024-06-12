// src/screens/Main/PredictPriceScreen.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, Button, StyleSheet,Modal, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import navigation from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { base_url } from '../../Utils/config';
import * as SecureStore from 'expo-secure-store';
import predicted from '../../assets/predicted.png';

const PredictPriceScreen = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [transmission, setTransmission] = useState('');
  const [engineType, setEngineType] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [previousOwners, setPreviousOwners] = useState('');
  const [additionalFeatures, setAdditionalFeatures] = useState('');
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPredict, setIsPredict] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);


  const handlePredict = async () => {
    setIsPredict(true);
    setErrorMessage('');

    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        setErrorMessage('User is not authenticated. Please log in.');
        setIsPredict(false);
        return;
      }

      await fetch(`${base_url}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in header
        },
        body: JSON.stringify({
          "make": "Toyota",
          "model": "Land Cruiser",
          "year": 2024,
          "country_of_origin": "Japan",
          "transmission": "Auto",
          "engine_type": "Diesel",
          "engine_size": 1.5,
          "mileage": 209876,
          "condition": "Poor",
          "previous_owners": 2,
          "additional_features": ""
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        setPredictedPrice(data.prediction);
        setIsModalVisible(true);
        console.log(data.predictedPrice)
      })

    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsPredict(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <ModalComponent isModalVisible={isModalVisible} handleModalClose={handleModalClose} predictedPrice={predictedPrice} /> 
      {errorMessage ? 
        <Modal visible={true} animationType="slide">
          <View style={styles.container}>
            <Text style={styles.title}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={() => setErrorMessage('')}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      : null}

      <Text style={styles.title}>Predict Vehicle Resale Price</Text>
      <TextInput style={styles.input} placeholder="Make" value={make} onChangeText={setMake} />
      <TextInput style={styles.input} placeholder="Model" value={model} onChangeText={setModel} />
      <TextInput style={styles.input} placeholder="Year" value={year} onChangeText={setYear} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Country of Origin" value={country} onChangeText={setCountry} />
      <Picker selectedValue={transmission} style={styles.input} onValueChange={(itemValue) => setTransmission(itemValue)}>
        <Picker.Item label="Select Transmission" value="" />
        <Picker.Item label="Manual" value="Manual" />
        <Picker.Item label="Automatic" value="Automatic" />
      </Picker>
      <TextInput style={styles.input} placeholder="Engine Type" value={engineType} onChangeText={setEngineType} />
      <TextInput style={styles.input} placeholder="Engine Size (L)" value={engineSize} onChangeText={setEngineSize} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Mileage (km)" value={mileage} onChangeText={setMileage} keyboardType="numeric" />
      <Picker selectedValue={condition} style={styles.input} onValueChange={(itemValue) => setCondition(itemValue)}>
        <Picker.Item label="Select Condition" value="" />
        <Picker.Item label="Poor" value="Poor" />
        <Picker.Item label="Fair" value="Fair" />
        <Picker.Item label="Good" value="Good" />
        <Picker.Item label="Excellent" value="Excellent" />
      </Picker>
      <TextInput style={styles.input} placeholder="Previous Owners" value={previousOwners} onChangeText={setPreviousOwners} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Additional Features" value={additionalFeatures} onChangeText={setAdditionalFeatures} />
      <TouchableOpacity style={styles.button} onPress={handlePredict}>  
        <Text style={styles.buttonText}>
          {isPredict ? <ActivityIndicator size="small" color="white" /> : "Predict Price"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ModalComponent = ({ isModalVisible, handleModalClose, predictedPrice }) => {
  return(
    <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.container}>
          <Image source={predicted} style={styles.logo} />
          <Text style={styles.title}>Predicted Price</Text>
          <Text style={styles.title}>Shs. {predictedPrice}</Text>
          <TouchableOpacity style={styles.button} onPress={handleModalClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
      height: 60,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 25,
      paddingHorizontal: 25,
      color: 'rgb(30, 20, 100)',
      borderWidth: 0,
      backgroundColor: "white",
      shadowColor: "rgba(0, 0, 0, .7)",
      shadowOffset: {
          width: 5,
          height: 5,
      },
      shadowOpacity: 10,
      shadowRadius: 8,
      elevation: 10,
  },
  button: {
      backgroundColor: "rgb(30, 20, 100)",
      paddingVertical: 17,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: '10%',
  },
  buttonText: {
      color: "white",
      fontSize: 18,
  },
});

export default PredictPriceScreen;
