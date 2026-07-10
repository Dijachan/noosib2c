import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication, Medication } from '../../context/MedicationContext';
import CustomAlertModal from '../../components/medications/CustomAlertModal';

type RouteParams = {
  LogDoseQuick: {
    medId?: string;
  };
};

export default function LogDoseQuickScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<RouteParams, 'LogDoseQuick'>>();
  const { medicationList, logDose } = useMedication();

  const medId = route.params?.medId;
  // If medId passed, use it. Otherwise, find first pending med
  const selectedMed = medicationList.find(m => m.id === medId) || 
                       medicationList.find(m => m.status === 'Pending') || 
                       medicationList[0];

  const [adjustedTime, setAdjustedTime] = useState(selectedMed?.time.split('-')[0].trim() || '08:00 AM');
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
  }>({ visible: false, title: '', message: '', onClose: () => {} });

  if (!selectedMed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No medications available to log.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleMarkTaken = async () => {
    // Generate loggedAt with adjusted time
    const [timeStr, ampm] = adjustedTime.split(' ');
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    if (ampm?.toUpperCase() === 'PM' && h < 12) h += 12;
    if (ampm?.toUpperCase() === 'AM' && h === 12) h = 0;

    const logDate = new Date();
    logDate.setHours(h, parseInt(minutes || '0', 10), 0, 0);

    try {
      await logDose({
        medicationId: selectedMed.id,
        medName: selectedMed.name,
        outcome: 'taken',
        loggedAt: logDate.toISOString(),
        loggedBy: 'caregiver',
        verificationMethod: 'manual',
        photoVerified: false,
        ndprEncrypted: false,
        notes: `Logged by Caregiver. Time adjusted to ${adjustedTime}.`
      });

      setAlertConfig({
        visible: true,
        title: 'Success',
        message: 'Dose logged successfully!',
        onClose: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to log dose.',
        onClose: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  const handleMarkMissed = async () => {
    try {
      await logDose({
        medicationId: selectedMed.id,
        medName: selectedMed.name,
        outcome: 'missed',
        loggedAt: new Date().toISOString(),
        loggedBy: 'caregiver',
        verificationMethod: 'manual',
        photoVerified: false,
        ndprEncrypted: false,
        notes: 'Marked as missed by caregiver.'
      });

      setAlertConfig({
        visible: true,
        title: 'Logged Missed',
        message: 'Dose logged as Missed.',
        onClose: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          navigation.goBack();
        }
      });
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to update dose status.',
        onClose: () => setAlertConfig(prev => ({ ...prev, visible: false }))
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Dose</Text>
          <View style={styles.navPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Medication Summary Header Card */}
          <View style={styles.summaryCard}>
            <View style={[styles.pillIconBg, { backgroundColor: selectedMed.pillColor || '#0463DD' + '15' }]}>
              <Ionicons name="medical" size={24} color={selectedMed.pillColor || '#0463DD'} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.drugName}>{selectedMed.name}</Text>
              <Text style={styles.drugBrand}>{selectedMed.brand || 'Prescription Medication'}</Text>
              <Text style={styles.doseContext}>
                Dose: {selectedMed.dosageAmount} {selectedMed.dosageUnit} | {selectedMed.time.split('-')[0].trim()}
              </Text>
            </View>
          </View>

          {/* Primary Log Button (Oversized) */}
          <TouchableOpacity 
            style={styles.primaryLogBtn}
            onPress={handleMarkTaken}
            activeOpacity={0.9}
          >
            <View style={styles.checkIconWrapper}>
              <Feather name="check" size={32} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.primaryLogText}>Mark as Taken</Text>
          </TouchableOpacity>

          {/* Photo Proof Secondary Action */}
          <TouchableOpacity 
            style={styles.photoProofBtn}
            onPress={() => navigation.navigate('PhotoProof', { medId: selectedMed.id, medName: selectedMed.name })}
            activeOpacity={0.8}
          >
            <View style={styles.photoIconWrapper}>
              <Feather name="camera" size={20} color="#0463DD" />
            </View>
            <View style={styles.photoTextWrapper}>
              <Text style={styles.photoProofTitle}>Add Photo Verification Proof</Text>
              <Text style={styles.photoProofSubtitle}>Camera-based AI pill-pack verification</Text>
            </View>
            <Feather name="chevron-right" size={20} color="rgba(4,9,33,0.3)" />
          </TouchableOpacity>

          {/* Retroactive Timestamp Input */}
          <View style={styles.timestampSection}>
            <Text style={styles.fieldLabel}>Adjust Timestamp (Retroactive log)</Text>
            <View style={styles.inputContainer}>
              <Feather name="clock" size={18} color="rgba(4,9,33,0.4)" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 8:00 AM"
                placeholderTextColor="rgba(4,9,33,0.3)"
                value={adjustedTime}
                onChangeText={setAdjustedTime}
              />
            </View>
            <Text style={styles.timestampHint}>
              Override the log time if administered earlier
            </Text>
          </View>

          {/* Mark as Missed (Destructive Link) */}
          <TouchableOpacity 
            style={styles.missedLinkBtn}
            onPress={handleMarkMissed}
            activeOpacity={0.7}
          >
            <Text style={styles.missedLinkText}>Mark as Missed</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlertModal
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onClose}
        confirmText="OK"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  backIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 24,
    alignItems: 'center',
    maxWidth: 393,
    width: '100%',
    alignSelf: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  pillIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  drugName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  drugBrand: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -2,
  },
  doseContext: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: '#0463DD',
    marginTop: 4,
  },
  primaryLogBtn: {
    backgroundColor: '#10B981',
    width: '100%',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  checkIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLogText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  photoProofBtn: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  photoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(4,99,221,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTextWrapper: {
    flex: 1,
  },
  photoProofTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  photoProofSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
  },
  timestampSection: {
    width: '100%',
  },
  fieldLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.6)',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 15,
    color: '#0F172A',
  },
  timestampHint: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: 6,
  },
  missedLinkBtn: {
    paddingVertical: 12,
  },
  missedLinkText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#EF4444',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.5)',
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#0463DD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
