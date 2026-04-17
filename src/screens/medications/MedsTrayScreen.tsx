import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomNav from '../../components/navigation/BottomNav';
import { useMedication, Medication } from '../../context/MedicationContext';

import { Alert } from 'react-native';
import MedicationDetailModal from '../../components/medications/MedicationDetailModal';
import DeleteConfirmationModal from '../../components/medications/DeleteConfirmationModal';
import DateTimePickerModal from '../../components/medications/DateTimePickerModal';

const { width } = Dimensions.get('window');

// Redesigned Tray Slot Component
const TraySlotBox = ({ 
  id, 
  status, 
  medName, 
  time, 
  date,
  onPress
}: { 
  id: number; 
  status: 'Empty' | 'Occupied' | 'Missed' | 'Next'; 
  medName?: string;
  time?: string;
  date?: string;
  onPress?: () => void;
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'Next': return { bg: '#F5F3FF', border: '#0463DD', text: '#0463DD', icon: 'time' };
      case 'Occupied': return { bg: '#F8FAFC', border: '#E2E8F0', text: '#0F172A', icon: 'medical' };
      case 'Missed': return { bg: 'rgba(239, 68, 68, 0.05)', border: '#EF4444', text: '#EF4444', icon: 'alert-circle' };
      default: return { bg: '#FFFFFF', border: '#F1F5F9', text: '#94A3B8', icon: 'add-circle-outline' };
    }
  };

  const colors = getStatusColors();

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.slotBox, 
        { backgroundColor: colors.bg, borderColor: colors.border },
        status === 'Next' && styles.slotBoxNext
      ]}
    >
      <View style={styles.slotHeader}>
        <Text style={[styles.slotId, { color: colors.text }]}>{id}</Text>
        <Ionicons name={colors.icon as any} size={18} color={colors.text} />
      </View>
      
      <View style={styles.slotBody}>
        {medName ? (
          <>
            <Text style={styles.slotMedName} numberOfLines={1}>{medName}</Text>
            <Text style={styles.slotTime}>{time} • {date}</Text>
          </>
        ) : (
          <Text style={styles.slotEmptyText}>Empty</Text>
        )}
      </View>
      
      {status === 'Next' && (
        <View style={styles.nextBadge}>
          <Text style={styles.nextBadgeText}>UP NEXT</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function MedsTrayScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { 
    medicationList, 
    adherenceLogs, 
    activityLogs, 
    getSlotStatus, 
    getMedicationBySlot, 
    deleteMedication, 
    addMedication 
  } = useMedication();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSlotPress = (slotId: number) => {
    const status = getSlotStatus(slotId);
    if (status === 'Empty') {
      navigation.navigate('SearchDrug', { slot: slotId });
    } else {
      const med = getMedicationBySlot(slotId);
      if (med) {
        setSelectedMed(med);
        setIsModalVisible(true);
      }
    }
  };

  const handleMedPress = (med: Medication) => {
    setSelectedMed(med);
    setIsModalVisible(true);
  };

  const getInitialTime = () => {
    const d = new Date();
    const timeStr = selectedMed?.time || '08:00 AM';
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
    if (selectedDate && selectedMed) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      const m = minutes.toString().padStart(2, '0');
      const newTime = `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
      
      try {
        await addMedication({ ...selectedMed, time: newTime });
        Alert.alert('Success', 'Intake time updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update time.');
      }
    }
  };

  const onDateChange = async (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && selectedMed) {
      const today = new Date();
      let newDateStr = '';
      if (selectedDate.toDateString() === today.toDateString()) {
        newDateStr = 'Today';
      } else {
        newDateStr = selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      }

      try {
        await addMedication({ ...selectedMed, date: newDateStr });
        Alert.alert('Success', 'Intake date updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update date.');
      }
    }
  };

  const handleEditMed = (med: Medication) => {
    setIsModalVisible(false);
    navigation.navigate('SearchDrug', { 
      editMed: med,
      isEditing: true
    });
  };

  const handleDeleteMed = (med: Medication) => {
    setSelectedMed(med);
    setIsModalVisible(false); // Close detail modal first
    setTimeout(() => {
      setIsDeleteModalVisible(true);
    }, 100);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 100);
  };

  const confirmDelete = async () => {
    if (selectedMed) {
      try {
        await deleteMedication(selectedMed.id);
        setIsDeleteModalVisible(false);
        setIsModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to delete medication.');
      }
    }
  };

  // Consolidate and sort activities
  const recentActivities = [
    ...(adherenceLogs || []),
    ...(activityLogs || [])
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  const getActivityConfig = (type: string) => {
    switch (type) {
      case 'taken': return { icon: 'checkmark-circle', color: '#10B981', action: 'taken' };
      case 'created': return { icon: 'add-circle', color: '#0463DD', action: 'added' };
      case 'edited': return { icon: 'create', color: '#6366F1', action: 'updated' };
      case 'deleted': return { icon: 'trash', color: '#EF4444', action: 'unlinked' };
      default: return { icon: 'information-circle', color: '#64748B', action: 'activity' };
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meds Tray</Text>
          <TouchableOpacity style={styles.configBtn}>
             <Ionicons name="settings-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Caregiver Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                 <Ionicons name="heart" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>Mummy K ❤️ is protected</Text>
                <Text style={styles.heroSubtitle}>She's on track with {medicationList.length} doses today!</Text>
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressLeft}>
                <Text style={styles.progressCount}>{medicationList.length}/14</Text>
                <Text style={styles.progressLabel}>Filled Slots</Text>
              </View>
              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(medicationList.length / 14) * 100}%` }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Meds Tray Visual Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tray Digital Twin</Text>
            <Text style={styles.sectionSubtitle}>Mirrors the 14 slots in the physical device</Text>
          </View>

          <View style={styles.trayGrid}>
            {Array.from({ length: 14 }, (_, i) => {
              const slotId = i + 1;
              const status = getSlotStatus(slotId);
              const med = getMedicationBySlot(slotId);
              return (
                <TraySlotBox 
                  key={slotId} 
                  id={slotId} 
                  status={status} 
                  medName={med?.name} 
                  time={med?.time}
                  date={med?.date}
                  onPress={() => med ? handleMedPress(med) : handleSlotPress(slotId)}
                />
              );
            })}
          </View>

          {/* Recent Activity Timeline */}
          <View style={[styles.sectionHeader, styles.sectionHeaderRow]}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ActivityLog')}>
               <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeline}>
            {recentActivities.length > 0 ? recentActivities.map((log, index) => {
              const config = getActivityConfig(log.type);
              return (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityIconContainer, { backgroundColor: config.color + '1A' }]}>
                    <Ionicons name={config.icon as any} size={20} color={config.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTitle} numberOfLines={1}>
                        {log.medName} <Text style={{ color: config.color }}>{config.action}</Text>
                      </Text>
                      <Text style={styles.activityTime}>{log.time}</Text>
                    </View>
                    <Text style={styles.activityMeta}>Slot {log.slot} • {log.date}</Text>
                  </View>
                </View>
              );
            }) : (
              <View style={styles.emptyActivity}>
                <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
                <Text style={styles.emptyActivityText}>No recent activity recorded yet.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeTab="Meds" />

      <MedicationDetailModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        medication={selectedMed}
        onEdit={handleEditMed}
        onDelete={handleDeleteMed}
      />

      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        medName={selectedMed?.name || ''}
        slot={selectedMed?.slot.toString() || ''}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  configBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#0463DD',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    elevation: 0,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressLeft: {
    // Aligns visually with the heart icon above
    width: 64, 
    alignItems: 'center',
  },
  progressCount: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  progressLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
  },
  progressBarWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  seeAllText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4, 9, 33, 0.4)',
  },
  sectionSubtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  trayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 40,
  },
  traySlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  slotBox: {
    width: (width - 48 - 16) / 2, // 2 column grid
    height: 120,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 12,
    justifyContent: 'space-between',
  },
  slotBoxNext: {
    borderWidth: 2,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotId: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 14,
  },
  slotBody: {
    gap: 2,
  },
  slotMedName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: '#0F172A',
  },
  slotTime: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 11,
    color: '#64748B',
  },
  slotEmptyText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  nextBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#0463DD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  nextBadgeText: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 8,
    color: '#FFFFFF',
  },
  timeline: {
    paddingHorizontal: 24,
    gap: 20,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  activityTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#0F172A',
  },
  activityTime: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#94A3B8',
  },
  activityMeta: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#64748B',
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyActivityText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
});
