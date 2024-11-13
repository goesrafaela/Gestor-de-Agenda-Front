import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen'; // Supondo que a tela de login esteja neste arquivo
import HomeScreen from './screens/HomeScreen';   // Tela inicial do app, após o login
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Esconde o header da tela de login
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Esconde o header da tela inicial
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
