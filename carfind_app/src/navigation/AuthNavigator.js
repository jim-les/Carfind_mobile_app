import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }} // You can customize header options here
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }} // You can customize header options here
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }} // You can customize header options here
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false }} // You can customize header options here
            />
        </Stack.Navigator>
    );
};
    
export default AuthNavigator;