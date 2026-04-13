import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';

export default function SignInScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const isFormValid = form.email.length > 0 && form.password.length > 0;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image 
              source={require('../../../assets/logomark-colored 2 2.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Log in to continue your health journey.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input 
              label="Email Address"
              icon="mail"
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
            />

            <Input 
              label="Password"
              placeholder="xxxxxxxxxxx"
              isPassword
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
            />
          </View>
        </ScrollView>

        {/* Sign In Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => console.log('Log User In:', form)}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Sign In</Text>
            <Feather name="arrow-right" size={20} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLinkDark}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
              <Text style={styles.footerLinkBlue}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 120,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    maxWidth: 361,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 30,
    lineHeight: 40,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(4,9,33,0.76)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 16,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#0463DD',
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
  },
  footerLinkDark: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    paddingVertical: 8,
  },
  footerLinkBlue: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#0463DD',
  },
});
