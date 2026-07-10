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
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';
import { useAuth } from '../../context/AuthContext';

const CONDITIONS = ['Hypertension', 'Type 2 Diabetes', 'Arthritis', 'Asthma'];

export default function CreatePatientProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { setPatientProfile } = useAuth();
  
  const [fullName, setFullName] = useState('Grandpa Kunle');
  const [age, setAge] = useState('78');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('+234 803 123 4567');
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Hypertension']);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(prev => prev.filter(c => c !== condition));
    } else {
      setSelectedConditions(prev => [...prev, condition]);
    }
  };

  const isFormValid = fullName.trim().length > 0 && age.trim().length > 0 && phone.trim().length > 0;

  const handleSave = () => {
    if (!isFormValid) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setPatientProfile({
        name: fullName,
        age,
        gender,
        phone,
        conditions: selectedConditions,
        language: 'English'
      });
      navigation.navigate('WhatsAppBinding');
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
          {/* Header Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <View style={styles.navHeaderTitleContainer}>
              <Text style={styles.navTitle}>Patient Setup</Text>
              <Text style={styles.navStep}>Step 1 of 3</Text>
            </View>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Elder Profile</Text>
            <Text style={styles.subtitle}>
              Setting up your patient's digital identity.
            </Text>
          </View>

          {/* Profile Image Picker */}
          <View style={styles.imagePickerSection}>
            <TouchableOpacity style={styles.dottedCircle} activeOpacity={0.8}>
              <Feather name="camera" size={24} color="#06565F" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
            <Text style={styles.imagePickerDescription}>
              Provide a clear, recent profile photo of the elder patient.
            </Text>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="e.g. Grandpa Kunle"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Age & Gender in row */}
            <View style={styles.row}>
              <View style={styles.ageCol}>
                <Input
                  label="Age"
                  placeholder="78"
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              <View style={styles.genderCol}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderSegmentedControl}>
                  {['Male', 'Female', 'Other'].map((option) => {
                    const isActive = gender === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.genderTab,
                          isActive && styles.genderTabActive
                        ]}
                        onPress={() => setGender(option)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.genderTabText,
                            isActive && styles.genderTabTextActive
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Phone Number */}
            <Input
              label="WhatsApp Phone Number"
              icon="phone"
              placeholder="e.g. +234 803 123 4567"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Chronic Conditions */}
            <View style={styles.conditionsGroup}>
              <Text style={styles.fieldLabel}>Chronic Conditions</Text>
              <View style={styles.conditionsGrid}>
                {CONDITIONS.map((condition) => {
                  const isSelected = selectedConditions.includes(condition);
                  return (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.conditionPill,
                        isSelected && styles.conditionPillActive
                      ]}
                      onPress={() => toggleCondition(condition)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Feather name="check" size={14} color="#FFFFFF" style={styles.pillCheck} />
                      )}
                      <Text
                        style={[
                          styles.conditionText,
                          isSelected && styles.conditionTextActive
                        ]}
                      >
                        {condition}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button (Fixed at Bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, (!isFormValid || isLoading) && styles.disabledButton]}
            disabled={!isFormValid || isLoading}
            onPress={handleSave}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>
                  Save & Continue
                </Text>
                <Feather 
                  name="arrow-right" 
                  size={20} 
                  color={isFormValid ? "#FFFFFF" : "#9CA3AF"} 
                  strokeWidth={3} 
                />
              </>
            )}
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
    marginBottom: 24,
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
  imagePickerSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 361,
  },
  dottedCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: '#06565F',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4, 99, 221, 0.04)',
    marginBottom: 10,
  },
  addPhotoText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#06565F',
    marginTop: 2,
  },
  imagePickerDescription: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ageCol: {
    flex: 1,
  },
  genderCol: {
    flex: 2,
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    marginLeft: 2,
  },
  genderSegmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 3,
    height: 48,
    width: '100%',
  },
  genderTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  genderTabActive: {
    backgroundColor: '#06565F',
    shadowColor: 'rgba(4, 9, 33, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  genderTabText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
  },
  genderTabTextActive: {
    color: '#FFFFFF',
  },
  conditionsGroup: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  conditionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  conditionPillActive: {
    backgroundColor: '#06565F',
    borderColor: '#06565F',
  },
  pillCheck: {
    marginRight: 4,
  },
  conditionText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.6)',
  },
  conditionTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
});
