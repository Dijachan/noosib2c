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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Alert, ActivityIndicator } from 'react-native';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const { mockLogin } = useAuth();

  const handleSignUp = async () => {
    setIsLoading(true);
    // Fake "Processing" delay for demo realism
    setTimeout(() => {
      mockLogin();
      setIsLoading(false);
    }, 1500);
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
            <Text style={styles.title}>Join as Caregiver</Text>
            <Text style={styles.subtitle}>
              Create your account to manage your loved one's health and coordinate care seamlessly.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input 
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={form.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />

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

            <Input 
              label="Confirm Password"
              placeholder="xxxxxxxxxxx"
              isPassword
              value={form.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
            />
          </View>
        </ScrollView>

        {/* Sign Up Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Sign Up</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
    paddingBottom: 40,
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
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
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
  footerLink: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#0463DD',
    textDecorationLine: 'underline',
  },
});
