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
import OnboardingBg from '../../components/OnboardingBg';

export default function CreatePatientProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: 'Male', // Default
    condition: '',
    emergencyContact: '',
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgContainer}>
        <OnboardingBg width={600} height={600} />
      </View>

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
            <View style={styles.navPlaceholder} />
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Feather name="user-plus" size={32} color="#0463DD" />
            </View>
            <Text style={styles.title}>Create Patient Profile</Text>
            <Text style={styles.subtitle}>
              Define the profile of the patient under your care.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input 
              label="Full Name"
              placeholder="e.g. Adewale Johnson"
              value={form.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input 
                  label="Age"
                  placeholder="65"
                  keyboardType="number-pad"
                  value={form.age}
                  onChangeText={(text) => handleChange('age', text)}
                />
              </View>
              <View style={{ flex: 1.2 }}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['Male', 'Female'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[
                        styles.genderBtn,
                        form.gender === g && styles.genderBtnActive
                      ]}
                      onPress={() => handleChange('gender', g)}
                    >
                      <Text style={[
                        styles.genderText,
                        form.gender === g && styles.genderTextActive
                      ]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <Input 
              label="Primary Condition (Optional)"
              placeholder="e.g. Hypertension"
              value={form.condition}
              onChangeText={(text) => handleChange('condition', text)}
            />

            <Input 
              label="Emergency Contact"
              icon="phone"
              placeholder="+234 800 123 4567"
              keyboardType="phone-pad"
              value={form.emergencyContact}
              onChangeText={(text) => handleChange('emergencyContact', text)}
            />
          </View>
        </ScrollView>

        {/* Action Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Consent')}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
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
  keyboardView: {
    flex: 1,
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
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 99, 221, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    marginBottom: 4,
    marginLeft: 2,
  },
  genderContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.32)',
    padding: 2,
  },
  genderBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  genderBtnActive: {
    backgroundColor: '#0463DD',
  },
  genderText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
  },
  genderTextActive: {
    color: '#FFFFFF',
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
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
