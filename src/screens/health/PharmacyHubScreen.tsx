import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomNav from '../../components/navigation/BottomNav';

const { width } = Dimensions.get('window');

// Quick Action Item Component
const QuickAction = ({ 
  title, 
  icon, 
  color, 
  onPress 
}: { 
  title: string; 
  icon: string; 
  color: string; 
  onPress?: () => void;
}) => (
  <TouchableOpacity 
    style={styles.actionItem} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon as any} size={26} color={color} />
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
  </TouchableOpacity>
);

// Order Tracker Item
const OrderStep = ({ 
  label, 
  status, 
  isLast 
}: { 
  label: string; 
  status: 'completed' | 'current' | 'pending';
  isLast?: boolean;
}) => (
  <View style={styles.stepContainer}>
    <View style={styles.stepHeader}>
      <View style={[
        styles.stepDot, 
        status === 'completed' && { backgroundColor: '#10B981' },
        status === 'current' && { backgroundColor: '#0463DD', borderWidth: 2, borderColor: '#FFFFFF' }
      ]}>
        {status === 'completed' && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
      </View>
      {!isLast && <View style={[styles.stepLine, status === 'completed' && { backgroundColor: '#10B981' }]} />}
    </View>
    <Text style={[
      styles.stepLabel, 
      status === 'current' && { color: '#0463DD', fontFamily: 'Baloo2_700Bold' }
    ]}>{label}</Text>
  </View>
);

export default function PharmacyHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Immersive Header Section */}
        <View style={styles.heroContainer}>
          <View style={styles.heroOverlay}>
            <SafeAreaView>
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                  <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.heroTitle}>Pharmacy Hub</Text>
                <TouchableOpacity style={styles.headerBtn}>
                  <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>

            <View style={styles.heroContent}>
              <Text style={styles.mainWelcome}>Mummy Kay's Hub</Text>
              <Text style={styles.heroSubtitle}>Manage her prescriptions, refills, and medical support seamlessly.</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentBody}>
          {/* Active Orders Tracker */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Order Tracking</Text>
            <TouchableOpacity><Text style={styles.viewAll}>Track All</Text></TouchableOpacity>
          </View>
          
          <View style={styles.trackerCard}>
            <View style={styles.trackerTop}>
              <View>
                <Text style={styles.orderId}>ORDER #NS-99120</Text>
                <Text style={styles.orderMeds}>Metformin + 2 others</Text>
              </View>
              <Text style={styles.orderDate}>Est: Apr 18</Text>
            </View>
            
            <View style={styles.stepsRow}>
              <OrderStep label="Processed" status="completed" />
              <OrderStep label="Shipped" status="current" />
              <OrderStep label="Delivered" status="pending" isLast />
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Services</Text>
          </View>
          
          <View style={styles.actionGrid}>
            <QuickAction title="Upload Prescription" icon="cloud-upload-outline" color="#0463DD" />
            <QuickAction title="Refill Medication" icon="refresh-outline" color="#10B981" />
            <QuickAction title="Talk to Pharmacist" icon="chatbubbles-outline" color="#F59E0B" />
            <QuickAction title="Medical History" icon="medical-outline" color="#6366F1" />
          </View>

          {/* Inventory Alert - Restyled */}
          <TouchableOpacity style={styles.premiumAlert}>
            <View style={styles.alertIconBg}>
              <Ionicons name="alert-circle" size={28} color="#EF4444" />
            </View>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Inventory Alert!</Text>
              <Text style={styles.alertSub}>Only 3 doses of Metformin remaining</Text>
            </View>
            <View style={styles.alertActionBtn}>
              <Text style={styles.alertActionText}>REFILL</Text>
            </View>
          </TouchableOpacity>

          {/* Virtual Care Card */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Care</Text>
          </View>
          
          <TouchableOpacity style={styles.careCard}>
            <View style={styles.careInfo}>
              <Text style={styles.careTitle}>Consult with a Doctor</Text>
              <Text style={styles.careDesc}>Schedule a 10-minute video call for new prescription renewals.</Text>
              <View style={styles.drRow}>
                <Ionicons name="videocam" size={16} color="#0463DD" />
                <Text style={styles.drText}>Doctors online (2-min wait)</Text>
              </View>
            </View>
            <View style={styles.careGraphic}>
               <Ionicons name="person-outline" size={40} color="#0463DD" />
            </View>
          </TouchableOpacity>

          <View style={{ height: 180 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <BottomNav activeTab="Pharmacy" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 290,
    width: '100%',
    backgroundColor: '#0463DD',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  heroContent: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 60, 
  },
  mainWelcome: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 34,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  contentBody: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  viewAll: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD',
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  trackerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  orderId: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  orderMeds: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
    marginTop: 2,
  },
  orderDate: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  stepContainer: {
    alignItems: 'center',
    width: '30%',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepLine: {
    position: 'absolute',
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  stepLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  actionItem: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'center',
  },
  premiumAlert: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#991B1B',
  },
  alertSub: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#EF4444',
  },
  alertActionBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  alertActionText: {
    color: '#FFFFFF',
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
  },
  careCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.1)',
  },
  careInfo: {
    flex: 1,
  },
  careTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0463DD',
    marginBottom: 4,
  },
  careDesc: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  drRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#0463DD',
  },
  careGraphic: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
