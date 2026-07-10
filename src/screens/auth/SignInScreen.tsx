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
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';
import { useAuth } from '../../context/AuthContext';

export default function SignInScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { mockLogin } = useAuth();
  
  const [role, setRole] = useState<'admin' | 'caregiver'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val: string) => {
    return val.trim().length > 0;
  };

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSignIn = () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mockLogin('completed', role);
    }, 1500);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Auto fill and login as selected role
      setEmail(role === 'admin' ? 'sponsor@noosi.com' : 'caregiver@noosi.com');
      setPassword('password123');
      mockLogin('completed', role);
    }, 1200);
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image 
              source={require('../../../assets/logomark-colored 2 2.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to coordinate care circles and verify medication compliance.
            </Text>
          </View>

          {/* Role Selection Tabs */}
          <View style={styles.roleContainer}>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.roleTab,
                  role === 'admin' && styles.roleTabActive
                ]}
                onPress={() => setRole('admin')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'admin' && styles.roleTabTextActive
                  ]}
                >
                  Sponsor (Admin)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleTab,
                  role === 'caregiver' && styles.roleTabActive
                ]}
                onPress={() => setRole('caregiver')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'caregiver' && styles.roleTabTextActive
                  ]}
                >
                  Local Caregiver
                </Text>
              </TouchableOpacity>
            </View>
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

            <Input 
              label="Password"
              icon="lock"
              placeholder="••••••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            {/* Biometric Quick Login */}
            <TouchableOpacity 
              style={styles.biometricRow}
              onPress={handleBiometricLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="finger-print" size={20} color="#06565F" />
              <Text style={styles.biometricText}>
                Quick Sign-In with Touch ID / Face ID
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Sign In (SSO) */}
          <View style={styles.ssoContainer}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or log in with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.ssoButtonsRow}>
              <TouchableOpacity style={styles.ssoButton} activeOpacity={0.8}>
                <Ionicons name="logo-google" size={20} color="rgba(4,9,33,0.76)" />
                <Text style={styles.ssoButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.ssoButton} activeOpacity={0.8}>
                <Ionicons name="logo-apple" size={20} color="rgba(4,9,33,0.76)" />
                <Text style={styles.ssoButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Actions Button (Fixed at Bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, (!isFormValid || isLoading) && styles.disabledButton]}
            disabled={!isFormValid || isLoading}
            onPress={handleSignIn}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Sign In</Text>
                <Feather name="arrow-right" size={20} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
              </>
            )}
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
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 361,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(4,9,33,0.6)',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  roleContainer: {
    width: '100%',
    maxWidth: 361,
    marginBottom: 24,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 3,
    width: '100%',
    height: 44,
  },
  roleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  roleTabActive: {
    backgroundColor: '#06565F',
    shadowColor: 'rgba(4, 9, 33, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  roleTabText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 16,
    marginBottom: 20,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    borderRadius: 12,
    marginTop: 4,
    width: '100%',
  },
  biometricText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#06565F',
  },
  ssoContainer: {
    width: '100%',
    maxWidth: 361,
    marginTop: 10,
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(4,9,33,0.06)',
  },
  dividerText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
  },
  ssoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  ssoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    gap: 8,
  },
  ssoButtonText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
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
  forgotPassword: {
    paddingVertical: 4,
  },
  footerLinkBlue: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#06565F',
  },
});
