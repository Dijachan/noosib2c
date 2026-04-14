import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomNav from '../../components/navigation/BottomNav';
import { useMedication } from '../../context/MedicationContext';

const { width } = Dimensions.get('window');

// Health Insight Card Component
const InsightCard = ({
  title,
  value,
  unit,
  icon,
  color,
  status,
  onPress
}: {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  status: string;
  onPress?: () => void;
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer 
      style={[styles.insightCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.insightHeader}>
        <View style={styles.insightIconContainer}>
          <Ionicons name={icon as any} size={22} color="#0F172A" />
        </View>
        <Text style={styles.insightStatus}>{status.toUpperCase()}</Text>
      </View>
      <View style={styles.insightBody}>
        <Text style={styles.insightCardTitle}>{title}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.insightValue}>{value}</Text>
          <Text style={styles.insightUnit}>{unit}</Text>
        </View>
      </View>
    </CardContainer>
  );
};

// Medication Card Component
const MedicationCard = ({ 
  id,
  index,
  title,
  quantity,
  date, 
  time,
  slot,
  status,
  onPress 
}: { 
  id: string;
  index: number; 
  title: string; 
  quantity: string;
  date: string; 
  time: string;
  slot: string;
  status: 'Taken' | 'Pending';
  onPress: (id: string) => void;
}) => {
  return (
    <TouchableOpacity 
      style={[styles.medCard, status === 'Pending' && styles.medCardActive]}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <View style={[styles.medIndexContainer, status === 'Taken' ? styles.medIndexTaken : styles.medIndexPending]}>
        <Text style={[styles.medIndex, status === 'Taken' ? styles.medIndexTextTaken : styles.medIndexTextPending]}>
          {status === 'Taken' ? <Ionicons name="checkmark" size={18} color="#10B981" /> : index}
        </Text>
      </View>
      <View style={styles.medContent}>
        <View style={styles.medTitleRow}>
          <Text style={styles.medTitle}>{title}</Text>
          <Text style={styles.medQuantity}> • {quantity}</Text>
        </View>
        <View style={styles.medMetaRows}>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color="#0463DD" />
            <Text style={styles.metaText}>{time} • {date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="cube-outline" size={14} color="#6366F1" />
            <Text style={styles.metaText}>Slot {slot}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.statusBadge, status === 'Taken' ? styles.statusBadgeTaken : styles.statusBadgePending]}>
        <Text style={[styles.statusBadgeText, status === 'Taken' ? styles.statusBadgeTextTaken : styles.statusBadgeTextPending]}>
          {status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { medications } = useMedication();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 24, paddingTop: 20, marginBottom: 24 }}>
            <View>
              <Text style={styles.greetingText}>Good morning, Dija! 🌱</Text>
              <View style={styles.monitoringBadge}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&q=80&w=100' }}
                  style={styles.patientAvatar}
                />
                <Text style={styles.monitoringText}>Caring for Mummy K ❤️</Text>
              </View>
            </View>
          </View>
          {/* Profile btn removed per request */}

          {/* Health Insights Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Insights</Text>
          </View>

          <View style={styles.insightGrid}>
            <InsightCard
              title="Meds Adherence"
              value="98"
              unit="%"
              icon="checkmark-circle-outline"
              color="#F5F3FF" // Pastel Purple
              status="Optimal"
              onPress={() => navigation.navigate('AdherenceDetails')}
            />
            <InsightCard
              title="Body Temp"
              value="36.8"
              unit="°C"
              icon="thermometer-outline"
              color="#EBF5FF" // Pastel Blue
              status="Normal"
              onPress={() => navigation.navigate('TempDetails')}
            />
          </View>

          {/* Alerts Summary Card */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alert Summary</Text>
          </View>
          <TouchableOpacity style={styles.alertsBanner}>
            <View style={styles.alertsLeft}>
              <View style={styles.alertIconContainer}>
                <Ionicons name="alert-circle-outline" size={26} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.alertCountText}>2 Critical Alerts</Text>
                <Text style={styles.alertSubText}>Requires immediate attention</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(239, 68, 68, 0.4)" />
          </TouchableOpacity>

          {/* Care Schedule Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Care Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medList}>
            {medications.length > 0 ? medications.map((med, idx) => (
              <MedicationCard
                key={med.id}
                id={med.id}
                index={idx + 1}
                title={med.name}
                quantity={med.dosage}
                date={med.date}
                time={med.time}
                slot={med.slot.toString()}
                status={med.status === 'Taken' ? 'Taken' : 'Pending'}
                onPress={(id) => navigation.navigate('MedicationDetails', { medId: id })}
              />
            )) : (
              <View style={styles.emptySchedule}>
                <Text style={styles.emptyScheduleText}>No medications scheduled for today.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background from Figma
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  greetingText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: '#0F172A',
  },
  monitoringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 10,
    elevation: 0,
  },
  patientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(4, 99, 221, 0.1)',
  },
  monitoringText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD', // Noosi Blue as requested
    marginRight: 4,
  },
  profileBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 0,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  seeAllText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4, 9, 33, 0.4)',
  },
  insightGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  insightCard: {
    flex: 1,
    height: 160,
    borderRadius: 32,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(4, 99, 221, 0.08)',
    elevation: 0,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  insightCardTitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: 'rgba(15, 23, 42, 0.5)',
    marginBottom: 4,
  },
  insightIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBody: {
    gap: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  insightValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: '#0F172A',
  },
  insightUnit: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
    opacity: 0.5,
  },
  insightStatus: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    letterSpacing: 0.5,
  },
  insightPattern: {
    // This was removed as we are going for a cleaner medical look
  },
  medList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    elevation: 0,
  },
  medIndexContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medIndex: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#6B4EFF',
  },
  medContent: {
    flex: 1,
    marginLeft: 16,
  },
  medTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  medQuantity: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: 'rgba(15, 23, 42, 0.5)',
  },
  medMetaRows: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(15, 23, 42, 0.7)',
  },
  medAction: {
    padding: 8,
  },
  navFabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navFab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0463DD',
    marginTop: -25, // Extrude out of the nav bar
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'visible', // Allow FAB to extrude
  },
  bottomNav: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
  },
  navText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(15, 23, 42, 0.4)',
  },
  navTextActive: {
    color: '#0463DD',
  },
  dateText: {
    // Obsolete
  },
  alertsBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
    elevation: 0,
    marginBottom: 32,
  },
  alertsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCountText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#EF4444',
  },
  alertSubText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(239, 68, 68, 0.7)',
  },
  medCardActive: {
    borderWidth: 2,
    borderColor: 'rgba(4, 99, 221, 0.2)',
  },
  medIndexTaken: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  medIndexPending: {
    backgroundColor: 'rgba(4, 99, 221, 0.1)',
  },
  medIndexTextTaken: {
    color: '#059669',
  },
  medIndexTextPending: {
    color: '#0463DD',
  },
  medSubtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(15, 23, 42, 0.6)',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeTaken: {
    backgroundColor: 'rgba(5, 150, 105, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.1)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(4, 99, 221, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.1)',
  },
  statusBadgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadgeTextTaken: {
    color: '#059669', // Emerald Green
  },
  statusBadgeTextPending: {
    color: '#0463DD', // Noosi Blue
  },
  emptySchedule: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  emptyScheduleText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
});
