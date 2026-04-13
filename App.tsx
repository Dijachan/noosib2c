import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash1Screen from './src/screens/auth/Splash1Screen';
import Splash2Screen from './src/screens/auth/Splash2Screen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import CreatePatientProfileScreen from './src/screens/auth/CreatePatientProfileScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import VerifyCodeScreen from './src/screens/auth/VerifyCodeScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';
import ResetSuccessScreen from './src/screens/auth/ResetSuccessScreen';
import ConsentScreen from './src/screens/auth/ConsentScreen';
import DevicePairingScreen from './src/screens/auth/DevicePairingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash1" component={Splash1Screen} />
        <Stack.Screen name="Splash2" component={Splash2Screen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="CreatePatientProfile" component={CreatePatientProfileScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ResetSuccess" component={ResetSuccessScreen} />
        <Stack.Screen name="Consent" component={ConsentScreen} />
        <Stack.Screen name="DevicePairing" component={DevicePairingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
