import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';

const { width } = Dimensions.get('window');

export default function AdherenceDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medicationList } = useMedication();
  
  const recAnim = React.useRef(new Animated.Value(1)).current;

  // Blink animation for REC dot
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(recAnim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(recAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const medicineLogs = [
    {
      id: '1',
      name: 'Metformin',
      status: 'Taken',
      time: '08:02 AM',
      date: 'Today',
      snapshot: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '2',
      name: 'Lisinopril',
      status: 'Taken',
      time: '01:15 PM',
      date: 'Today',
      snapshot: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '3',
      name: 'Atorvastatin',
      status: 'Missed',
      time: '08:00 PM',
      date: 'Yesterday',
      snapshot: 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '4',
      name: 'Metformin',
      status: 'Taken',
      time: '08:05 AM',
      date: 'Yesterday',
      snapshot: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const totalDoses = medicationList.length;
  const takenDoses = 12; // Mock data for demo
  const missedDoses = 2; // Mock data for demo
  const pendingDoses = 4; // Mock data for demo
  const adherenceRate = 98; // Hardcoded per request for demonstration/consistency

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adherence Tracking</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="share-outline" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Total Adherence</Text>
              <Text style={styles.statsValue}>{adherenceRate}%</Text>
              <View style={styles.trendRow}>
                <Ionicons name="trending-up" size={16} color="#FFFFFF" />
                <Text style={styles.trendText}>+4% from last week</Text>
              </View>
            </View>
            <View style={styles.circleGraph}>
               {/* Simplified representation of a gauge */}
               <View style={styles.circleOuter}>
                  <View style={[styles.circleInner, { height: `${adherenceRate}%` }]} />
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" style={{ zIndex: 1 }} />
                </View>
            </View>
          </View>
        </View>



        {/* Status Breakdown Grid */}
        <View style={styles.detailsGrid}>
          <View style={[styles.detailItem, { backgroundColor: 'rgba(16, 185, 129, 0.05)' }]}>
             <Ionicons name="checkmark-circle" size={28} color="#10B981" />
             <Text style={styles.detailCount}>{takenDoses}</Text>
             <Text style={styles.detailLabel}>Taken</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: 'rgba(239, 68, 68, 0.05)' }]}>
             <Ionicons name="close-circle" size={28} color="#EF4444" />
             <Text style={styles.detailCount}>{missedDoses}</Text>
             <Text style={styles.detailLabel}>Missed</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: 'rgba(99, 102, 241, 0.05)' }]}>
             <Ionicons name="time" size={28} color="#6366F1" />
             <Text style={styles.detailCount}>{pendingDoses}</Text>
             <Text style={styles.detailLabel}>Pending</Text>
          </View>
        </View>

        {/* Caregiver Insights */}
        <View style={styles.insightBox}>
          <View style={styles.insightIconBg}>
            <Ionicons name="sparkles" size={20} color="#0463DD" />
          </View>
          <View style={styles.insightTextContainer}>
            <Text style={styles.insightTitle}>Noosi Insight</Text>
            <Text style={styles.insightText}>
              Mummy K is most consistent with her morning doses. Afternoon adherence shows a slight dip—consider setting a secondary reminder.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.exportBtn}>
            <View style={styles.exportInfo}>
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              <View>
                <Text style={styles.exportTitle}>Export to Doctor</Text>
                <Text style={styles.exportSub}>Share secure PDF report</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        </View>

        {/* Medication History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification History</Text>
          <Text style={styles.sectionSubtitle}>Visual proof from Smart Tray</Text>
          
          <View style={styles.logsList}>
            {medicineLogs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logInfoLeft}>
                    <View style={[styles.statusIndicator, { backgroundColor: log.status === 'Taken' ? '#10B981' : '#EF4444' }]} />
                    <View>
                      <Text style={styles.logMedName}>{log.name}</Text>
                      <Text style={styles.logTime}>{log.time} • {log.date}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: log.status === 'Taken' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                    <Text style={[styles.statusBadgeText, { color: log.status === 'Taken' ? '#10B981' : '#EF4444' }]}>
                      {log.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {log.snapshot && log.status !== 'Missed' && (
                  <View style={styles.snapshotContainer}>
                    <Image source={{ uri: log.snapshot }} style={styles.snapshotImage} />
                    <View style={styles.snapshotOverlay}>
                      <View style={styles.recContainer}>
                        <Animated.View style={[styles.recDot, { opacity: recAnim }]} />
                        <Text style={styles.recText}>[REC] MUMMY K CAM</Text>
                      </View>
                      <Text style={styles.timestampText}>{log.time} GMT</Text>
                    </View>
                  </View>
                )}

                {log.status === 'Missed' && (
                  <View style={styles.missedNotice}>
                    <Ionicons name="alert-circle" size={18} color="#EF4444" />
                    <Text style={styles.missedText}>No visual confirmation recorded.</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  statsCard: {
    backgroundColor: '#0463DD',
    borderRadius: 32,
    padding: 24,
    marginVertical: 20,
  },
  statsLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statsValue: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 44,
    color: '#FFFFFF',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  trendText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleGraph: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  circleInner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  circleText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    zIndex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  rangeSelector: {
    paddingBottom: 20,
    gap: 12,
  },
  rangeItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  rangeItemSelected: {
    backgroundColor: '#0463DD',
  },
  rangeText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#64748B',
  },
  rangeTextSelected: {
    color: '#FFFFFF',
  },
  seeMore: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD',
  },
  chartContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 24,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barItem: {
    alignItems: 'center',
    width: 30,
  },
  barTrack: {
    width: 12,
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  barFill: {
    width: 12,
    borderRadius: 6,
  },
  barDay: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  detailItem: {
    width: (width - 48 - 24) / 3,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    gap: 4,
  },
  detailCount: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#0F172A',
  },
  detailLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  insightBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  insightIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0463DD',
    marginBottom: 4,
  },
  insightText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  exportBtn: {
    backgroundColor: '#0F172A', // Dark professional color for secure actions
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exportTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  exportSub: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  logsList: {
    gap: 16,
    marginTop: 8,
  },
  logCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 0,
    paddingTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  logInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  logMedName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  logTime: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  snapshotContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  snapshotImage: {
    width: '100%',
    height: '100%',
  },
  snapshotOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  recContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  recText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timestampText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  missedNotice: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  missedText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#EF4444',
  },
  sectionSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
});
