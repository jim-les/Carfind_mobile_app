// src/screens/Auth/RegisterScreen.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { base_url } from '../../Utils/config';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleRegister = () => {
        setErrorMessage('');
        
        // Registration logic here
        if (password === confirmPassword) {
            if (password.length < 6) {
                setErrorMessage('Password must be at least 6 characters long.');
                return;
            }
            setIsRegister(true);
            try{
                setIsRegister(true);
                fetch(`${base_url}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: email,
                        password: password,
                    }),
                })
                
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        setIsModalVisible(true); 
                    } else {
                        setErrorMessage(data.message);
                    }
                })
                .catch((error) => {
                    setErrorMessage('An error occurred. Please try again.');
                })
                .finally(() => {
                    setIsRegister(false);
                });
            } catch (error) {
                setIsRegister(false);
                setErrorMessage('An error occurred. Please try again.');
            }
        } 
        else {
            setIsRegister(false);
            setErrorMessage('Passwords do not match');
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        navigation.navigate('Login'); // Navigate to Login screen
    };

    return (
        <View style={styles.container}>
            {/* icon back */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: '7%', left: "3%" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: 'rgb(30, 20, 100)', fontSize: 18 }}>Back</Text>
                </TouchableOpacity>
            </View>


            <Text style={styles.title}>Let's Get Started</Text>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            {/* <Button title="Register" onPress={handleRegister} /> */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>
                    {isRegister ? <ActivityIndicator size="small" color="white" /> : "Register"}
                </Text>
            </TouchableOpacity>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Already have an account? Login
            </Text>

            {/* Modal for successful registration */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Registration Successful!</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 50,
        textAlign: "center",
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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
        position: "relative",
    },
    passwordInput: {
        flex: 1,
        height: 60,
        borderColor: "gray",
        borderWidth: 1,
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
    togglePasswordContainer: {
        position: "absolute",
        right: 25,
    },
    togglePassword: {
        marginHorizontal: 10,
        color: "rgb(30, 20, 100)",
    },
    error: {
        color: "red",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "rgb(30, 20, 100)",
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
    link: {
        marginVertical: 20,
        color: "rgb(30, 20, 100)",
        textAlign: "center",
    },
    signupLink: {
        marginTop: 15,
        color: "rgb(30, 20, 100)",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgb(30, 20, 100)',
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});


export default RegisterScreen;
