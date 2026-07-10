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
const CHART_WIDTH = width - 48; // Padding from content
const CHART_HEIGHT = 180;

export default function TempDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medicationList } = useMedication();
  const { user, demoPatientId } = useAuth();
  
  const [timeRange, setTimeRange] = useState('Daily');
  const [currentTemp, setCurrentTemp] = useState(0);
  const [highTemp, setHighTemp] = useState(0);
  const [lowTemp, setLowTemp] = useState(100);
  const [realHistory, setRealHistory] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recAnim = useRef(new Animated.Value(1)).current;

  const simulateTemp = async () => {
    setIsSimulating(true);
    const newVal = (36 + Math.random() * 2).toFixed(1);
    
    // Push a fake log to Supabase as if the hardware sent it
    const { error } = await supabase
      .from('vital_logs')
      .insert({
        patient_id: demoPatientId,
        value: newVal,
        type: 'temperature',
        unit: '°C'
      });
    
    setTimeout(() => setIsSimulating(false), 800);
  };

  // Real-time vitals sync logic
  const fetchVitals = async () => {
    const { data, error } = await supabase
      .from('vital_logs')
      .select('*')
      .eq('patient_id', demoPatientId)
      .order('captured_at', { ascending: false })
      .limit(200);
    
    if (data && data.length > 0) {
      const converted = data.map((log: any) => ({
        id: log.id,
        label: new Date(log.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateText: new Date(log.captured_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }),
        value: Number(Number(log.value).toFixed(1)),
        rawDate: new Date(log.captured_at)
      }));
      setRealHistory(converted);
    }
  };

  useEffect(() => {
    fetchVitals();

    // 2. Subscribe to new logs
    const channelName = `details-vitals-${Math.random()}`; // Unique name
    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'vital_logs',
        filter: `patient_id=eq.${demoPatientId}`
      }, (payload) => {
        if (payload.event === 'INSERT') {
          const newVal = Number(payload.new.value);
          setRealHistory(prev => [{
            id: payload.new.id,
            label: new Date(payload.new.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateText: new Date(payload.new.captured_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }),
            value: Number(newVal.toFixed(1)),
            rawDate: new Date(payload.new.captured_at)
          }, ...prev.slice(0, 199)]);
        } else if (payload.event === 'UPDATE') {
          const newVal = Number(payload.new.value);
          setRealHistory(prev => prev.map(item => 
            item.id === payload.new.id 
              ? {
                  ...item,
                  value: Number(newVal.toFixed(1)),
                  label: new Date(payload.new.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  dateText: new Date(payload.new.captured_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }),
                  rawDate: new Date(payload.new.captured_at)
                } 
              : item
          ));
        } else if (payload.event === 'DELETE') {
          setRealHistory(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [demoPatientId]);

  // 3. Logic Calibration Engine: derive all HUD stats from the raw array truth
  useEffect(() => {
    if (realHistory.length > 0) {
      // With descending sort, the NEWEST is the FIRST item in the array
      setCurrentTemp(realHistory[0].value);

      // Today's High/Low Logic remains derived from full today's set
      const todayString = new Date().toDateString();
      const todayReadings = realHistory.filter(log => log.rawDate && log.rawDate.toDateString() === todayString);
      
      if (todayReadings.length > 0) {
        const values = todayReadings.map(r => r.value);
        setHighTemp(Math.max(...values));
        setLowTemp(Math.min(...values));
      } else {
        // Clinical safety: reset to 0 if no readings captured today
        setHighTemp(0);
        setLowTemp(0);
      }
    } else {
      setHighTemp(0);
      setLowTemp(0);
    }
  }, [realHistory]);

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

  const getCalendarWeekBounds = () => {
    const now = new Date();
    const day = now.getDay(); // 0-6 (Sun-Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
  };

  const toggleDay = (day: string) => {
    setCollapsedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  useEffect(() => {
    // Reset collapses when switching time ranges to avoid confusion
    setCollapsedDays({});
  }, [timeRange]);

  const ranges = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  const trendData: Record<string, { label: string; value: number }[]> = {
    Daily: Array.from({ length: 24 }, (_, i) => ({
      label: i === 0 ? '12am' : i === 12 ? '12pm' : `${i % 12}${i < 12 ? 'am' : 'pm'}`,
      value: 36.5 + Math.random() * 0.8 + (i > 10 && i < 18 ? 0.5 : 0),
    })),
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
      { label: 'Week 1', value: 36.8 },
      { label: 'Week 2', value: 37.1 },
      { label: 'Week 3', value: 36.8 },
      { label: 'Week 4', value: 36.7 },
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

  // 5. Data Processing Logic (Fixed Bucket Aggregation)
  const getAggregatedTrend = () => {
    // 5a. Define Static Buckets for each range
    const buckets: Record<string, { label: string; values: number[] }[]> = {
      Daily: Array.from({ length: 24 }, (_, i) => ({
        label: i === 0 ? '12am' : i === 12 ? '12pm' : `${i % 12}${i < 12 ? 'am' : 'pm'}`,
        values: []
      })),
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        label: day,
        values: []
      })),
      Monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(w => ({
        label: w,
        values: []
      })),
      Quarterly: [], // Will be filled dynamically below
      Yearly: ['Q1', 'Q2', 'Q3', 'Q4'].map(q => ({
        label: q,
        values: []
      })),
    };

    // Fill Quarterly Buckets with current quarter month names
    const now = new Date();
    const currentQ = Math.floor(now.getMonth() / 3);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 3; i++) {
        buckets.Quarterly.push({ label: months[currentQ * 3 + i], values: [] });
    }

    if (realHistory.length === 0) {
      return buckets[timeRange].map(b => ({ label: b.label, value: 0 }));
    }

    // 5b. Fill Buckets with Raw Data
    realHistory.forEach(log => {
      const date = log.rawDate || new Date();
      
      if (timeRange === 'Daily') {
        const today = new Date().toDateString();
        if (date.toDateString() === today) {
          const hour = date.getHours(); // 0-23
          buckets.Daily[hour].values.push(log.value);
        }
      } else if (timeRange === 'Weekly') {
        const { monday, sunday } = getCalendarWeekBounds();
        if (date >= monday && date <= sunday) {
          const dayIdx = (date.getDay() + 6) % 7; // Mon is 0, Sun is 6
          buckets.Weekly[dayIdx].values.push(log.value);
        }
      } else if (timeRange === 'Monthly') {
        // Strict Calendar Month (Current Month)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
           const weekIdx = Math.min(3, Math.floor((date.getDate() - 1) / 7));
           buckets.Monthly[weekIdx].values.push(log.value);
        }
      } else if (timeRange === 'Quarterly') {
        const now = new Date();
        const currentQ = Math.floor(now.getMonth() / 3);
        const logQ = Math.floor(date.getMonth() / 3);
        
        if (logQ === currentQ && date.getFullYear() === now.getFullYear()) {
          const monthIdxInQ = date.getMonth() % 3;
          buckets.Quarterly[monthIdxInQ].values.push(log.value);
        }
      } else if (timeRange === 'Yearly') {
        const now = new Date();
        if (date.getFullYear() === now.getFullYear()) {
          const qIdx = Math.floor(date.getMonth() / 3);
          buckets.Yearly[qIdx].values.push(log.value);
        }
      }
    });

    // 5c. Calculate Averages per Bucket
    return buckets[timeRange].map(b => ({
      label: b.label,
      value: b.values.length > 0 ? b.values.reduce((a, b) => a + b, 0) / b.values.length : 0
    }));
  };

  const chartData = getAggregatedTrend();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Body Temperature</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Real-Time Vitals HUD - Redesigned to Light Theme */}
        <View style={styles.vitalsHud}>
          <View style={styles.hudHeader}>
            <View style={styles.probeStatus}>
              <Ionicons name="cloud-done" size={14} color="#10B981" />
              <Text style={styles.probeStatusText}>NOOSI CONNECTED</Text>
            </View>
            <View style={styles.probeStatus}>
              <Ionicons name="battery-full" size={14} color="#06565F" />
              <Text style={styles.probeStatusText}>98%</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.hudOverlay}
            onLongPress={simulateTemp}
            delayLongPress={2000} // Require a 2s press to avoid accidental triggers
            activeOpacity={0.9}
          >
            <View style={styles.liveIndicatorRow}>
              <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }], backgroundColor: '#06565F' }]} />
              <Text style={styles.liveText}>{isSimulating ? 'SYNCING...' : 'REAL-TIME'}</Text>
            </View>
            <View style={styles.tempRow}>
              <Text style={styles.tempLarge}>{currentTemp.toFixed(1)}</Text>
              <Text style={styles.tempUnit}>°C</Text>
            </View>
            <Text style={[styles.hudStatus, { color: currentTemp > 38.5 ? '#FF6F61' : currentTemp > 37.5 ? '#F59E0B' : '#10B981' }]}>
              {currentTemp > 38.5 ? 'High Fever Alert!' : currentTemp > 37.5 ? 'Slight Fever Detected' : 'Normal Body Temperature'}
            </Text>
          </TouchableOpacity>
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
            <View>
              <Text style={styles.sectionTitle}>Temp History</Text>
              <Text style={styles.sectionSubtitle}>A quick look at how she's doing today</Text>
            </View>
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
            {(() => {
              const data = chartData;
              const isScrollable = data.length > 7;
              
              return (
                <ScrollView 
                  key={timeRange} // Force re-render to fix spacing bug on reverse clicks
                  horizontal={isScrollable}
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={[
                    styles.chartBars,
                    !isScrollable && { flexGrow: 1, justifyContent: 'space-between' }
                  ]}
                >
                  {data.map((item, index) => (
                    <View key={index} style={[styles.barItem, !isScrollable ? { flex: 1 } : { width: 44 }]}>
                      <Text style={styles.barValue}>{item.value.toFixed(1)}°</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, {
                          height: item.value === 0 ? '0%' : `${Math.min(100, Math.max(10, ((item.value - 35) / 4) * 100))}%`,
                          backgroundColor: item.value === 0 ? '#E2E8F0' : (item.value > 37.5 ? '#FF6F61' : '#06565F')
                        }]} />
                      </View>
                      <Text style={[styles.barLabel, { fontSize: 10 }]}>{item.label}</Text>
                    </View>
                  ))}
                </ScrollView>
              );
            })()}
          </View>
        </View>

        {/* Detailed History Log Section */}
        <View style={styles.section}>
          {(() => {
            const filteredLogs = realHistory.filter(log => {
              const date = log.rawDate || new Date();
              const diff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
              
              if (timeRange === 'Daily') return date.toDateString() === new Date().toDateString();
              
              if (timeRange === 'Weekly') {
                const { monday, sunday } = getCalendarWeekBounds();
                return date >= monday && date <= sunday;
              }
              
              if (timeRange === 'Monthly') return diff <= 30;
              return true;
            });

            // Dynamic Grouping logic
            const grouped: Record<string, any[]> = {};
            filteredLogs.forEach(log => {
              const date = log.rawDate || new Date();
              let label = '';
              
              if (timeRange === 'Daily') {
                const today = new Date();
                const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                label = `Today, ${dateStr}`;
              } else if (timeRange === 'Weekly') {
                label = date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                });
              } else if (timeRange === 'Monthly') {
                const dayOfMonth = date.getDate();
                const weekNum = Math.ceil(dayOfMonth / 7);
                label = `Week ${weekNum}`;
              } else if (timeRange === 'Quarterly') {
                label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              } else if (timeRange === 'Yearly') {
                const qIdx = Math.floor(date.getMonth() / 3) + 1;
                label = `Quarter ${qIdx}, ${date.getFullYear()}`;
              } else {
                label = date.toLocaleDateString('en-US', { year: 'numeric' });
              }
              
              if (!grouped[label]) grouped[label] = [];
              grouped[label].push(log);
            });

            const dayEntries = Object.entries(grouped);

            if (dayEntries.length === 0) {
              return (
                <View style={styles.emptyActivity}>
                  <View style={styles.emptyIconBg}>
                    <Ionicons name="thermometer-outline" size={32} color="#CBD5E1" />
                  </View>
                  <Text style={styles.emptyActivityText}>No readings yet</Text>
                  <Text style={styles.emptyActivitySubtext}>Vitals will appear here after sync</Text>
                </View>
              );
            }

            return dayEntries.map(([day, logs], dayIdx) => {
              const isCollapsed = collapsedDays[day];
              
              return (
                <View key={day} style={styles.daySection}>
                  <TouchableOpacity 
                    style={styles.dayHeaderRow} 
                    onPress={() => toggleDay(day)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.dayHeaderText}>{day}</Text>
                    <View style={styles.dayHeaderDivider} />
                    <Ionicons 
                      name={isCollapsed ? "chevron-down" : "chevron-up"} 
                      size={18} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                  
                  {!isCollapsed && (
                    <View style={styles.logsList}>
                      {logs.map((item, index) => (
                        <View key={index} style={styles.gridLogItem}>
                          <View style={[styles.logGridIndicator, { backgroundColor: item.value > 37.5 ? '#FF6F61' : '#10B981' }]} />
                          <Text style={styles.logGridValue}>{item.value.toFixed(1)}°</Text>
                          <Text style={styles.logGridTime}>{item.label}</Text>
                          <Text style={styles.logGridDate}>{item.dateText || 'Today'}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            });
          })()}
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
    color: '#06565F',
    letterSpacing: 0.5,
  },
  hudOverlay: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 0,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 12,
    color: '#06565F',
    letterSpacing: 1,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 12,
  },
  tempLarge: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 72,
    color: '#0F172A',
    lineHeight: 90,
  },
  tempUnit: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 28,
    color: '#06565F',
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
    backgroundColor: '#06565F',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  barItem: {
    alignItems: 'center',
    gap: 8,
  },
  barValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: '#06565F',
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  logsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridLogItem: {
    width: (Dimensions.get('window').width - 48 - 24) / 3, // 3 columns
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 4,
  },
  logGridIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  logGridValue: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 18,
    color: '#0F172A',
  },
  logGridTime: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  logGridDate: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 10,
    color: '#94A3B8',
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
    backgroundColor: '#FF6F61',
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
    color: '#FF6F61',
  },
  daySection: {
    marginBottom: 32,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dayHeaderText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayHeaderDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyActivityText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyActivitySubtext: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
