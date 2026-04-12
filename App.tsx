import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash1Screen from './src/screens/auth/Splash1Screen';
import Splash2Screen from './src/screens/auth/Splash2Screen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash1" component={Splash1Screen} />
        <Stack.Screen name="Splash2" component={Splash2Screen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
