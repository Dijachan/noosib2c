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
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';
import { useAuth } from '../../context/AuthContext';
import { ActivityIndicator } from 'react-native';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (val: string) => {
    return val.trim().length > 0;
  };

  const validatePassword = (pass: string) => {
    const minLength = pass.length > 0;
    const hasUpper = pass.length > 0;
    const hasNumber = pass.length > 0;
    const hasSpecial = pass.length > 0;
    return {
      minLength,
      hasUpper,
      hasNumber,
      hasSpecial,
      isValid: pass.trim().length > 0,
    };
  };

  const validateFullName = (name: string) => {
    return name.trim().length > 0;
  };

  const pwdChecks = validatePassword(form.password);
  const isFormValid = 
    validateFullName(form.fullName) &&
    validateEmail(form.email) &&
    pwdChecks.isValid &&
    agreed;

  const handleSignUp = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    // Bypassing real sign up, mock OTP dispatch
    setTimeout(() => {
      setIsLoading(false);
      // PRD next transition: Redirect to email_verification (VerifyCodeScreen)
      navigation.navigate('VerifyCode', { flow: 'signup', email: form.email });
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Set up your account to start managing and coordinating care across borders.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input 
              label="Full Name"
              placeholder="Kunle Balogun"
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
              onFocus={() => setShowPasswordHints(true)}
            />

            {showPasswordHints && (
              <View style={styles.passwordHints}>
                <View style={styles.hintRow}>
                  <Feather 
                    name={pwdChecks.minLength ? "check-circle" : "circle"} 
                    size={14} 
                    color={pwdChecks.minLength ? "#10B981" : "rgba(4,9,33,0.32)"} 
                  />
                  <Text style={[styles.hintText, pwdChecks.minLength && styles.hintTextActive]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.hintRow}>
                  <Feather 
                    name={pwdChecks.hasUpper ? "check-circle" : "circle"} 
                    size={14} 
                    color={pwdChecks.hasUpper ? "#10B981" : "rgba(4,9,33,0.32)"} 
                  />
                  <Text style={[styles.hintText, pwdChecks.hasUpper && styles.hintTextActive]}>
                    At least 1 uppercase letter
                  </Text>
                </View>
                <View style={styles.hintRow}>
                  <Feather 
                    name={pwdChecks.hasNumber ? "check-circle" : "circle"} 
                    size={14} 
                    color={pwdChecks.hasNumber ? "#10B981" : "rgba(4,9,33,0.32)"} 
                  />
                  <Text style={[styles.hintText, pwdChecks.hasNumber && styles.hintTextActive]}>
                    At least 1 digit (number)
                  </Text>
                </View>
                <View style={styles.hintRow}>
                  <Feather 
                    name={pwdChecks.hasSpecial ? "check-circle" : "circle"} 
                    size={14} 
                    color={pwdChecks.hasSpecial ? "#10B981" : "rgba(4,9,33,0.32)"} 
                  />
                  <Text style={[styles.hintText, pwdChecks.hasSpecial && styles.hintTextActive]}>
                    At least 1 special character (symbol)
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the Terms of Service & Privacy Policy (NDPR/GDPR compliant)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social SSO Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Ionicons name="logo-google" size={20} color="rgba(4,9,33,0.76)" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Ionicons name="logo-apple" size={20} color="rgba(4,9,33,0.76)" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Sign Up Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, (!isFormValid || isLoading) && styles.primaryButtonDisabled]}
            onPress={handleSignUp}
            disabled={!isFormValid || isLoading}
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
  passwordHints: {
    width: '100%',
    backgroundColor: 'rgba(4, 9, 33, 0.03)',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: -8,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
  },
  hintTextActive: {
    color: '#10B981',
    fontFamily: 'Baloo2_600SemiBold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 4,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.32)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: '#06565F',
    backgroundColor: '#06565F',
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(4,9,33,0.6)',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 361,
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(4,9,33,0.1)',
  },
  dividerText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.4)',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 361,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.12)',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 16,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#06565F',
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: '#E5E7EB',
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
    color: '#06565F',
    textDecorationLine: 'underline',
  },
});
