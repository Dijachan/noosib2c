import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OnboardingBg from '../../components/OnboardingBg';
import { useAuth } from '../../context/AuthContext';

export default function ConsentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { mockNextStep } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgContainer}>
        <OnboardingBg width={600} height={600} />
      </View>

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
          <View style={styles.navPlaceholder} />
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logomark-colored 2 2.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Data Consent</Text>
          <Text style={styles.subtitle}>
            Your privacy is our priority. Please review how we handle your data under NDPR regulations.
          </Text>
        </View>

        {/* Consent Text Card */}
        <View style={styles.consentCard}>
          <ScrollView 
            style={styles.innerScroll} 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.innerScrollContent}
          >
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Data Collection & Usage</Text>
                <Feather name="file-text" size={18} color="#06565F" />
              </View>
              <Text style={styles.consentText}>
                The Noosi ecosystem collects health data, including medication schedules, dosages, adherence logs, and biometric vitals. This data is used solely for care coordination and health monitoring.
              </Text>
              <Text style={styles.consentText}>
                1. <Text style={styles.boldText}>Data Collection:</Text> We collect information provided during registration and device pairing.
                {"\n\n"}
                2. <Text style={styles.boldText}>Purpose:</Text> Data is used solely for health monitoring, care coordination, and service improvement.
                {"\n\n"}
                3. <Text style={styles.boldText}>Security:</Text> We implement industry-standard encryption (AES-256) to protect your sensitive information.
                {"\n\n"}
                4. <Text style={styles.boldText}>Your Rights:</Text> You have the right to access, rectify, or request deletion of your data at any time.
                {"\n\n"}
                Noosi complies with the Nigeria Data Protection Regulation (NDPR) to ensure your data is handled with the highest level of care.
              </Text>
            </View>

            <View style={styles.auditLog}>
              <View style={styles.auditHeader}>
                <Text style={styles.auditTitle}>AUDIT LOG ENTRY</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ENCRYPTED</Text>
                </View>
              </View>
              <View style={styles.auditRow}>
                <Text style={styles.auditLabel}>TIMESTAMP:</Text>
                <Text style={styles.auditValue}>{new Date().toISOString().replace('T', ' ').split('.')[0]} UTC</Text>
              </View>
              <View style={styles.auditRow}>
                <Text style={styles.auditLabel}>VERSION:</Text>
                <Text style={styles.auditValue}>2.1.0-NDPR</Text>
              </View>
              <View style={styles.auditRow}>
                <Text style={styles.auditLabel}>STATUS:</Text>
                <Text style={styles.auditValue}>PENDING_APPROVAL</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Action Container (Fixed at bottom) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Feather name="check" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I confirm I have legal consent to manage this patient’s data and agree to the terms of processing.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.primaryButton, (!isChecked || isLoading) && styles.disabledButton]}
          disabled={!isChecked || isLoading}
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => {
              mockNextStep();
              setIsLoading(false);
              navigation.navigate('DevicePairing');
            }, 1000);
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={[styles.buttonText, !isChecked && styles.disabledButtonText]}>Confirm & Continue</Text>
              <Feather name="arrow-right" size={20} color={isChecked ? "#FFFFFF" : "#9CA3AF"} strokeWidth={3} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bgContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 600,
    height: 600,
    marginLeft: -300,
    marginTop: -400,
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    width: '100%',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  navPlaceholder: {
    width: 42,
    height: 42,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
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
    paddingHorizontal: 10,
  },
  consentCard: {
    width: '100%',
    height: 380,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    overflow: 'hidden',
    shadowColor: '#06565F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  innerScroll: {
    flex: 1,
  },
  innerScrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: 'rgba(4,9,33,0.76)',
  },
  consentText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(4,9,33,0.6)',
  },
  boldText: {
    fontFamily: 'Baloo2_700Bold',
  },
  auditLog: {
    backgroundColor: 'rgba(44, 110, 245, 0.05)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#06565F',
    marginTop: 8,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(4, 99, 221, 0.1)',
    paddingBottom: 8,
  },
  auditTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#06565F',
    letterSpacing: 2,
  },
  badge: {
    backgroundColor: '#06565F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Baloo2_700Bold',
  },
  auditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  auditLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
  },
  auditValue: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.7)',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#06565F',
    borderColor: '#06565F',
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(4,9,33,0.6)',
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
});
