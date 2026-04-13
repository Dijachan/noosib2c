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
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

// Health Insight Card Component
const InsightCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  status 
}: { 
  title: string; 
  value: string; 
  unit: string; 
  icon: string; 
  color: string;
  status: string;
}) => {
  return (
    <View style={[styles.insightCard, { backgroundColor: color }]}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightTitle}>{title}</Text>
        <View style={styles.insightIconContainer}>
          <Feather name={icon as any} size={20} color="rgba(4, 9, 33, 0.4)" />
        </View>
      </View>
      <View style={styles.insightBody}>
        <View style={styles.valueRow}>
          <Text style={styles.insightValue}>{value}</Text>
          <Text style={styles.insightUnit}>{unit}</Text>
        </View>
        <Text style={styles.insightStatus}>{status}</Text>
      </View>
      {/* Subtle Background Pattern Mock */}
      <View style={styles.insightPattern}>
        <Feather name="activity" size={80} color="rgba(255, 255, 255, 0.2)" />
      </View>
    </View>
  );
};

// Medication Card Component
const MedicationCard = ({ 
  index,
  title,
  subtitle,
  dispenser,
  caregiver,
  date, 
  time,
  status 
}: { 
  index: number; 
  title: string; 
  subtitle: string;
  dispenser: string; 
  caregiver: string; 
  date: string; 
  time: string;
  status: 'Taken' | 'Pending';
}) => {
  return (
    <View style={[styles.medCard, status === 'Pending' && styles.medCardActive]}>
      <View style={[styles.medIndexContainer, status === 'Taken' ? styles.medIndexTaken : styles.medIndexPending]}>
        <Text style={[styles.medIndex, status === 'Taken' ? styles.medIndexTextTaken : styles.medIndexTextPending]}>
          {status === 'Taken' ? <Feather name="check" size={16} /> : index}
        </Text>
      </View>
      <View style={styles.medContent}>
        <Text style={styles.medTitle}>{title}</Text>
        <Text style={styles.medSubtitle}>{subtitle}</Text>
        <View style={styles.medMetaRows}>
          <View style={styles.metaRow}>
            <Feather name="box" size={12} color="#F59E0B" />
            <Text style={styles.metaText}>{dispenser}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.statusBadge, status === 'Taken' ? styles.statusBadgeTaken : styles.statusBadgePending]}>
        <Text style={[styles.statusBadgeText, status === 'Taken' ? styles.statusBadgeTextTaken : styles.statusBadgeTextPending]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingText}>Good morning, Khadijah</Text>
            <Text style={styles.dateText}>Friday, May 24</Text>
          </View>

          {/* Search Header */}
          <View style={styles.searchHeader}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>JB</Text>
            </View>
            <View style={styles.searchContainer}>
              <Feather name="search" size={18} color="rgba(4, 9, 33, 0.3)" />
              <TextInput 
                style={styles.searchInput}
                placeholder="search"
                placeholderTextColor="rgba(4, 9, 33, 0.3)"
              />
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Feather name="bell" size={22} color="#0F172A" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Health Insights Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Insights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.insightScroll}
            contentContainerStyle={styles.insightScrollContent}
          >
            <InsightCard 
              title="Body Temp" 
              value="36.8" 
              unit="°C" 
              icon="thermometer" 
              color="#EBF5FF"
              status="Normal"
            />
            <InsightCard 
              title="SpO2" 
              value="98" 
              unit="%" 
              icon="wind" 
              color="#F5F3FF"
              status="Normal"
            />
            <InsightCard 
              title="Smart Tray" 
              value="Online" 
              unit="" 
              icon="cpu" 
              color="#ECFDF5"
              status="Synced"
            />
          </ScrollView>

          {/* Alerts Summary Card */}
          <TouchableOpacity style={styles.alertsBanner}>
            <View style={styles.alertsLeft}>
              <View style={styles.alertIconContainer}>
                <Feather name="alert-circle" size={24} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.alertCountText}>2 Critical Alerts</Text>
                <Text style={styles.alertSubText}>Requires immediate attention</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color="rgba(239, 68, 68, 0.4)" />
          </TouchableOpacity>

          {/* Medication Management Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medication Management</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medList}>
            <MedicationCard 
              index={1}
              title="Morning Dose (8:00 AM)"
              subtitle="Metformin 500mg"
              dispenser="Dispenser 1"
              caregiver="By nurse kiki"
              date="May 24th"
              time="08:00"
              status="Taken"
            />
            <MedicationCard 
              index={2}
              title="Afternoon Dose (1:00 PM)"
              subtitle="Lisinopril 10mg"
              dispenser="Dispenser 2"
              caregiver="By caregiver"
              date="May 24th"
              time="13:00"
              status="Pending"
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.floatingNav}>
          <TouchableOpacity style={styles.navItem}>
            <Feather name="home" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Feather name="plus-square" size={22} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Feather name="bar-chart-2" size={22} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Feather name="crosshair" size={22} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navProfileCircle}>
               <Feather name="user" size={14} color="#0463DD" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
  greetingSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 16,
  },
  greetingText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 32, // Upscaled as requested
    color: '#0F172A',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  searchContainer: {
    flex: 1,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  bellBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
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
  insightScroll: {
    marginBottom: 32,
  },
  insightScrollContent: {
    paddingLeft: 24,
    paddingRight: 12,
    gap: 16,
  },
  insightCard: {
    width: 140,
    height: 160,
    borderRadius: 32,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  insightTitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(15, 23, 42, 0.7)',
    width: '65%',
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBody: {
    gap: 4,
    zIndex: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  insightValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: '#0F172A',
  },
  insightUnit: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  insightStatus: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#10B981',
  },
  insightPattern: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    opacity: 0.1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
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
  medTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18, // Upscaled for legibility
    color: '#0F172A',
    marginBottom: 8,
  },
  medMetaRows: {
    gap: 4,
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
  bottomNavContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingNav: {
    width: width * 0.85,
    height: 64,
    backgroundColor: '#0463DD', // Primary Blue to match the "John! 🌱" vibe
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 15,
  },
  navItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navProfileCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: 'rgba(15, 23, 42, 0.6)',
  },
  alertsBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
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
    borderColor: 'rgba(107, 78, 255, 0.2)',
    shadowColor: '#6B4EFF',
    shadowOpacity: 0.1,
  },
  medIndexTaken: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  medIndexPending: {
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
  },
  medIndexTextTaken: {
    color: '#10B981',
  },
  medIndexTextPending: {
    color: '#6B4EFF',
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
  },
  statusBadgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statusBadgeTextTaken: {
    color: '#10B981',
  },
  statusBadgeTextPending: {
    color: '#6B4EFF',
  },
});
