import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';

const { width } = Dimensions.get('window');

export default function MedicationDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { medId } = route.params || {};
  const { medications } = useMedication();

  const med = medications.find(m => m.id === medId);

  if (!med) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Medication not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusConfig = () => {
    switch (med.status) {
      case 'Taken': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Taken' };
      case 'Missed': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Missed' };
      default: return { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)', text: 'Pending' };
    }
  };

  const status = getStatusConfig();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.medIconContainer}>
            <Ionicons name="medical" size={40} color="#0463DD" />
          </View>
          <Text style={styles.medName}>{med.name}</Text>
          <Text style={styles.medDosage}>{med.dosage}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <View style={styles.detailIconBg}>
              <Ionicons name="time-outline" size={24} color="#0463DD" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{med.time}</Text>
            </View>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconBg}>
              <Ionicons name="calendar-outline" size={24} color="#0463DD" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{med.date}</Text>
            </View>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIconBg}>
              <Ionicons name="repeat-outline" size={24} color="#0463DD" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Frequency</Text>
              <Text style={styles.detailValue}>{med.frequency}</Text>
            </View>
          </View>

          <View style={[styles.detailCard, { backgroundColor: '#F8FAFC' }]}>
            <View style={[styles.detailIconBg, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Ionicons name="cube-outline" size={24} color="#6366F1" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Tray Slot</Text>
              <Text style={styles.detailValue}>Slot {med.slot}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>
              {med.instructions || 'Take with a glass of water after meals. Ensure full swallow.'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hardware Sync</Text>
          <View style={styles.syncCard}>
             <Ionicons name="checkmark-circle" size={24} color="#10B981" />
             <Text style={styles.syncText}>Hardware Slot #{med.slot} verified and locked.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Schedule</Text>
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
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  backBtn: {
    padding: 8,
  },
  headerAction: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  medIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  medName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: '#0F172A',
    textAlign: 'center',
  },
  medDosage: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 18,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  detailCard: {
    width: (width - 48 - 16) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  detailValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#0F172A',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 16,
  },
  instructionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0463DD',
  },
  instructionText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  syncText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#065F46',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  editBtn: {
    backgroundColor: '#F1F5F9',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#475569',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#64748B',
  },
});
