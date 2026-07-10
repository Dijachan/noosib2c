import React from 'react';
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
import { useAuth } from '../../context/AuthContext';

export default function CareCircleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { patientProfile, careCircle, setOnboardingStatus } = useAuth();

  const patientName = patientProfile?.name || 'Grandpa Kunle';

  const getAvatarBg = (name: string) => {
    const char = name.trim().charAt(0).toUpperCase();
    const colors = [
      '#FF6F61', '#F59E0B', '#10B981', '#06565F', 
      '#D6FB00', '#D6FB00', '#FF6F61', '#06565F'
    ];
    const code = char.charCodeAt(0) || 0;
    return colors[code % colors.length];
  };

  const handleFinish = () => {
    // Sets onboarding state to completed, immediately redirecting user to main AppNavigator (Admin Dashboard)
    setOnboardingStatus('completed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpacer} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Custom Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <View style={styles.navHeaderTitleContainer}>
            <Text style={styles.navTitle}>Care Circle</Text>
            <Text style={styles.navStep}>Step 3 of 3</Text>
          </View>
          <View style={styles.navPlaceholder} />
        </View>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Care Circle</Text>
          <Text style={styles.subtitle}>
            These are the caregivers and family members coordinating care for {patientName}.
          </Text>
        </View>

        {/* Members List */}
        <View style={styles.listContainer}>
          {careCircle.map((member, idx) => {
            const initial = member.name.trim().charAt(0).toUpperCase();
            const avatarBg = getAvatarBg(member.name);
            const isActive = member.status === 'Active';
            
            return (
              <View key={idx} style={styles.memberCard}>
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
                  <Text style={styles.avatarText}>{initial}</Text>
                </View>

                {/* Info */}
                <View style={styles.memberInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>{member.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.memberPhone}>{member.phone}</Text>
                </View>

                {/* Status */}
                <View style={[
                  styles.statusBadge,
                  isActive ? styles.statusActive : styles.statusPending
                ]}>
                  <Text style={[
                    styles.statusText,
                    isActive ? styles.statusTextActive : styles.statusTextPending
                  ]}>
                    {member.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Add Caregiver Action Card */}
        <TouchableOpacity 
          style={styles.addCard}
          onPress={() => navigation.navigate('InviteCaregiver')}
          activeOpacity={0.8}
        >
          <View style={styles.addIconContainer}>
            <Feather name="user-plus" size={18} color="#06565F" />
          </View>
          <View style={styles.addTextContainer}>
            <Text style={styles.addTitle}>Invite a Caregiver</Text>
            <Text style={styles.addSublabel}>Add family members or local nurses to log doses.</Text>
          </View>
          <Feather name="chevron-right" size={20} color="rgba(4,9,33,0.3)" />
        </TouchableOpacity>
      </ScrollView>

      {/* Primary Actions (Fixed at Bottom) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleFinish}
        >
          <Text style={styles.buttonText}>Finish Setup</Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSpacer: {
    height: Platform.OS === 'ios' ? 0 : 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderTitleContainer: {
    alignItems: 'center',
  },
  navTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navStep: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#06565F',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  header: {
    marginBottom: 24,
    width: '100%',
    maxWidth: 361,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(4,9,33,0.6)',
  },
  listContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 12,
    marginBottom: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  memberName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.76)',
    maxWidth: 130,
  },
  roleBadge: {
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  roleBadgeText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 10,
    color: '#06565F',
  },
  memberPhone: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  statusText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
  },
  statusTextActive: {
    color: '#10B981',
  },
  statusTextPending: {
    color: '#D97706',
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 361,
    gap: 12,
    marginTop: 8,
  },
  addIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTextContainer: {
    flex: 1,
  },
  addTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#06565F',
    marginBottom: 2,
  },
  addSublabel: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#06565F',
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
