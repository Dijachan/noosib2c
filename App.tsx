import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Baloo2_400Regular, Baloo2_500Medium, Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { useEffect } from 'react';

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
import HomeScreen from './src/screens/home/HomeScreen';
import MedsTrayScreen from './src/screens/medications/MedsTrayScreen';
import SearchDrugScreen from './src/screens/medications/add/SearchDrugScreen';
import DrugDetailScreen from './src/screens/medications/add/DrugDetailScreen';
import SlotMappingScreen from './src/screens/medications/add/SlotMappingScreen';
import ScheduleScreen from './src/screens/medications/add/ScheduleScreen';
import ReviewSyncScreen from './src/screens/medications/add/ReviewSyncScreen';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MedsTray" component={MedsTrayScreen} />
        <Stack.Screen name="SearchDrug" component={SearchDrugScreen} />
        <Stack.Screen name="DrugDetail" component={DrugDetailScreen} />
        <Stack.Screen name="SlotMapping" component={SlotMappingScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="ReviewSync" component={ReviewSyncScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
