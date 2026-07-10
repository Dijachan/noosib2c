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

export default function InviteCaregiverScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { patientProfile, careCircle, setCareCircle } = useAuth();

  const patientName = patientProfile?.name || 'Grandpa Kunle';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Full Caregiver' | 'Observer'>('Full Caregiver');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = name.trim().length > 0 && phone.trim().length > 0;

  const handleSendInvite = () => {
    if (!isFormValid) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Append the new caregiver to Care Circle list in context
      const newCaregiver = {
        name: name.trim(),
        role,
        status: 'Pending Invite' as const,
        phone: phone.trim()
      };
      setCareCircle([...careCircle, newCaregiver]);
      navigation.goBack();
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
          {/* Custom Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Invite Care</Text>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Invite a Caregiver</Text>
            <Text style={styles.subtitle}>
              Add a nurse, family member, or neighbor to {patientName}'s care team.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Input
              label="Caregiver's Name"
              placeholder="e.g. Nurse Temi"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="WhatsApp Phone Number"
              icon="phone"
              placeholder="e.g. +234 802 345 6789"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Role Selection */}
            <View style={styles.roleSelectionGroup}>
              <Text style={styles.fieldLabel}>Choose Access Level</Text>
              
              {/* Full Caregiver Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'Full Caregiver' && styles.roleCardActive
                ]}
                onPress={() => setRole('Full Caregiver')}
                activeOpacity={0.8}
              >
                <View style={styles.roleCardHeader}>
                  <View style={styles.roleTitleRow}>
                    <Feather 
                      name="edit-3" 
                      size={18} 
                      color={role === 'Full Caregiver' ? '#06565F' : 'rgba(4,9,33,0.5)'} 
                    />
                    <Text style={styles.roleCardTitle}>Full Caregiver</Text>
                  </View>
                  <View style={[
                    styles.radioCircle,
                    role === 'Full Caregiver' && styles.radioCircleActive
                  ]}>
                    {role === 'Full Caregiver' && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.roleCardDescription}>
                  Can log daily medications, submit patient vitals, and view log history.
                </Text>
              </TouchableOpacity>

              {/* Observer Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'Observer' && styles.roleCardActive
                ]}
                onPress={() => setRole('Observer')}
                activeOpacity={0.8}
              >
                <View style={styles.roleCardHeader}>
                  <View style={styles.roleTitleRow}>
                    <Feather 
                      name="bell" 
                      size={18} 
                      color={role === 'Observer' ? '#06565F' : 'rgba(4,9,33,0.5)'} 
                    />
                    <Text style={styles.roleCardTitle}>Observer</Text>
                  </View>
                  <View style={[
                    styles.radioCircle,
                    role === 'Observer' && styles.radioCircleActive
                  ]}>
                    {role === 'Observer' && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.roleCardDescription}>
                  Receives emergency notifications only. Cannot log active medications.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Action Button (Fixed at Bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, (!isFormValid || isLoading) && styles.disabledButton]}
            disabled={!isFormValid || isLoading}
            onPress={handleSendInvite}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>
                  Send WhatsApp Invite Link
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
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 16,
    marginBottom: 20,
  },
  roleSelectionGroup: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  fieldLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    marginLeft: 2,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.08)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 6,
  },
  roleCardActive: {
    borderColor: '#06565F',
    backgroundColor: 'rgba(4, 99, 221, 0.03)',
  },
  roleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleCardTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioCircleActive: {
    borderColor: '#06565F',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#06565F',
  },
  roleCardDescription: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(4,9,33,0.5)',
    paddingLeft: 26,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 393,
    paddingHorizontal: 16,
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
