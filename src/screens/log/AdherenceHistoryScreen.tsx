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
import CustomAlertModal from '../../components/medications/CustomAlertModal';

export default function AdherenceHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [alertVisible, setAlertVisible] = useState(false);

  // Month of June 2026 (30 Days)
  // Grid layout helper
  const renderCalendarCells = () => {
    const cells = [];
    // June 1, 2026 starts on Monday. So no empty offset cells needed if we start on Monday!
    // Days 1-10: Taken (Solid Black)
    // Days 11-12: Taken (Solid Black)
    // Day 13: Missed (Outlined)
    // Days 14-30: Future (Light gray)
    for (let day = 1; day <= 30; day++) {
      let state: 'taken' | 'missed' | 'future' = 'future';
      if (day <= 12) {
        state = 'taken';
      } else if (day === 13) {
        state = 'missed';
      }

      cells.push(
        <View 
          key={day} 
          style={[
            styles.calendarCell,
            state === 'taken' && styles.cellTaken,
            state === 'missed' && styles.cellMissed,
            state === 'future' && styles.cellFuture,
          ]}
        >
          <Text 
            style={[
              styles.cellText,
              state === 'taken' && styles.cellTextTaken,
              state === 'missed' && styles.cellTextMissed,
              state === 'future' && styles.cellTextFuture,
            ]}
          >
            {day}
          </Text>
        </View>
      );
    }
    return cells;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adherence Logbook</Text>
          <View style={styles.navPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Adherence Rate Box */}
          <View style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <View>
                <Text style={styles.rateLabel}>MONTHLY ADHERENCE</Text>
                <Text style={styles.rateValue}>94%</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 14 Days Streak</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.rateDesc}>
              Grandpa Kunle is maintaining an excellent adherence pattern this month. Clinical target is 90%+.
            </Text>
          </View>

          {/* Monthly Heatmap Grid */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>June 2026</Text>
              <Feather name="chevron-down" size={16} color="rgba(4,9,33,0.4)" />
            </View>

            {/* Weekdays Label Header */}
            <View style={styles.weekdaysRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <Text key={idx} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>

            {/* Grid Cells */}
            <View style={styles.gridContainer}>
              {renderCalendarCells()}
            </View>

            {/* Legend Key */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, styles.cellTaken]} />
                <Text style={styles.legendLabel}>Taken</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, styles.cellMissed]} />
                <Text style={styles.legendLabel}>Missed</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, styles.cellFuture]} />
                <Text style={styles.legendLabel}>Future</Text>
              </View>
            </View>
          </View>

          {/* Export PDF Primary CTA */}
          <TouchableOpacity 
            style={styles.exportBtn}
            onPress={() => setAlertVisible(true)}
            activeOpacity={0.9}
          >
            <Feather name="download" size={20} color="#FFFFFF" />
            <Text style={styles.exportBtnText}>Export Monthly PDF Report</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <CustomAlertModal
        isVisible={alertVisible}
        title="PDF Export Success"
        message="PDF export complete. Downloaded to local files."
        onConfirm={() => setAlertVisible(false)}
        confirmText="Done"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    maxWidth: 393,
    width: '100%',
    alignSelf: 'center',
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
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 20,
  },
  rateCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 20,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
    textTransform: 'uppercase',
  },
  rateValue: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 36,
    color: '#0F172A',
    lineHeight: 40,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  streakText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#F97316',
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(4,9,33,0.05)',
    marginVertical: 14,
  },
  rateDesc: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(4,9,33,0.6)',
    lineHeight: 18,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.3)',
    width: 36,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    rowGap: 8,
  },
  calendarCell: {
    width: (393 - 32 - 40 - 48) / 7, // Dynamic width for fitting screen
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellTaken: {
    backgroundColor: '#0F172A',
  },
  cellMissed: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  cellFuture: {
    backgroundColor: '#F1F5F9',
  },
  cellText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
  },
  cellTextTaken: {
    color: '#FFFFFF',
  },
  cellTextMissed: {
    color: '#EF4444',
  },
  cellTextFuture: {
    color: '#94A3B8',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIndicator: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  exportBtn: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  exportBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
