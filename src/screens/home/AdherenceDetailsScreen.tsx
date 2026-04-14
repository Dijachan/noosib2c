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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';

const { width } = Dimensions.get('window');

export default function AdherenceDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medications } = useMedication();

  const totalDoses = medications.length;
  const takenDoses = medications.filter(m => m.status === 'Taken').length;
  const missedDoses = medications.filter(m => m.status === 'Missed').length;
  const pendingDoses = medications.filter(m => m.status === 'Pending').length;
  const adherenceRate = 98; // Hardcoded per request for demonstration/consistency
  const [timeRange, setTimeRange] = useState('Weekly');

  const ranges = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  const chartData: Record<string, { label: string; value: number }[]> = {
    Daily: [
      { label: '6am', value: 100 },
      { label: '9am', value: 95 },
      { label: '12pm', value: 80 },
      { label: '3pm', value: 90 },
      { label: '6pm', value: 98 },
      { label: '9pm', value: 100 },
    ],
    Weekly: [
      { label: 'Mon', value: 100 },
      { label: 'Tue', value: 85 },
      { label: 'Wed', value: 92 },
      { label: 'Thu', value: 100 },
      { label: 'Fri', value: 78 },
      { label: 'Sat', value: 94 },
      { label: 'Sun', value: 96 },
    ],
    Monthly: [
      { label: 'W1', value: 92 },
      { label: 'W2', value: 98 },
      { label: 'W3', value: 88 },
      { label: 'W4', value: 100 },
    ],
    Quarterly: [
      { label: 'Jan', value: 100 },
      { label: 'Feb', value: 92 },
      { label: 'Mar', value: 96 },
    ],
    Yearly: [
      { label: 'Q1', value: 96 },
      { label: 'Q2', value: 94 },
      { label: 'Q3', value: 98 },
      { label: 'Q4', value: 100 },
    ],
  };

  const currentData = chartData[timeRange];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
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

        {/* Weekly Trend Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{timeRange} Performance</Text>
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
              {currentData.map((item, index) => (
                <View key={index} style={styles.barItem}>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${item.value}%`, backgroundColor: item.value > 90 ? '#10B981' : '#6366F1' }]} />
                  </View>
                  <Text style={styles.barDay}>{item.label}</Text>
                </View>
              ))}
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
});
