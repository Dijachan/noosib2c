import React from 'react';
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
import { useMedication } from '../../context/MedicationContext';

const { width } = Dimensions.get('window');

// Redesigned Tray Slot Component
const TraySlotBox = ({ 
  id, 
  status, 
  medName, 
  time, 
  onPress
}: { 
  id: number; 
  status: 'Empty' | 'Occupied' | 'Missed' | 'Next'; 
  medName?: string;
  time?: string;
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
            <Text style={styles.slotTime}>{time}</Text>
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
  const { getSlotStatus, getMedicationBySlot } = useMedication();

  const handleSlotPress = (slotId: number) => {
    const status = getSlotStatus(slotId);
    if (status === 'Empty') {
      navigation.navigate('SearchDrug', { slot: slotId });
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
                <Text style={styles.heroSubtitle}>She's on track with 4 doses today!</Text>
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressLeft}>
                <Text style={styles.progressCount}>10/14</Text>
                <Text style={styles.progressLabel}>Filled Slots</Text>
              </View>
              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '70%' }]} />
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
                  onPress={() => handleSlotPress(slotId)}
                />
              );
            })}
          </View>

          {/* Recent Activity Timeline */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.timeline}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Afternoon dose taken</Text>
                <Text style={styles.activityMeta}>Slot 2 • 1:05 PM Today</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
               <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
               <View style={styles.activityContent}>
                 <Text style={styles.activityTitle}>Morning dose taken</Text>
                 <Text style={styles.activityMeta}>Slot 1 • 8:42 AM Today</Text>
               </View>
            </View>
            <View style={styles.activityItem}>
               <View style={[styles.activityDot, { backgroundColor: '#EF4444' }]} />
               <View style={styles.activityContent}>
                 <Text style={styles.activityTitle}>Missed Dose Alert</Text>
                 <Text style={styles.activityMeta}>Slot 4 • 12:00 PM Today</Text>
               </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeTab="Meds" />
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
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
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
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 2,
  },
  activityMeta: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: '#64748B',
  },
});
