import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react';
import logo from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation()
    setTimeout(() => {
        navigation.navigate('Login')
    }, 5000)
    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgb(3, 3, 33)',
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        borderRadius: 100,
        borderWidth: 4,
        borderColor: 'white',
    },
})

export default WelcomeScreen