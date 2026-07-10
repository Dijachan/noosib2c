import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';
import CustomAlertModal from '../../components/medications/CustomAlertModal';

export default function MedicationDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { medId } = route.params || {};
  const { medicationList, addMedication, deleteMedication } = useMedication();

  const med = medicationList.find(m => m.id === medId);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showAlert = (
    title: string, 
    message: string, 
    onConfirm?: () => void, 
    confirmText = 'OK', 
    onCancel?: () => void, 
    cancelText?: string
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onCancel) onCancel();
      }
    });
  };

  if (!med) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
          <View style={styles.navPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Prescription not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const priority = med.priority || 'Maintenance';
  const formFactor = med.formFactor || 'Tablet';
  const pillColor = med.pillColor || '#3B82F6';
  const brand = med.brand || 'Generic';
  const stock = med.stock ? parseInt(med.stock) : 24;
  const qty = med.dosageAmount ? parseFloat(med.dosageAmount) : 1;
  const daysLeft = med.daysLeft || Math.ceil(stock / qty);

  // Check for Lisinopril + Metformin Drug Interaction
  const hasInteraction = () => {
    const nameLower = med.name.toLowerCase();
    if (nameLower.includes('metformin') || nameLower.includes('glucophage')) {
      return medicationList.some(m => 
        m.name.toLowerCase().includes('lisinopril') || 
        m.name.toLowerCase().includes('zestril')
      );
    }
    if (nameLower.includes('lisinopril') || nameLower.includes('zestril')) {
      return medicationList.some(m => 
        m.name.toLowerCase().includes('metformin') || 
        m.name.toLowerCase().includes('glucophage')
      );
    }
    return false;
  };

  const getInteractionPartner = () => {
    const nameLower = med.name.toLowerCase();
    if (nameLower.includes('metformin')) return 'Lisinopril';
    return 'Metformin';
  };

  const renderPillVector = () => {
    switch (formFactor) {
      case 'Capsule':
        return (
          <View style={styles.vectorCapsule}>
            <View style={[styles.capsuleHalf, { backgroundColor: pillColor }]} />
            <View style={[styles.capsuleHalf, styles.capsuleWhite]} />
          </View>
        );
      case 'Liquid':
        return (
          <Ionicons name="flask-outline" size={60} color={pillColor} />
        );
      case 'Injection':
        return (
          <Ionicons name="eyedropper-outline" size={60} color={pillColor} />
        );
      default: // Tablet
        return (
          <View style={[styles.vectorTablet, { backgroundColor: pillColor }]}>
            <View style={styles.tabletScore} />
          </View>
        );
    }
  };

  const handleEdit = () => {
    navigation.navigate('Schedule', {
      drugData: {
        name: med.name,
        brand,
        strength: med.dosage,
        formFactor,
        pillColor,
        instructions: med.instructions,
      },
      isEditing: true,
      editMed: med
    });
  };

  const handleToggleArchive = async () => {
    const isArchived = !med.isArchived;
    try {
      await addMedication({
        ...med,
        isArchived
      });
      showAlert(
        isArchived ? 'Prescription Archived' : 'Prescription Activated',
        `${med.name} moved to ${isArchived ? 'archived' : 'active'} medications.`,
        () => {
          navigation.goBack();
        }
      );
    } catch (e) {
      showAlert('Error', 'Failed to archive prescription.');
    }
  };

  const handleArchive = () => {
    showAlert(
      med.isArchived ? 'Activate Prescription' : 'Archive Prescription',
      `Would you like to ${med.isArchived ? 'reactivate' : 'archive'} ${med.name}?`,
      () => {
        setTimeout(() => {
          handleToggleArchive();
        }, 300);
      },
      med.isArchived ? 'Reactivate' : 'Archive',
      () => {},
      'Cancel'
    );
  };

  const handleDelete = () => {
    showAlert(
      'Delete Prescription',
      `Are you sure you want to delete ${med.name}? This will permanently remove it from the digital cabinet and delete all schedule logs.`,
      async () => {
        try {
          await deleteMedication(med.id);
          navigation.goBack();
        } catch (e) {
          showAlert('Error', 'Failed to delete medication.');
        }
      },
      'Delete',
      () => {},
      'Cancel'
    );
  };

  // Mock Adherence Logs (Taken = solid index, Missed = outline index)
  const complianceGrid = [
    { day: 1, status: 'Taken' },
    { day: 2, status: 'Taken' },
    { day: 3, status: 'Taken' },
    { day: 4, status: 'Missed' },
    { day: 5, status: 'Taken' },
    { day: 6, status: 'Taken' },
    { day: 7, status: 'Taken' },
    { day: 8, status: 'Taken' },
    { day: 9, status: 'Missed' },
    { day: 10, status: 'Taken' },
    { day: 11, status: 'Taken' },
    { day: 12, status: 'Taken' },
    { day: 13, status: 'Taken' },
    { day: 14, status: med.status === 'Taken' ? 'Taken' : 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medication Details</Text>
        <TouchableOpacity style={styles.headerAction} onPress={handleDelete}>
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pill Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.vectorContainer}>
            {renderPillVector()}
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.medName}>{med.name}</Text>
            <Text style={styles.brandName}>{brand} • {med.dosage}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>{priority}</Text>
              </View>
              <View style={styles.formBadge}>
                <Text style={styles.formText}>{formFactor}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Warning Interaction Banner */}
        {hasInteraction() && (
          <View style={styles.aiWarningBanner}>
            <Feather name="alert-triangle" size={20} color="#991B1B" />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>⚠️ AI warning: Interacts with {getInteractionPartner()}</Text>
              <Text style={styles.warningSubtitle}>
                Avoid taking these together. Consult your physician.
              </Text>
            </View>
          </View>
        )}

        {/* Stock Level Tracker Progress Bar */}
        <View style={styles.sectionCard}>
          <View style={styles.stockHeader}>
            <Text style={styles.cardTitle}>Pill Stock</Text>
            <Text style={[styles.stockLabel, daysLeft < 5 && styles.stockWarningLabel]}>
              {stock} left (~{daysLeft} days)
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { 
                width: `${Math.min(100, (stock / 60) * 100)}%`,
                backgroundColor: daysLeft < 5 ? '#EF4444' : '#0463DD'
              }
            ]} />
          </View>
          {daysLeft < 5 && (
            <Text style={styles.lowStockWarning}>
              ⚠️ Running low. Order a refill soon.
            </Text>
          )}
        </View>

        {/* 14-Day Adherence Calendar Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>14-Day History</Text>
          <Text style={styles.legend}>
            ✓ Solid = Taken | ✗ Outline = Missed
          </Text>

          <View style={styles.calendarGrid}>
            {complianceGrid.map((day, idx) => {
              const isTaken = day.status === 'Taken';
              const isMissed = day.status === 'Missed';
              return (
                <View 
                  key={idx} 
                  style={[
                    styles.gridCell,
                    isTaken && { backgroundColor: pillColor, borderColor: pillColor },
                    isMissed && styles.gridCellMissed
                  ]}
                >
                  <Text style={[
                    styles.cellText,
                    isTaken && styles.cellTextTaken,
                    isMissed && styles.cellTextMissed
                  ]}>
                    {day.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Schedule Info Panel */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Schedule Info</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.infoValue}>
                {med.startDate ? new Date(med.startDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'Today'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{med.duration || 'Ongoing'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Daily Doses</Text>
              <Text style={styles.infoValue}>
                {med.time ? med.time.split(' - ')[0] : 'As Needed'}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions Panel */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            {med.instructions || 'No specific administration notes.'}
          </Text>
        </View>
      </ScrollView>

      {/* Primary Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEdit}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={18} color="#0463DD" />
          <Text style={styles.editButtonText}>Edit Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.archiveButton} 
          onPress={handleArchive}
          activeOpacity={0.8}
        >
          <Feather name="archive" size={18} color="#EF4444" />
          <Text style={styles.archiveButtonText}>
            {med.isArchived ? 'Reactivate' : 'Archive'}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlertModal
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  backBtn: {
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
  headerAction: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    gap: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.04)',
  },
  vectorContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.06)',
  },
  vectorTablet: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletScore: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  vectorCapsule: {
    width: 24,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.1)',
    overflow: 'hidden',
  },
  capsuleHalf: {
    flex: 1,
  },
  capsuleWhite: {
    backgroundColor: '#F3F4F6',
  },
  infoGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  medName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  brandName: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  priorityBadge: {
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  priorityText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#0463DD',
  },
  formBadge: {
    backgroundColor: 'rgba(4,9,33,0.06)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  formText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: 'rgba(4,9,33,0.6)',
  },
  aiWarningBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#991B1B',
    marginBottom: 2,
  },
  warningSubtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 12,
    color: 'rgba(153,27,27,0.8)',
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 4,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stockLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: '#0463DD',
  },
  stockWarningLabel: {
    color: '#EF4444',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  lowStockWarning: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 11,
    color: '#EF4444',
    marginTop: 8,
  },
  legend: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginBottom: 12,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCell: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  gridCellMissed: {
    borderColor: '#EF4444',
    borderStyle: 'dashed',
  },
  cellText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.3)',
  },
  cellTextTaken: {
    color: '#FFFFFF',
  },
  cellTextMissed: {
    color: '#EF4444',
  },
  instructionsText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(4,9,33,0.6)',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#0463DD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0463DD',
  },
  archiveButton: {
    flex: 1.1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  archiveButtonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#EF4444',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: 'rgba(4,9,33,0.4)',
  },
  infoGrid: {
    gap: 10,
    marginTop: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.4)',
  },
  infoValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
});
