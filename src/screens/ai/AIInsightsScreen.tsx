import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Mock adherence data points for a simple visual graph
const CHART_DATA = [86, 78, 92, 68, 88, 95, 82, 76, 90, 85, 72, 91, 88, 86];

export default function AIInsightsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const maxVal = Math.max(...CHART_DATA);
  const chartHeight = 100;

  const handleExport = () => {
    Alert.alert(
      'PDF Generated',
      "PDF Report generated: 'Grandpa_Kunle_Adherence.pdf' downloaded.",
      [{ text: 'Done', style: 'default' }]
    );
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Insights</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Insights Query Input */}
        <View style={styles.searchBox}>
          <Ionicons name="sparkles" size={20} color="#0463DD" />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask about Grandpa's health..."
            placeholderTextColor="rgba(4,9,33,0.3)"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleSearch}>
              <Feather name="send" size={20} color="#0463DD" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Query Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {[
            "14-day adherence?",
            "Missed doses this week?",
            "Temperature trends?",
          ].map(q => (
            <TouchableOpacity key={q} style={styles.chip} onPress={() => setQuery(q)}>
              <Text style={styles.chipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Adherence Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>14-DAY AVERAGE</Text>
              <Text style={styles.summaryValue}>85%</Text>
            </View>
            <View style={styles.trendBadge}>
              <Feather name="trending-up" size={16} color="#10B981" />
              <Text style={styles.trendText}>+3% vs last week</Text>
            </View>
          </View>
        </View>

        {/* Adherence Trend Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Adherence Trend (14 Days)</Text>
          <Text style={styles.cardSubtitle}>Each bar = one day of logged medications</Text>

          <View style={styles.chart}>
            {CHART_DATA.map((value, index) => {
              const barH = (value / maxVal) * chartHeight;
              const isMissed = value < 80;
              return (
                <View key={index} style={styles.chartBarWrapper}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: barH,
                        backgroundColor: isMissed ? '#EF4444' : '#0463DD',
                      },
                    ]}
                  />
                  <Text style={styles.chartDayLabel}>{index + 1}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#0463DD' }]} />
              <Text style={styles.legendText}>On track ≥80%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Below target</Text>
            </View>
          </View>
        </View>

        {/* AI Correlation Insight Card */}
        <View style={styles.correlationCard}>
          <View style={styles.correlationHeader}>
            <Feather name="alert-circle" size={20} color="#D97706" />
            <Text style={styles.correlationTitle}>AI Correlation Insight</Text>
          </View>
          <Text style={styles.correlationText}>
            ⚠️ Temperature spikes on Day 4 and Day 9 correlate with missed morning doses at{' '}
            <Text style={styles.boldText}>8:00 AM.</Text> Recommend reviewing morning routine with caregiver.
          </Text>
        </View>

        {/* Breakdown Rows */}
        <View style={styles.breakdownCard}>
          <Text style={styles.cardTitle}>Quick Summary</Text>
          {[
            { label: 'Total doses logged', value: '28 of 30', color: '#10B981' },
            { label: 'Doses missed', value: '2 doses', color: '#EF4444' },
            { label: 'Most consistent time', value: '1:00 PM', color: '#0463DD' },
            { label: 'Longest streak', value: '7 days', color: '#8B5CF6' },
          ].map((item, i) => (
            <View key={i} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={[styles.breakdownValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Export PDF Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport} activeOpacity={0.8}>
          <Feather name="download" size={20} color="#FFFFFF" />
          <Text style={styles.exportBtnText}>Export Adherence Report (PDF)</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
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
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#0F172A',
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.6)',
  },
  summaryCard: {
    backgroundColor: '#0463DD',
    borderRadius: 20,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 36,
    color: '#FFFFFF',
    lineHeight: 40,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  trendText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#10B981',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
  },
  cardSubtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 120,
    paddingTop: 16,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 6,
  },
  chartDayLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 9,
    color: 'rgba(4,9,33,0.3)',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 11,
    color: 'rgba(4,9,33,0.5)',
  },
  correlationCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  correlationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  correlationTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#92400E',
  },
  correlationText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
  boldText: {
    fontFamily: 'Baloo2_700Bold',
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  breakdownLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
  },
  breakdownValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0F172A',
    borderRadius: 30,
    height: 56,
    width: '100%',
  },
  exportBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
