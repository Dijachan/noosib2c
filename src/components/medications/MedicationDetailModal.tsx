import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medication, useMedication } from '../../context/MedicationContext';

import { Alert } from 'react-native';
import DateTimePickerModal from './DateTimePickerModal';

const { width, height } = Dimensions.get('window');

interface MedicationDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  medication: Medication | null;
  onEdit: (med: Medication) => void;
  onDelete: (med: Medication) => void;
}

export default function MedicationDetailModal({
  isVisible,
  onClose,
  medication,
  onEdit,
  onDelete,
}: MedicationDetailModalProps) {
  const { addMedication } = useMedication();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!medication) return null;

  // Parse time string for picker (e.g. "08:00 AM" -> Date object)
  const getInitialTime = () => {
    const d = new Date();
    const timeStr = medication.time;
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const [t, modifier] = timeStr.split(' ');
      let [hours, minutes] = t.split(':');
      let h = parseInt(hours, 10);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      d.setHours(h, parseInt(minutes, 10), 0, 0);
    }
    return d;
  };

  const onTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate && medication) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      const m = minutes.toString().padStart(2, '0');
      const newTime = `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
      
      try {
        await addMedication({ ...medication, time: newTime });
      } catch (error) {
        Alert.alert('Update Error', 'Failed to update intake time.');
      }
    }
  };

  const onDateChange = async (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && medication) {
      const today = new Date();
      let newDateStr = '';
      if (selectedDate.toDateString() === today.toDateString()) {
        newDateStr = 'Today';
      } else {
        newDateStr = selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      }

      try {
        await addMedication({ ...medication, date: newDateStr });
      } catch (error) {
        Alert.alert('Update Error', 'Failed to update intake date.');
      }
    }
  };

  const getStatusConfig = () => {
    switch (medication.status) {
      case 'Taken': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Taken' };
      case 'Missed': return { color: '#FF6F61', bg: 'rgba(239, 68, 68, 0.1)', text: 'Missed' };
      default: return { color: '#D6FB00', bg: 'rgba(99, 102, 241, 0.1)', text: 'Pending' };
    }
  };

  const status = getStatusConfig();

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.dismissOverlay} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        
        <View style={styles.modalContent}>
          <View style={styles.pullBar} />
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Medication Info</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.heroSection}>
              <View style={styles.medIconContainer}>
                <Ionicons name="medical" size={40} color="#06565F" />
              </View>
              <Text style={styles.medName}>{medication.name}</Text>
              <Text style={styles.medDosage}>
                {medication.dosage} • {medication.dosageAmount} {medication.dosageUnit}(s)
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={styles.detailIconBg}>
                  <Ionicons name="time-outline" size={24} color="#06565F" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{medication.time}</Text>
                </View>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailIconBg}>
                  <Ionicons name="calendar-outline" size={24} color="#06565F" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{medication.date}</Text>
                </View>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailIconBg}>
                  <Ionicons name="cube-outline" size={24} color="#D6FB00" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Tray Slot</Text>
                  <Text style={styles.detailValue}>Slot {medication.slot}</Text>
                </View>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailIconBg}>
                  <Ionicons name="repeat-outline" size={24} color="#06565F" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Frequency</Text>
                  <Text style={styles.detailValue}>{medication.frequency}</Text>
                </View>
              </View>
            </View>

            {medication.instructions ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                <View style={styles.instructionCard}>
                   <Text style={styles.instructionText}>{medication.instructions}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.actionSection}>
              <TouchableOpacity 
                style={styles.editBtn} 
                onPress={() => {
                  onEdit(medication);
                }}
              >
                <Ionicons name="create-outline" size={20} color="#475569" />
                <Text style={styles.editBtnText}>Edit Schedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => {
                  onDelete(medication);
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6F61" />
                <Text style={styles.deleteBtnText}>Delete Medication</Text>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={showTimePicker}
              onClose={() => setShowTimePicker(false)}
              value={getInitialTime()}
              mode="time"
              onConfirm={(selectedDate) => onTimeChange({}, selectedDate)}
            />

            <DateTimePickerModal
              isVisible={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              value={new Date()}
              mode="date"
              onConfirm={(selectedDate) => onDateChange({}, selectedDate)}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: height * 0.85,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  pullBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  medIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  medName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 26,
    color: '#0F172A',
    textAlign: 'center',
  },
  medDosage: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 18,
    color: '#64748B',
    marginBottom: 12,
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
    width: (width - 48 - 16) / 2, // 2 column grid
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailIconBg: {
    width: 40,
    height: 40,
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
    marginBottom: 12,
  },
  instructionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#06565F',
  },
  instructionText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  actionSection: {
    gap: 12,
  },
  editBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#475569',
  },
  deleteBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FF6F61',
  },
});
