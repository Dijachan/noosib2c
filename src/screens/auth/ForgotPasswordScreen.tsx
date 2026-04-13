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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState('');

  const isFormValid = email.length > 0;

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
          {/* Custom Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Forgot Password</Text>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a password reset code.
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
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </ScrollView>

        {/* Action Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => navigation.navigate('VerifyCode')}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Send Reset Code</Text>
            <Feather name="arrow-right" size={20} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.footerLinkDark}>Sign In</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLinkDark}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  header: {
    marginBottom: 32,
    width: '100%',
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 30,
    lineHeight: 40,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(4,9,33,0.76)',
  },
  formContainer: {
    width: '100%',
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
    gap: 12,
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
});
