import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function VerifyCodeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();

  const isSignUpFlow = route.params?.flow === 'signup';
  const destinationEmail = route.params?.email || 'kunle.jr@example.com';
  const otpLength = isSignUpFlow ? 6 : 4;

  const [code, setCode] = useState<string[]>(Array(otpLength).fill(''));
  const [timeLeft, setTimeLeft] = useState(120); // 02:00
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const isFormValid = code.every(digit => digit.length === 1);

  // Focus re-initialization if flow changes
  useEffect(() => {
    setCode(Array(otpLength).fill(''));
  }, [otpLength]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Auto-submit when fully filled
  useEffect(() => {
    if (code.every(digit => digit.length === 1) && code.length === otpLength) {
      handleVerify();
    }
  }, [code]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (text: string, index: number) => {
    const newText = text.replace(/[^0-9]/g, '');
    
    if (newText.length <= 1) {
      const newCode = [...code];
      newCode[index] = newText;
      setCode(newCode);

      // Move to next input if there's a character and not the last input
      if (newText.length === 1 && index < otpLength - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isSignUpFlow) {
        navigation.navigate('RegionSetup');
      } else {
        navigation.navigate('ResetPassword');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(120); // Reset timer
    // Mock code send
    console.log('OTP Code resent to ' + destinationEmail);
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
            <Text style={styles.title}>
              {isSignUpFlow ? 'Verify Your Email' : 'Enter Reset Code'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUpFlow 
                ? `We've sent a 6-digit code to:\n${destinationEmail}`
                : `We've sent a 4-digit code to:\n${destinationEmail}`
              }
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
                    isSignUpFlow ? styles.otpInputSix : styles.otpInputFour,
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

          {/* Countdown Timer */}
          <View style={styles.timerContainer}>
            <Feather name="clock" size={16} color="rgba(4,9,33,0.5)" />
            <Text style={styles.timerText}>
              Code expires in: <Text style={styles.timerCountdown}>{formatTime(timeLeft)}</Text>
            </Text>
          </View>

        </ScrollView>

        {/* Action Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, (!isFormValid || isLoading) && styles.disabledButton]}
            disabled={!isFormValid || isLoading}
            onPress={handleVerify}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Verify Code</Text>
                <Feather name="arrow-right" size={20} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Didn't receive the code? </Text>
              <TouchableOpacity 
                onPress={handleResend}
                disabled={timeLeft > 0}
              >
                <Text style={[
                  styles.footerLinkBlue,
                  timeLeft > 0 && styles.footerLinkDisabled
                ]}>
                  Resend Code
                </Text>
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
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    fontFamily: 'Baloo2_700Bold',
    color: 'rgba(4,9,33,0.76)',
    textAlign: 'center',
  },
  otpInputFour: {
    width: 72,
    height: 72,
    fontSize: 32,
  },
  otpInputSix: {
    width: 48,
    height: 60,
    fontSize: 24,
  },
  otpInputFilled: {
    borderColor: '#06565F',
    backgroundColor: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  timerText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    color: 'rgba(4,9,33,0.6)',
  },
  timerCountdown: {
    fontFamily: 'Baloo2_700Bold',
    color: '#06565F',
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
    color: '#06565F',
  },
  footerLinkDisabled: {
    color: '#9CA3AF',
  },
});
