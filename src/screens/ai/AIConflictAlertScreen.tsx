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
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ConflictRouteParams = {
  AIConflictAlert: {
    conflictingDrug: string;
    existingDrug: string;
    severity: 'moderate' | 'severe';
  };
};

const SEVERITY_MAP = {
  moderate: {
    label: 'Moderate Risk',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    iconColor: '#D97706',
  },
  severe: {
    label: 'High Risk',
    color: '#FF6F61',
    bgColor: '#FFF1EE',
    borderColor: '#FFD5CF',
    iconColor: '#FF6F61',
  },
};

export default function AIConflictAlertScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<ConflictRouteParams, 'AIConflictAlert'>>();

  const conflictingDrug = route.params?.conflictingDrug ?? 'Warfarin';
  const existingDrug = route.params?.existingDrug ?? 'Aspirin';
  const severity = route.params?.severity ?? 'severe';

  const s = SEVERITY_MAP[severity];

  const handleGoBack = () => {
    navigation.navigate('Medications');
  };

  const handleOverride = () => {
    navigation.navigate('Medications');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: s.bgColor }]}>
      {/* No back button: this is a safety blocker */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blocker Badge */}
        <View style={[styles.blockerBadge, { borderColor: s.borderColor, backgroundColor: s.bgColor }]}>
          <Feather name="shield" size={16} color={s.iconColor} />
          <Text style={[styles.blockerBadgeText, { color: s.color }]}>
            Safety Block Active
          </Text>
        </View>

        {/* Severity Warning Header */}
        <View style={styles.alertHeader}>
          <View style={[styles.alertIcon, { backgroundColor: s.bgColor }]}>
            <Feather name="alert-triangle" size={40} color={s.iconColor} />
          </View>
          <Text style={[styles.alertTitle, { color: s.color }]}>{s.label}</Text>
          <Text style={styles.alertSubtitle}>
            Adding this drug could be unsafe for Grandpa Kunle
          </Text>
        </View>

        {/* Drug Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>What was detected</Text>

          <View style={styles.drugRow}>
            {/* New Drug */}
            <View style={[styles.drugBox, { borderColor: s.borderColor }]}>
              <Text style={styles.drugBoxLabel}>NEW</Text>
              <View style={[styles.drugPill, { backgroundColor: '#FF6F61' }]} />
              <Text style={styles.drugName}>{conflictingDrug}</Text>
            </View>

            {/* Conflict Icon */}
            <View style={styles.conflictCenter}>
              <Feather name="zap" size={24} color={s.color} />
            </View>

            {/* Existing Drug */}
            <View style={[styles.drugBox, { borderColor: '#E5E7EB' }]}>
              <Text style={styles.drugBoxLabel}>IN MEDS</Text>
              <View style={[styles.drugPill, { backgroundColor: '#06565F' }]} />
              <Text style={styles.drugName}>{existingDrug}</Text>
            </View>
          </View>
        </View>

        {/* Conflict Detail List */}
        <View style={[styles.detailCard, { borderColor: s.borderColor }]}>
          <Text style={styles.detailTitle}>Why this is risky</Text>

          {[
            { icon: 'droplet', text: `${conflictingDrug} + ${existingDrug} can increase bleeding risk significantly.` },
            { icon: 'activity', text: 'Blood pressure may drop to unsafe levels if taken together.' },
            { icon: 'thermometer', text: 'This combination is flagged in the NAFDAC interaction registry.' },
          ].map((item, index) => (
            <View key={index} style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: `${s.color}1A` }]}>
                <Feather name={item.icon as any} size={16} color={s.color} />
              </View>
              <Text style={styles.detailText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Recommendation */}
        <View style={styles.recommendCard}>
          <Feather name="user-check" size={18} color="#10B981" />
          <Text style={styles.recommendText}>
            <Text style={styles.boldText}>Recommended: </Text>
            Contact Grandpa Kunle's doctor before adding this medication.
          </Text>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.goBackBtnText}>Cancel — Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.overrideBtn}
          onPress={handleOverride}
          activeOpacity={0.8}
        >
          <Text style={styles.overrideBtnText}>Override Anyway</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  blockerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
  },
  blockerBadgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  alertHeader: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  alertIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  alertTitle: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 26,
    textAlign: 'center',
  },
  alertSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: 'rgba(4,9,33,0.6)',
    textAlign: 'center',
    maxWidth: 260,
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
  },
  comparisonTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  drugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drugBox: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FAFAFA',
  },
  drugBoxLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 9,
    color: 'rgba(4,9,33,0.4)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  drugPill: {
    width: 36,
    height: 18,
    borderRadius: 9,
  },
  drugName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#0F172A',
    textAlign: 'center',
  },
  conflictCenter: {
    width: 36,
    alignItems: 'center',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
  },
  detailTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  detailText: {
    flex: 1,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.7)',
    lineHeight: 20,
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(16,185,129,0.07)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    padding: 14,
  },
  recommendText: {
    flex: 1,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#06565F',
    lineHeight: 20,
  },
  boldText: {
    fontFamily: 'Baloo2_700Bold',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    gap: 10,
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0F172A',
    borderRadius: 30,
    height: 56,
  },
  goBackBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  overrideBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  overrideBtnText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.35)',
    textDecorationLine: 'underline',
  },
});
