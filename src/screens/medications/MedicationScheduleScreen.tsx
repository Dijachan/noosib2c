import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomNav from '../../components/navigation/BottomNav';
import { useMedication, Medication } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';
import MiniPillVector from '../../components/medications/MiniPillVector';

export default function MedicationScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medicationList } = useMedication();
  const { patientProfile } = useAuth();

  const patientName = patientProfile?.name || 'Grandpa Kunle';
  
  const [activeTab, setActiveTab] = useState<'Active' | 'Refill' | 'Archived'>('Active');

  const getFilteredMeds = () => {
    return medicationList.filter(med => {
      if (activeTab === 'Archived') {
        return med.isArchived === true;
      }

      const stock = med.stock ? parseInt(med.stock) : 24;
      const daysLeft = med.daysLeft || Math.ceil(stock / 2);
      const isLowStock = daysLeft < 5;

      if (activeTab === 'Refill') {
        return !med.isArchived && isLowStock;
      }
      // Active
      return !med.isArchived && !isLowStock;
    });
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Critical': return { bg: 'rgba(239, 68, 68, 0.08)', text: '#EF4444' };
      case 'Supplement': return { bg: 'rgba(16, 185, 129, 0.08)', text: '#10B981' };
      default: return { bg: 'rgba(4, 99, 221, 0.08)', text: '#0463DD' }; // Maintenance
    }
  };

  const filteredMeds = getFilteredMeds();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Medications</Text>
            <Text style={styles.headerSubtitle}>Prescriptions for {patientName}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addIconBtn}
            onPress={() => navigation.navigate('SearchDrug')}
          >
            <Feather name="plus" size={22} color="#0463DD" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {(['Active', 'Refill', 'Archived'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Prescription List */}
          <View style={styles.medList}>
            {filteredMeds.length > 0 ? (
              filteredMeds.map((med) => {
                const priority = med.priority || 'Maintenance';
                const pColors = getPriorityColor(priority);
                const strength = med.dosage || '500mg';
                const stock = med.stock ? parseInt(med.stock) : 24;
                const daysLeft = med.daysLeft || Math.ceil(stock / 2);

                return (
                  <TouchableOpacity
                    key={med.id}
                    style={styles.medCard}
                    onPress={() => navigation.navigate('MedicationDetails', { medId: med.id })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.medIconGroup}>
                        <View style={styles.pillIconBg}>
                          <MiniPillVector 
                            formFactor={med.formFactor || 'Tablet'} 
                            pillColor={med.pillColor || '#3B82F6'} 
                          />
                        </View>
                        <View>
                          <Text style={styles.medName}>{med.name}</Text>
                          {med.brand && <Text style={styles.brandName}>{med.brand}</Text>}
                        </View>
                      </View>
                      <View style={[styles.priorityBadge, { backgroundColor: pColors.bg }]}>
                        <Text style={[styles.priorityText, { color: pColors.text }]}>
                          {priority}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.cardDetails}>
                      <View style={styles.detailRow}>
                        <Feather name="clock" size={13} color="rgba(4,9,33,0.4)" />
                        <Text style={styles.detailText}>
                          {strength} • {med.time || 'As Needed'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Feather name="archive" size={13} color="rgba(4,9,33,0.4)" />
                        <Text style={[
                          styles.detailText, 
                          daysLeft < 5 && styles.stockWarningText
                        ]}>
                          Stock Left: {stock} pills ({daysLeft} days remaining)
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="folder" size={48} color="rgba(4,9,33,0.2)" />
                <Text style={styles.emptyText}>No {activeTab.toLowerCase()} prescriptions.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <BottomNav activeTab="Meds" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 393,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 20,
    width: '100%',
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
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  headerSubtitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#0463DD',
    marginTop: -2,
  },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
    width: '100%',
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.04)',
  },
  tabActive: {
    backgroundColor: '#0463DD',
    borderColor: '#0463DD',
  },
  tabText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.5)',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    alignItems: 'center',
  },
  medList: {
    width: '100%',
    maxWidth: 361,
    gap: 12,
    marginBottom: 24,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  pillIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillEmoji: {
    fontSize: 20,
  },
  medName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
  },
  brandName: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -2,
  },
  priorityBadge: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  priorityText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(4,9,33,0.06)',
    marginVertical: 12,
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(4,9,33,0.5)',
  },
  stockWarningText: {
    color: '#EF4444',
    fontFamily: 'Baloo2_700Bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.4)',
  },
  primaryButton: {
    backgroundColor: '#0463DD',
    width: '100%',
    maxWidth: 361,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
