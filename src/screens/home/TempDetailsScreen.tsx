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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function TempDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medications } = useMedication();
  const { user } = useAuth();
  
  const [timeRange, setTimeRange] = useState('Weekly');
  const [currentTemp, setCurrentTemp] = useState(36.8);
  const [highTemp, setHighTemp] = useState(37.2);
  const [lowTemp, setLowTemp] = useState(36.5);
  const [realHistory, setRealHistory] = useState<{ label: string; value: number }[]>([]);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recAnim = useRef(new Animated.Value(1)).current;

  // Real-time vitals sync
  useEffect(() => {
    if (!user) return;

    // 1. Fetch initial latest readings
    const fetchVitals = async () => {
      const { data, error } = await supabase
        .from('vital_logs')
        .select('*')
        .order('captured_at', { ascending: false })
        .limit(10);
      
      if (data && data.length > 0) {
        setCurrentTemp(Number(data[0].value));
        // Simple mock trend from latest 5-10 logs for now
        const converted = data.reverse().map((log: any) => ({
          label: new Date(log.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: Number(log.value)
        }));
        setRealHistory(converted);
      }
    };

    fetchVitals();

    // 2. Subscribe to new logs
    const subscription = supabase
      .channel('live-vitals')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'vital_logs' 
      }, (payload) => {
        const newVal = Number(payload.new.value);
        setCurrentTemp(newVal);
        if (newVal > highTemp) setHighTemp(newVal);
        if (newVal < lowTemp) setLowTemp(newVal);
        
        setRealHistory(prev => [...prev.slice(-9), {
          label: new Date(payload.new.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: newVal
        }]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

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

  const ranges = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  
  const trendData: Record<string, { label: string; value: number }[]> = {
    Daily: [
      { label: '6am', value: 36.6 },
      { label: '10am', value: 36.8 },
      { label: '2pm', value: 37.2 },
      { label: '6pm', value: 36.9 },
      { label: '10pm', value: 36.7 },
    ],
    Weekly: [
      { label: 'Mon', value: 36.6 },
      { label: 'Tue', value: 36.8 },
      { label: 'Wed', value: 37.2 },
      { label: 'Thu', value: 36.9 },
      { label: 'Fri', value: 36.7 },
      { label: 'Sat', value: 36.8 },
      { label: 'Sun', value: 36.8 },
    ],
    Monthly: [
      { label: 'W1', value: 36.8 },
      { label: 'W2', value: 37.1 },
      { label: 'W3', value: 36.8 },
      { label: 'W4', value: 36.7 },
    ],
    Quarterly: [
      { label: 'Jan', value: 36.9 },
      { label: 'Feb', value: 36.7 },
      { label: 'Mar', value: 36.8 },
    ],
    Yearly: [
      { label: 'Q1', value: 36.8 },
      { label: 'Q2', value: 37.0 },
      { label: 'Q3', value: 36.7 },
      { label: 'Q4', value: 36.9 },
    ],
  };

  const medicineLogs = [
    {
      id: '1',
      name: 'Metformin',
      status: 'Taken',
      time: '08:02 AM',
      date: 'Today',
      snapshot: 'file:///Users/mac/.gemini/antigravity/brain/47238e4b-79a1-45b7-9f28-1f37f71562f1/metformin_white_tablet_1776167059083.png',
    },
    {
      id: '2',
      name: 'Lisinopril',
      status: 'Taken',
      time: '01:15 PM',
      date: 'Today',
      snapshot: 'file:///Users/mac/.gemini/antigravity/brain/47238e4b-79a1-45b7-9f28-1f37f71562f1/lisinopril_pills_clinical_1776167073050.png',
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
      snapshot: 'file:///Users/mac/.gemini/antigravity/brain/47238e4b-79a1-45b7-9f28-1f37f71562f1/metformin_white_tablet_1776167059083.png',
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
        {/* Real-Time Vitals HUD - Redesigned to Light Theme */}
        <View style={styles.vitalsHud}>
          <View style={styles.hudHeader}>
            <View style={styles.probeStatus}>
              <Ionicons name="bluetooth" size={14} color="#0463DD" />
              <Text style={styles.probeStatusText}>PROBE CONNECTED</Text>
            </View>
            <View style={styles.probeStatus}>
              <Ionicons name="battery-full" size={14} color="#0463DD" />
              <Text style={styles.probeStatusText}>98%</Text>
            </View>
          </View>

          <View style={styles.hudOverlay}>
            <View style={styles.liveIndicatorRow}>
              <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }], backgroundColor: '#0463DD' }]} />
              <Text style={styles.liveText}>REAL-TIME</Text>
            </View>
            <View style={styles.tempRow}>
              <Text style={styles.tempLarge}>{currentTemp.toFixed(1)}</Text>
              <Text style={styles.tempUnit}>°C</Text>
            </View>
            <Text style={styles.hudStatus}>
              {currentTemp > 37.5 ? 'Slight Fever Detected' : 'Normal Body Temperature'}
            </Text>
          </View>
          <View style={styles.vitalsFooter}>
            <View style={styles.vitalsStat}>
              <Text style={styles.vitalsStatLabel}>Today High</Text>
              <Text style={styles.vitalsStatValue}>{highTemp.toFixed(1)}°C</Text>
            </View>
            <View style={styles.vitalsStatDivider} />
            <View style={styles.vitalsStat}>
              <Text style={styles.vitalsStatLabel}>Today Low</Text>
              <Text style={styles.vitalsStatValue}>{lowTemp.toFixed(1)}°C</Text>
            </View>
          </View>
        </View>

        {/* History Logs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>History Logs</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.rangeSelector}
          >
            {ranges.map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setTimeRange(range)}
                style={[styles.rangeItem, timeRange === range && styles.rangeItemSelected]}
              >
                <Text style={[styles.rangeText, timeRange === range && styles.rangeTextSelected]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {(realHistory.length > 0 ? realHistory : trendData[timeRange]).map((item, index) => (
                <View key={index} style={styles.barItem}>
                   <View style={styles.barTrack}>
                     <View style={[styles.barFill, { 
                       height: `${Math.min(100, Math.max(10, ((item.value - 35) / 4) * 100))}%`,
                       backgroundColor: item.value > 37.2 ? '#EF4444' : '#0463DD'
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
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 2,
      },
    }),
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
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  probeStatusText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: '#0463DD',
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
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 12,
    color: '#0463DD',
    letterSpacing: 1,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  tempLarge: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 72,
    color: '#0F172A',
    lineHeight: 80,
  },
  tempUnit: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 28,
    color: '#0463DD',
  },
  hudStatus: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#10B981',
    marginTop: -8,
  },
  vitalsFooter: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  vitalsStat: {
    flex: 1,
    alignItems: 'center',
  },
  vitalsStatLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  vitalsStatValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  vitalsStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
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
    marginTop: 4,
    marginBottom: 24,
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
