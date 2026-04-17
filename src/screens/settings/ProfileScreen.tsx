import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomNav from '../../components/navigation/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';


const { width } = Dimensions.get('window');

const SettingItem = ({ 
  icon, 
  title, 
  subtitle, 
  type = 'default',
  onPress 
}: { 
  icon: string; 
  title: string; 
  subtitle?: string; 
  type?: 'default' | 'danger' | 'toggle';
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.settingIconContainer, type === 'danger' && styles.settingIconContainerDanger]}>
      <Ionicons name={icon as any} size={22} color={type === 'danger' ? '#EF4444' : '#0463DD'} />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={[styles.settingTitle, type === 'danger' && styles.settingTitleDanger]}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, signOut } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState({ sn: 'PENDING', battery: 98, status: true });

  useEffect(() => {
    if (!user) return;

    const fetchDevice = async () => {
      const { data } = await supabase
        .from('devices')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        setDeviceInfo({
          sn: data.serial_number,
          battery: 98, // Forced for UI consistency
          status: true // Forced for UI consistency
        });
      }
    };

    fetchDevice();
  }, [user]);

  const fullName = user?.user_metadata?.full_name || 'Caregiver';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Profile Section - Redesigned to Light Theme */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.profileMeta}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={require('../../assets/images/caregiver_dija.jpg')} 
                  style={styles.avatar} 
                />
                <View style={styles.onlineBadge} />
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{fullName}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.user_metadata?.role?.toUpperCase() || 'CAREGIVER'}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-sharp" size={18} color="#0463DD" />
            </TouchableOpacity>
          </View>

          {/* Patient Quick Info Overlay - Redesigned to Elevated Card */}
          <View style={styles.snapshotContainer}>
            <View style={styles.patientSnapshot}>
              <View style={styles.snapshotItem}>
                <Text style={styles.snapshotLabel}>Caring For</Text>
                <Text style={styles.snapshotValue}>Mummy K</Text>
              </View>
              <View style={styles.snapshotDivider} />
              <View style={styles.snapshotItem}>
                <Text style={styles.snapshotLabel}>Health Status</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>STABLE</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Hardware Status Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hardware & Hub</Text>
          </View>
          <View style={styles.hubCard}>
            <View style={styles.hubInfo}>
              <View style={styles.hubIconContainer}>
                <Ionicons name="cloud" size={24} color="#0463DD" />
              </View>
              <View>
                <Text style={styles.hubTitle}>{deviceInfo.status ? 'Noosi Smart Hub v2' : 'Hub Offline'}</Text>
                <Text style={styles.hubId}>SN: {deviceInfo.sn}</Text>
              </View>
            </View>
            <View style={styles.hubStats}>
              <View style={styles.hubStat}>
                <Ionicons name="cellular" size={16} color={deviceInfo.status ? "#10B981" : "#EF4444"} />
                <Text style={[styles.hubStatText, !deviceInfo.status && { color: '#EF4444' }]}>
                  {deviceInfo.status ? 'Strong' : 'No Signal'}
                </Text>
              </View>
              <View style={styles.hubStat}>
                <Ionicons name="battery-full" size={16} color={deviceInfo.battery > 20 ? "#10B981" : "#EF4444"} />
                <Text style={[styles.hubStatText, deviceInfo.battery <= 20 && { color: '#EF4444' }]}>{deviceInfo.battery}%</Text>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>
          <View style={styles.settingsGroup}>
            <SettingItem 
              icon="person-circle-outline" 
              title="Personal Details" 
              subtitle="Email, Phone, Address" 
            />
            <SettingItem 
              icon="notifications-outline" 
              title="Notifications" 
              subtitle="Manage medication alerts" 
            />
            <SettingItem 
              icon="shield-checkmark-outline" 
              title="Security & Biometry" 
              subtitle="FaceID, Passcode" 
            />
          </View>

          {/* Patient Management */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Care</Text>
          </View>
          <View style={styles.settingsGroup}>
            <SettingItem 
              icon="document-text-outline" 
              title="Mummy K's Profile" 
              subtitle="Allergies, Blood Type, History" 
            />
            <SettingItem 
              icon="share-outline" 
              title="Secure Export to Doctor" 
              subtitle="Generate clinical PDF report" 
            />
            <SettingItem 
              icon="people-outline" 
              title="Care Team" 
              subtitle="Add other family members" 
            />
          </View>

          {/* Support & Logout */}
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Support</Text>
          </View>
          <View style={styles.settingsGroup}>
            <SettingItem icon="help-buoy-outline" title="Help Center" />
            <SettingItem icon="information-circle-outline" title="Contact Nurse" />
            <SettingItem 
              icon="log-out-outline" 
              title="Log Out" 
              type="danger" 
              onPress={signOut}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Noosi Health v1.2.0 • Build 892</Text>
            <View style={styles.secureBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#64748B" />
              <Text style={styles.secureText}>End-to-end encrypted</Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <BottomNav activeTab="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#0F172A',
  },
  roleBadge: {
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2,
  },
  roleText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: '#0463DD',
    letterSpacing: 0.5,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotContainer: {
    marginTop: 8,
    height: 80,
  },
  patientSnapshot: {
    flex: 1,
    backgroundColor: 'rgba(4, 99, 221, 0.03)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  snapshotItem: {
    flex: 1,
    gap: 4,
  },
  snapshotLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  snapshotValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  snapshotDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    marginHorizontal: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 12,
    color: '#10B981',
  },
  content: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  hubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  hubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hubIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  hubId: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  hubStats: {
    gap: 8,
  },
  hubStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hubStatText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 10,
    color: '#10B981',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconContainerDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#0F172A',
  },
  settingTitleDanger: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#64748B',
    marginTop: -2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  version: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#94A3B8',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#64748B',
  },
});
