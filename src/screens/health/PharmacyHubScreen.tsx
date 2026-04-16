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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

const HubCard = ({ 
  title, 
  subtitle, 
  icon, 
  color, 
  onPress,
  badge
}: { 
  title: string; 
  subtitle: string; 
  icon: string; 
  color: string; 
  onPress?: () => void;
  badge?: string;
}) => (
  <TouchableOpacity 
    style={styles.hubCard} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.hubIconContainer, { backgroundColor: color + '10' }]}>
      <Ionicons name={icon as any} size={28} color={color} />
    </View>
    <View style={styles.hubContent}>
      <Text style={styles.hubCardTitle}>{title}</Text>
      <Text style={styles.hubCardSubtitle}>{subtitle}</Text>
    </View>
    {badge ? (
      <View style={[styles.badgeContainer, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    )}
  </TouchableOpacity>
);

export default function PharmacyHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pharmacy Hub</Text>
        <TouchableOpacity style={styles.supportBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0463DD" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>How can we help today?</Text>
          <Text style={styles.introSubtitle}>Manage prescriptions, refills, and consultations for Mummy K.</Text>
        </View>

        {/* Inventory Alerts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inventory Alerts</Text>
        </View>
        <View style={styles.alertCard}>
          <View style={styles.alertIconBadge}>
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Low Stock: Metformin</Text>
            <Text style={styles.alertMsg}>Only 3 doses remaining in Noosi Hub. Refill recommended.</Text>
            <TouchableOpacity style={styles.refillNowBtn}>
              <Text style={styles.refillNowText}>Refill Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pharmacy Services</Text>
        </View>
        
        <HubCard 
          title="Connect with Pharmacist" 
          subtitle="Instant chat for meds guidance"
          icon="chatbubbles-outline"
          color="#0463DD"
        />

        <HubCard 
          title="Prescription Orders" 
          subtitle="View and manage active scripts"
          icon="document-text-outline"
          color="#6366F1"
          badge="4 Active"
        />

        <HubCard 
          title="Medication Refills" 
          subtitle="One-tap recurring orders"
          icon="sync-outline"
          color="#10B981"
        />

        {/* Medical Support */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medical Support</Text>
        </View>

        <TouchableOpacity style={styles.telehealthCard}>
          <View style={styles.telehealthInfo}>
            <Text style={styles.telehealthTitle}>Virtual Consultation</Text>
            <Text style={styles.telehealthSubtitle}>Book a 15-min session with a doctor for new prescriptions.</Text>
            <View style={styles.availabilityRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.availabilityText}>Doctors available now</Text>
            </View>
          </View>
          <View style={styles.telehealthAction}>
            <Ionicons name="videocam-outline" size={32} color="#0463DD" />
            <Text style={styles.telehealthActionText}>Start</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footerInfo}>
        <Ionicons name="shield-checkmark" size={16} color="#64748B" />
        <Text style={styles.footerText}>Secure clinical pharmacy partner</Text>
      </View>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  supportBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  introTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: '#0F172A',
    marginBottom: 8,
  },
  introSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  alertCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  alertIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#9F1239',
    marginBottom: 4,
  },
  alertMsg: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#BE123C',
    lineHeight: 20,
    marginBottom: 16,
  },
  refillNowBtn: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  refillNowText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  hubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  hubIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubContent: {
    flex: 1,
    marginLeft: 16,
  },
  hubCardTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 17,
    color: '#0F172A',
  },
  hubCardSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  telehealthCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.1)',
    backgroundColor: '#F0F7FF',
  },
  telehealthInfo: {
    flex: 1,
  },
  telehealthTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0463DD',
    marginBottom: 4,
  },
  telehealthSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  availabilityText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#10B981',
  },
  telehealthAction: {
    alignItems: 'center',
    marginLeft: 16,
    gap: 4,
  },
  telehealthActionText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#0463DD',
  },
  footerInfo: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#64748B',
  },
});
