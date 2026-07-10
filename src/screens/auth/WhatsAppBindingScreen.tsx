import React, { useState, useEffect, useRef } from 'react';
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
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

export default function WhatsAppBindingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { patientProfile } = useAuth();

  const patientName = patientProfile?.name || 'Grandpa Kunle';
  const patientPhone = patientProfile?.phone || '+234 803 123 4567';

  const [code, setCode] = useState<string[]>(['1', '2', '3', '4']); // Pre-filled with '1234' for demo simulation
  const [isBypassChecked, setIsBypassChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const isFormValid = code.every(digit => digit.length === 1);

  const handleCodeChange = (text: string, index: number) => {
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
      inputs.current[index - 1]?.focus();
    }
  };

  const toggleBypass = () => {
    const newChecked = !isBypassChecked;
    setIsBypassChecked(newChecked);
    if (newChecked) {
      setCode(['9', '9', '9', '9']);
    } else {
      setCode(['1', '2', '3', '4']);
    }
  };

  const handleVerify = () => {
    if (!isFormValid) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('CareCircle');
    }, 1500);
  };

  const handleSkip = () => {
    // Navigate straight to caregiver list, fallback to cellular voice
    navigation.navigate('CareCircle');
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
          {/* Custom Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <View style={styles.navHeaderTitleContainer}>
              <Text style={styles.navTitle}>WhatsApp Sync</Text>
              <Text style={styles.navStep}>Step 2 of 3</Text>
            </View>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Connect WhatsApp Alerts</Text>
            <Text style={styles.subtitle}>
              We've sent a 4-digit verification code to {patientName}'s WhatsApp at <Text style={styles.boldText}>{patientPhone}</Text>.
            </Text>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="logo-whatsapp" size={20} color="#10B981" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Why connect WhatsApp?</Text>
              <Text style={styles.infoDescription}>
                If push notifications are missed, automated WhatsApp reminders ensure medication checks are delivered safely.
              </Text>
            </View>
          </View>

          {/* Code Inputs */}
          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                    isBypassChecked && styles.otpInputBypassed
                  ]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!isBypassChecked}
                />
              ))}
            </View>

            {/* Physical Bypass Checkbox */}
            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={toggleBypass}
              activeOpacity={0.8}
            >
              <View style={[
                styles.checkboxBox,
                isBypassChecked && styles.checkboxBoxSelected
              ]}>
                {isBypassChecked && <Feather name="check" size={12} color="#FFFFFF" />}
              </View>
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxLabel}>I have their phone with me right now</Text>
                <Text style={styles.checkboxSublabel}>Auto-fills bypass code (9999) for quick setup.</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action Buttons (Fixed at bottom) */}
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
                <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Link WhatsApp</Text>
                <Feather name="arrow-right" size={20} color={isFormValid ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipLinkText}>Skip and send alerts via voice calls only</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  navHeaderTitleContainer: {
    alignItems: 'center',
  },
  navTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navStep: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#06565F',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  header: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 361,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(4,9,33,0.6)',
  },
  boldText: {
    fontFamily: 'Baloo2_700Bold',
    color: '#040921',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 361,
    marginBottom: 30,
    gap: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#06565F',
    marginBottom: 2,
  },
  infoDescription: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#06565F',
  },
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 24,
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
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    fontFamily: 'Baloo2_700Bold',
    fontSize: 32,
    color: 'rgba(4,9,33,0.76)',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#06565F',
    backgroundColor: '#FFFFFF',
  },
  otpInputBypassed: {
    borderColor: '#10B981',
    color: '#10B981',
    backgroundColor: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    gap: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  checkboxBoxSelected: {
    borderColor: '#06565F',
    backgroundColor: '#06565F',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 2,
  },
  checkboxSublabel: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(4,9,33,0.5)',
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  skipLinkText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 15,
    color: '#06565F',
    textDecorationLine: 'underline',
  },
});
