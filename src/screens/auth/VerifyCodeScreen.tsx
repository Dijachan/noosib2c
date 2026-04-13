import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function VerifyCodeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const isFormValid = code.every(digit => digit.length === 1);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const newText = text.replace(/[^0-9]/g, '');
    
    if (newText.length <= 1) {
      const newCode = [...code];
      newCode[index] = newText;
      setCode(newCode);

      // Move to next input if there's a character and not the last input
      if (newText.length === 1 && index < 3) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input if we hit backspace on an empty input
      inputs.current[index - 1]?.focus();
    }
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
          {/* Custom Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Verify Code</Text>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter Reset Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 4-digit code to your email.
            </Text>
          </View>

          {/* Form Fields: OTP */}
          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null
                  ]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Action Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Verify Code</Text>
            <Feather name="arrow-right" size={20} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={() => console.log('Resend code')}>
                <Text style={styles.footerLinkBlue}>Resend Code</Text>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpInput: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    fontFamily: 'Baloo2_700Bold',
    fontSize: 32,
    color: 'rgba(4,9,33,0.76)',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#0463DD',
    backgroundColor: '#FFFFFF',
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
  footerLinkBlue: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#0463DD',
  },
});
