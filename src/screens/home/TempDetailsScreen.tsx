import React, { useState, useEffect, useRef } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';

const { width } = Dimensions.get('window');

export default function TempDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medications } = useMedication();
  
  const [activeInterval, setActiveInterval] = useState('7d');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for the "Live" indicator and REC dot
  useEffect(() => {
    // Pulse animation for probe
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fast blinking for REC dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(recAnim, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(recAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const intervals = ['7d', '30d', '90d'];
  
  const trendData: Record<string, { label: string; value: number }[]> = {
    '7d': [
      { label: 'Mon', value: 36.6 },
      { label: 'Tue', value: 36.8 },
      { label: 'Wed', value: 37.2 },
      { label: 'Thu', value: 36.9 },
      { label: 'Fri', value: 36.7 },
      { label: 'Sat', value: 36.8 },
      { label: 'Sun', value: 36.8 },
    ],
    '30d': [
      { label: 'W1', value: 36.8 },
      { label: 'W2', value: 37.1 },
      { label: 'W3', value: 36.8 },
      { label: 'W4', value: 36.7 },
    ],
    '90d': [
      { label: 'Jan', value: 36.9 },
      { label: 'Feb', value: 36.7 },
      { label: 'Mar', value: 36.8 },
    ],
  };

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
      snapshot: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: '3',
      name: 'Atorvastatin',
      status: 'Missed',
      time: '08:00 PM',
      date: 'Yesterday',
    },
    {
      id: '4',
      name: 'Metformin',
      status: 'Taken',
      time: '08:05 AM',
      date: 'Yesterday',
      snapshot: 'https://images.unsplash.com/photo-1588674593465-983637e754ef?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vitals & Health</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Real-Time Vitals HUD */}
        <LinearGradient
          colors={['#0463DD', '#0352B8']}
          style={styles.vitalsHud}
        >
          <View style={styles.hudHeader}>
            <View style={styles.probeStatus}>
              <Ionicons name="bluetooth" size={14} color="#FFFFFF" />
              <Text style={styles.probeStatusWhite}>PROBE CONNECTED</Text>
            </View>
            <View style={styles.probeStatus}>
              <Ionicons name="battery-full" size={14} color="#FFFFFF" />
              <Text style={styles.probeStatusWhite}>98%</Text>
            </View>
          </View>

          <View style={styles.hudOverlay}>
            <View style={styles.liveIndicatorRow}>
              <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.liveText}>REAL-TIME</Text>
            </View>
            <View style={styles.tempRow}>
              <Text style={styles.tempLarge}>36.8</Text>
              <Text style={styles.tempUnit}>°C</Text>
            </View>
            <Text style={styles.hudStatusWhite}>Normal Body Temperature</Text>
          </View>
          <View style={styles.vitalsFooter}>
            <View style={styles.vitalsStat}>
              <Text style={styles.vitalsStatLabel}>Today High</Text>
              <Text style={styles.vitalsStatValue}>37.2°C</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.vitalsStat}>
              <Text style={styles.vitalsStatLabel}>Today Low</Text>
              <Text style={styles.vitalsStatValue}>36.5°C</Text>
            </View>
          </View>
        </LinearGradient>

        {/* History Logs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>History Logs</Text>
            <View style={styles.intervalPicker}>
              {intervals.map((int) => (
                <TouchableOpacity
                  key={int}
                  onPress={() => setActiveInterval(int)}
                  style={[styles.intervalBtn, activeInterval === int && styles.intervalBtnActive]}
                >
                  <Text style={[styles.intervalText, activeInterval === int && styles.intervalTextActive]}>
                    {int}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chartContainer}>
            {/* Chart Reference Lines */}
            <View style={styles.refLines}>
               <View style={[styles.refLine, { bottom: '75%' }]}>
                 <Text style={styles.refLabel}>37.5° FEVER</Text>
               </View>
               <View style={[styles.refLine, { bottom: '25%' }]}>
                 <Text style={styles.refLabel}>36.5° BASE</Text>
               </View>
            </View>

            <View style={styles.chartBars}>
              {trendData[activeInterval].map((item, index) => (
                <View key={index} style={styles.barItem}>
                   <View style={styles.barTrack}>
                     <View style={[styles.barFill, { 
                       height: `${((item.value - 36) / 2) * 100}%`,
                       backgroundColor: item.value > 37.2 ? '#EF4444' : '#10B981'
                     }]} />
                   </View>
                   <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Medication History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication History</Text>
          <Text style={styles.sectionSubtitle}>Visual verification from unit camera</Text>
          
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

                {log.snapshot && (
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
  vitalsHud: {
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 32,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  probeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  probeStatusWhite: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  hudOverlay: {
    padding: 32,
    alignItems: 'center',
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  tempLarge: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 72,
    color: '#FFFFFF',
  },
  tempUnit: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  hudStatusWhite: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: -8,
  },
  vitalsFooter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  vitalsStat: {
    flex: 1,
    alignItems: 'center',
  },
  vitalsStatLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  vitalsStatValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    fontSize: 22,
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#64748B',
    marginTop: -12,
    marginBottom: 24,
  },
  intervalPicker: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 12,
  },
  intervalBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  intervalBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  intervalText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: '#64748B',
  },
  intervalTextActive: {
    color: '#0F172A',
  },
  chartContainer: {
    height: 180,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  refLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  refLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  refLabel: {
    position: 'absolute',
    right: 0,
    fontFamily: 'Baloo2_700Bold',
    fontSize: 8,
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    paddingLeft: 4,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barItem: {
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    width: 12,
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  logsList: {
    gap: 16,
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
});
