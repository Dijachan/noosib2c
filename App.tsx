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
import AdherenceDetailsScreen from './src/screens/home/AdherenceDetailsScreen';
import TempDetailsScreen from './src/screens/home/TempDetailsScreen';
import ProfileScreen from './src/screens/settings/ProfileScreen';
import PharmacyHubScreen from './src/screens/health/PharmacyHubScreen';
import NotificationsScreen from './src/screens/alerts/NotificationsScreen';
import { AuthProvider } from './src/context/AuthContext';
import MedsTrayScreen from './src/screens/medications/MedsTrayScreen';
import MedicationDetailsScreen from './src/screens/medications/MedicationDetailsScreen';
import SearchDrugScreen from './src/screens/medications/add/SearchDrugScreen';
import DrugDetailScreen from './src/screens/medications/add/DrugDetailScreen';
import SlotMappingScreen from './src/screens/medications/add/SlotMappingScreen';
import ScheduleScreen from './src/screens/medications/add/ScheduleScreen';
import ReviewSyncScreen from './src/screens/medications/add/ReviewSyncScreen';
import { MedicationProvider } from './src/context/MedicationContext';


import WelcomeBackScreen from './src/screens/auth/WelcomeBackScreen';
import { useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useState } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const AuthStack = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="ResetSuccess" component={ResetSuccessScreen} />
    </AuthStack.Navigator>
  );
}

const OnboardingStack = createNativeStackNavigator();
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <OnboardingStack.Screen name="CreatePatientProfile" component={CreatePatientProfileScreen} />
      <OnboardingStack.Screen name="Consent" component={ConsentScreen} />
      <OnboardingStack.Screen name="DevicePairing" component={DevicePairingScreen} />
    </OnboardingStack.Navigator>
  );
}

const AppStack = createNativeStackNavigator();
function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen name="AdherenceDetails" component={AdherenceDetailsScreen} />
      <AppStack.Screen name="TempDetails" component={TempDetailsScreen} />
      <AppStack.Screen name="Profile" component={ProfileScreen} />
      <AppStack.Screen name="PharmacyHub" component={PharmacyHubScreen} />
      <AppStack.Screen name="Notifications" component={NotificationsScreen} />
      <AppStack.Screen name="MedsTray" component={MedsTrayScreen} />
      <AppStack.Screen name="MedicationDetails" component={MedicationDetailsScreen} />
      <AppStack.Screen name="SearchDrug" component={SearchDrugScreen} />
      <AppStack.Screen name="DrugDetail" component={DrugDetailScreen} />
      <AppStack.Screen name="SlotMapping" component={SlotMappingScreen} />
      <AppStack.Screen name="Schedule" component={ScheduleScreen} />
      <AppStack.Screen name="ReviewSync" component={ReviewSyncScreen} />
    </AppStack.Navigator>
  );
}

function MainApp() {
  const { isLoading, user, onboardingStatus, isLocked } = useAuth();
  const [bootStep, setBootStep] = useState(0); // 0: Splash1, 1: Splash2, 2: Ready

  // 1. Brand Intro Sequence
  useEffect(() => {
    if (!isLoading) {
      if (bootStep === 0) {
        const t1 = setTimeout(() => setBootStep(1), 1500);
        return () => clearTimeout(t1);
      } else if (bootStep === 1) {
        const t2 = setTimeout(() => setBootStep(2), 1500);
        return () => clearTimeout(t2);
      }
    }
  }, [isLoading, bootStep]);

  if (isLoading || bootStep < 2) {
    if (bootStep === 1) return <Splash2Screen />;
    return <Splash1Screen />; 
  }

  // 2. The Great Gateway (Visual Flow)
  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : onboardingStatus !== 'completed' ? (
        <OnboardingNavigator />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}

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

  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <MedicationProvider>
        <MainApp />
      </MedicationProvider>
    </AuthProvider>
  );
}
