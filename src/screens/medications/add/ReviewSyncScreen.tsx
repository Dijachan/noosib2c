import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../../context/MedicationContext';

export default function ReviewSyncScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { addMedication } = useMedication();
  const route = useRoute<any>();
  const { finalData } = route.params || { 
    finalData: { 
      name: 'Metformin', 
      dosage: '500mg', 
      type: 'Tablet',
      dosageAmount: '1',
      slot: 3,
      frequency: 'Daily',
      time: '08:00 AM',
      date: 'Today'
    } 
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate sync with hardware
    setTimeout(() => {
      setIsSyncing(false);
      setIsSuccess(true);
      
      // Save to global state
      addMedication({
        id: Math.random().toString(36).substr(2, 9),
        ...finalData,
        status: 'Pending'
      });
    }, 2500);
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successContent}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-done" size={64} color="#059669" />
          </View>
          <Text style={styles.successTitle}>Successfully Linked!</Text>
          <Text style={styles.successSubtitle}>
            {finalData.name} has been synced to Slot {finalData.slot} of the Smart Tray.
          </Text>
          
          <View style={styles.receipt}>
             <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Medication</Text>
                <Text style={styles.receiptValue}>{finalData.name}</Text>
             </View>
             <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Slot Number</Text>
                <Text style={styles.receiptValue}>Slot {finalData.slot}</Text>
             </View>
             <View style={styles.receiptRow}>
                 <Text style={styles.receiptLabel}>Schedule</Text>
                 <Text style={styles.receiptValue}>{finalData.time} • {finalData.date}</Text>
              </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 5 of 5</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Review & Confirm</Text>
        <Text style={styles.subtitle}>
          Ensure everything is correct before syncing to the hardware.
        </Text>

        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.drugBadge}>
              <Ionicons name="medical" size={20} color="#0463DD" />
            </View>
            <View>
              <Text style={styles.reviewDrugName}>{finalData.name}</Text>
              <Text style={styles.reviewDrugMeta}>{finalData.dosage} • {finalData.type}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Slot Mapping</Text>
              <View style={styles.slotBadge}>
                 <Text style={styles.slotBadgeText}>SLOT {finalData.slot}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{finalData.time}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{finalData.date}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>{finalData.frequency}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Dosage</Text>
              <Text style={styles.infoValue}>{finalData.dosageAmount} {finalData.type}(s)</Text>
            </View>
          </View>
          
          {finalData.instructions ? (
            <View style={styles.instructionBox}>
              <Text style={styles.infoLabel}>Instructions</Text>
              <Text style={styles.instructionText}>{finalData.instructions}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="hardware-chip-outline" size={20} color="#F59E0B" />
          <Text style={styles.warningText}>
            This will update the physical tray. Make sure the medication is placed in the correct slot.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          disabled={isSyncing}
          onPress={handleSync}
        >
          {isSyncing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryBtnText}>Sync with Hardware</Text>
              <Ionicons name="bluetooth" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  drugBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(4, 99, 221, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewDrugName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  reviewDrugMeta: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  infoItem: {
    width: '45%',
    gap: 4,
  },
  infoLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  slotBadge: {
    backgroundColor: '#0463DD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  slotBadgeText: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  instructionBox: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 4,
  },
  instructionText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 40,
  },
  warningText: {
    flex: 1,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryBtn: {
    backgroundColor: '#0463DD',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Success styles
  successContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 28,
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
  },
  receipt: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
  receiptValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
});
