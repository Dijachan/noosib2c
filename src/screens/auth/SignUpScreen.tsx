import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoPlaceholder}>
              <Feather name="shield" size={40} color="#0463DD" />
            </View>
            <Text style={styles.title}>Join Noosi as Caregiver</Text>
            <Text style={styles.subtitle}>
              Create your account to manage patient care and coordinate with the healthcare team.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(4,9,33,0.32)"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="rgba(4,9,33,0.32)" style={styles.inputIcon} />
                <TextInput 
                  style={styles.inputWithIcon}
                  placeholder="Enter your email address"
                  placeholderTextColor="rgba(4,9,33,0.32)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.inputWithIcon}
                  placeholder="xxxxxxxxxxx"
                  placeholderTextColor="rgba(4,9,33,0.32)"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="rgba(4,9,33,0.32)" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.inputWithIcon}
                  placeholder="xxxxxxxxxxx"
                  placeholderTextColor="rgba(4,9,33,0.32)"
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                  <Feather name={showConfirm ? "eye" : "eye-off"} size={20} color="rgba(4,9,33,0.32)" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign Up Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => console.log('Navigate to Patient Setup')}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => console.log('Navigate to Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 48,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    marginLeft: 2,
  },
  inputWrapper: {
    width: '100%',
    height: 48,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.32)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#040921',
  },
  inputWithIcon: {
    flex: 1,
    height: '100%',
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#040921',
  },
  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    padding: 4,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 24,
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
