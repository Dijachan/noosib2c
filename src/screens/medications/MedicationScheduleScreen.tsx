import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication, Medication } from '../../context/MedicationContext';
import MedicationDetailModal from '../../components/medications/MedicationDetailModal';
import DeleteConfirmationModal from '../../components/medications/DeleteConfirmationModal';
import DateTimePickerModal from '../../components/medications/DateTimePickerModal';

type StatusFilter = 'All' | 'Taken' | 'Pending' | 'Missed';

const FilterChip = ({ 
  label, 
  active, 
  onPress,
  count
}: { 
  label: string; 
  active: boolean; 
  onPress: () => void;
  count?: number;
}) => (
  <TouchableOpacity 
    style={[styles.filterChip, active && styles.filterChipActive]} 
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
      {label} {count !== undefined && <Text style={{ fontSize: 11 }}>({count})</Text>}
    </Text>
  </TouchableOpacity>
);

const MedicationScheduleCard = ({ 
  item, 
  onPress 
}: { 
  item: any; 
  onPress: (id: string) => void;
}) => {
  const status = item.status || 'Pending';
  
  const getStatusConfig = () => {
    switch(status.toLowerCase()) {
      case 'taken': return { color: '#10B981', icon: 'checkmark-circle', bg: 'rgba(16, 185, 129, 0.08)' };
      case 'missed': return { color: '#EF4444', icon: 'close-circle', bg: 'rgba(239, 68, 68, 0.08)' };
      default: return { color: '#0463DD', icon: 'time', bg: 'rgba(4, 99, 221, 0.08)' };
    }
  };

  const config = getStatusConfig();
  
  return (
    <TouchableOpacity 
      style={[styles.medCard, { borderLeftColor: config.color, borderLeftWidth: 4 }]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.medIconContainer, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon as any} size={22} color={config.color} />
      </View>
      
      <View style={styles.medContent}>
        <View style={styles.medTitleRow}>
          <Text style={styles.medTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.medQuantity}> • {item.dosageAmount} {item.type || 'Pill'}</Text>
        </View>
        
        <View style={styles.medMetaRows}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.metaText}>{item.time} • {item.date}</Text>
          </View>
          {item.slot && (
            <View style={styles.metaRow}>
              <Ionicons name="cube-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>Slot {item.slot}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusBadgeText, { color: config.color }]}>
          {status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MedicationScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medicationList, adherenceLogs, deleteMedication, addMedication } = useMedication();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('All');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Fusion Logic: Merge real logs (history) with current schedule (pending)
  const unifiedDoseList = useMemo(() => {
    // 1. Convert adherence logs to common format
    const historyDoses = (adherenceLogs || []).map(log => ({
      id: `log-${log.id || log.timestamp}`,
      originalId: log.medication_id,
      name: log.medName,
      dosageAmount: '1', // Fallback if not in log
      type: 'Tablet',
      time: log.time,
      date: log.date,
      slot: log.slot,
      status: log.status, // 'taken' or 'missed'
      timestamp: log.timestamp
    }));

    // 2. Filter medicationList for upcoming "Pending" doses
    // In a real app, we'd check if a log exists for today. 
    // For this UI, we show all active medications as "Pending" if they haven't been logged today.
    const pendingDoses = medicationList.filter(med => {
      // Check if this med already has a log entry for "Today"
      const hasLogToday = historyDoses.some(h => h.name === med.name && h.date.toLowerCase().includes('today'));
      return !hasLogToday;
    }).map(med => ({
      ...med,
      status: 'Pending',
      timestamp: Date.now() + 1000 // Future sort
    }));

    const fullList = [...historyDoses, ...pendingDoses];

    // 3. Filter and Search
    return fullList.filter(dose => {
      const matchesSearch = dose.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilter === 'All') return true;
      return dose.status.toLowerCase() === activeFilter.toLowerCase();
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first (History at top, then pending)
  }, [medicationList, adherenceLogs, searchQuery, activeFilter]);

  const counts = useMemo(() => {
    return {
      Taken: (adherenceLogs || []).filter(l => l.status === 'taken').length,
      Missed: (adherenceLogs || []).filter(l => l.status === 'missed').length,
      Pending: unifiedDoseList.filter(d => d.status === 'Pending').length,
    };
  }, [adherenceLogs, unifiedDoseList]);

  const handleMedPress = (id: string) => {
    // Tapping a history item shouldn't necessarily allow editing, 
    // but tapping a "Pending" one should.
    const dose = unifiedDoseList.find(d => d.id === id);
    if (!dose) return;

    if (dose.status === 'Pending') {
      const med = medicationList.find(m => m.name === dose.name);
      if (med) {
        setSelectedMed(med);
        setIsModalVisible(true);
      }
    } else {
      Alert.alert('Historical Record', `This dose was marked as ${dose.status} at ${dose.time}.`);
    }
  };

  const handleEditMed = (med: Medication) => {
    setIsModalVisible(false);
    navigation.navigate('SearchDrug', { editMed: med, isEditing: true });
  };

  const handleDeleteMed = (med: Medication) => {
    setSelectedMed(med);
    setIsModalVisible(false);
    setTimeout(() => setIsDeleteModalVisible(true), 100);
  };

  const confirmDelete = async () => {
    if (selectedMed) {
      try {
        await deleteMedication(selectedMed.id);
        setIsDeleteModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to delete medication.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity & Schedule</Text>
        <TouchableOpacity style={styles.refreshBtn}>
          <Ionicons name="calendar-outline" size={22} color="#0463DD" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Search medications..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterStrip}
        >
          <FilterChip 
            label="All" 
            active={activeFilter === 'All'} 
            onPress={() => setActiveFilter('All')} 
          />
          <FilterChip 
            label="Taken" 
            count={counts.Taken}
            active={activeFilter === 'Taken'} 
            onPress={() => setActiveFilter('Taken')} 
          />
          <FilterChip 
            label="Missed" 
            count={counts.Missed}
            active={activeFilter === 'Missed'} 
            onPress={() => setActiveFilter('Missed')} 
          />
          <FilterChip 
            label="Pending" 
            count={counts.Pending}
            active={activeFilter === 'Pending'} 
            onPress={() => setActiveFilter('Pending')} 
          />
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.medList}>
          {unifiedDoseList.length > 0 ? (
            unifiedDoseList.map((item) => (
              <MedicationScheduleCard
                key={item.id}
                item={item}
                onPress={handleMedPress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="clipboard-outline" size={48} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyText}>No doses found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your status filters</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <MedicationDetailModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        medication={selectedMed}
        onEdit={handleEditMed}
        onDelete={handleDeleteMed}
      />

      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        medName={selectedMed?.name || ''}
        slot={selectedMed?.slot.toString() || ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8FAFC',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  searchFilterContainer: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  filterStrip: {
    gap: 10,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0463DD',
    borderColor: '#0463DD',
  },
  filterChipText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  medList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
  },
  medIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medContent: {
    flex: 1,
    marginLeft: 12,
  },
  medTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  medQuantity: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#64748B',
  },
  medMetaRows: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#475569',
  },
  emptySubtext: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
