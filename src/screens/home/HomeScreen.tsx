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
          {status === 'Taken' ? <Ionicons name="checkmark" size={18} color="#10B981" /> : index}
        </Text>
      </View>
      <View style={styles.medContent}>
        <Text style={styles.medTitle}>{title}</Text>
        <Text style={styles.medSubtitle}>{subtitle}</Text>
        <View style={styles.medMetaRows}>
          <View style={styles.metaRow}>
            <Ionicons name="cube-outline" size={14} color="#F59E0B" />
            <Text style={styles.metaText}>{dispenser}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.statusBadge, status === 'Taken' ? styles.statusBadgeTaken : styles.statusBadgePending]}>
        <Text style={[styles.statusBadgeText, status === 'Taken' ? styles.statusBadgeTextTaken : styles.statusBadgeTextPending]}>
          {status.toUpperCase()}
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
          {/* Top Greeting & Monitoring Badge */}
          <View style={styles.greetingHeader}>
            <View>
              <Text style={styles.greetingText}>Good morning, John! 🌱</Text>
              <View style={styles.monitoringBadge}>
                <Ionicons name="eye-outline" size={14} color="#6B4EFF" />
                <Text style={styles.monitoringText}>Caring for Khadijah</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
               <Image 
                 source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' }} 
                 style={styles.profileImg} 
               />
            </TouchableOpacity>
          </View>

          {/* Health Insights Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Insights</Text>
          </View>

          <View style={styles.insightGrid}>
            <InsightCard 
              title="Daily Adherence" 
              value="98" 
              unit="%" 
              icon="checkmark-circle-outline" 
              color="#F5F3FF" // Pastel Purple
              status="Optimal"
            />
            <InsightCard 
              title="Body Temp" 
              value="36.8" 
              unit="°C" 
              icon="thermometer-outline" 
              color="#EBF5FF" // Pastel Blue
              status="Normal"
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

      {/* Modern Bottom Navigation with Glass Effect */}
      <View style={styles.bottomNavContainer}>
        <BlurView 
          intensity={Platform.OS === 'ios' ? 80 : 100} 
          tint="light" 
          style={StyleSheet.absoluteFill} 
        />
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="grid" size={24} color="#0463DD" />
            <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="medical-outline" size={24} color="rgba(15, 23, 42, 0.4)" />
            <Text style={styles.navText}>Meds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navFabContainer}>
            <View style={styles.navFab}>
              <Ionicons name="add" size={30} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="notifications-outline" size={24} color="rgba(15, 23, 42, 0.4)" />
            <Text style={styles.navText}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="rgba(15, 23, 42, 0.4)" />
            <Text style={styles.navText}>Profile</Text>
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
    backgroundColor: 'rgba(107, 78, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 6,
  },
  monitoringText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#6B4EFF',
  },
  profileBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.05)',
    shadowColor: '#0463DD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  insightCardTitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(15, 23, 42, 0.5)',
    width: '65%',
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
  navFabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navFab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0463DD',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0463DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
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
    overflow: 'hidden',
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
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
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
});
