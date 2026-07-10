import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScanState = 'viewfinder' | 'scanning' | 'review';

export default function PrescriptionScannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [scanState, setScanState] = useState<ScanState>('viewfinder');

  const handleScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('review');
    }, 1500);
  };

  const handleAddToSchedule = () => {
    navigation.navigate('Schedule', {
      drugData: {
        name: 'Amlodipine Besylate',
        brand: 'Norvasc',
        strength: '5mg',
        formFactor: 'Tablet',
        pillColor: '#3B82F6',
        instructions: 'Take once daily in the morning.',
      },
    });
  };

  const handleRescan = () => {
    setScanState('viewfinder');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Prescription</Text>
        <View style={styles.navPlaceholder} />
      </View>

      {/* STATE 1: VIEWFINDER */}
      {scanState === 'viewfinder' && (
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinderBox}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <View style={styles.scanPlaceholder}>
              <Feather name="file-text" size={48} color="rgba(255,255,255,0.4)" />
              <Text style={styles.scanHintText}>Align the prescription label inside the frame</Text>
            </View>
          </View>

          <Text style={styles.viewfinderCaption}>
            Make sure the label is well-lit and clearly visible
          </Text>

          <TouchableOpacity
            style={styles.scanTrigger}
            onPress={handleScan}
            activeOpacity={0.8}
          >
            <View style={styles.scanTriggerInner}>
              <Ionicons name="scan" size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.scanBtnLabel}>Tap to Scan</Text>
        </View>
      )}

      {/* STATE 2: SCANNING PROGRESS */}
      {scanState === 'scanning' && (
        <View style={styles.scanningContainer}>
          <View style={styles.scanningCard}>
            <ActivityIndicator size="large" color="#0463DD" />
            <Text style={styles.scanningTitle}>Reading prescription...</Text>
            <Text style={styles.scanningSubtitle}>
              AI is extracting drug details from the label
            </Text>
          </View>
        </View>
      )}

      {/* STATE 3: OCR REVIEW FORM */}
      {scanState === 'review' && (
        <ScrollView
          style={styles.reviewScroll}
          contentContainerStyle={styles.reviewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Match Badge */}
          <View style={styles.matchBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.matchBadgeText}>Matched in NAFDAC database</Text>
          </View>

          <Text style={styles.reviewTitle}>Extracted Drug Info</Text>
          <Text style={styles.reviewSubtitle}>Review and correct any details before saving.</Text>

          {/* Review field cards */}
          {[
            { label: 'Drug Name', value: 'Amlodipine Besylate', icon: 'package' },
            { label: 'Brand Name', value: 'Norvasc', icon: 'tag' },
            { label: 'Strength', value: '5mg', icon: 'activity' },
            { label: 'Frequency', value: 'Once Daily', icon: 'repeat' },
            { label: 'Dosage', value: '1 tablet', icon: 'droplet' },
            { label: 'NAFDAC Reg', value: 'NAFDAC 04-1234', icon: 'shield' },
          ].map((field, index) => (
            <View key={index} style={styles.reviewField}>
              <View style={styles.reviewFieldIcon}>
                <Feather name={field.icon as any} size={18} color="#0463DD" />
              </View>
              <View style={styles.reviewFieldContent}>
                <Text style={styles.reviewFieldLabel}>{field.label}</Text>
                <Text style={styles.reviewFieldValue}>{field.value}</Text>
              </View>
              <Feather name="edit-2" size={16} color="rgba(4,9,33,0.3)" />
            </View>
          ))}

          <View style={styles.reviewButtons}>
            <TouchableOpacity style={styles.rescanBtn} onPress={handleRescan} activeOpacity={0.8}>
              <Feather name="refresh-cw" size={18} color="rgba(4,9,33,0.6)" />
              <Text style={styles.rescanText}>Re-scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addScheduleBtn}
              onPress={handleAddToSchedule}
              activeOpacity={0.8}
            >
              <Text style={styles.addScheduleText}>Add to Schedule</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    height: 40,
  },
  // Viewfinder styles
  viewfinderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#0A0A0A',
  },
  viewfinderBox: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0463DD',
    borderWidth: 3,
  },
  cornerTL: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 10 },
  cornerTR: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 10 },
  cornerBL: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 10 },
  cornerBR: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 10 },
  scanPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  scanHintText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    maxWidth: 200,
  },
  viewfinderCaption: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 32,
  },
  scanTrigger: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scanTriggerInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 16,
  },
  // Scanning styles
  scanningContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  scanningCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  scanningTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
    marginTop: 8,
  },
  scanningSubtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
    textAlign: 'center',
  },
  // Review styles
  reviewScroll: {
    flex: 1,
  },
  reviewContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  matchBadgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: '#10B981',
  },
  reviewTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: 'rgba(4,9,33,0.76)',
    marginTop: 4,
  },
  reviewSubtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
    marginBottom: 8,
  },
  reviewField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  reviewFieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(4,99,221,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewFieldContent: {
    flex: 1,
  },
  reviewFieldLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
    textTransform: 'uppercase',
  },
  reviewFieldValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
    marginTop: 2,
  },
  reviewButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  rescanBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  rescanText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
  },
  addScheduleBtn: {
    flex: 2,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0463DD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addScheduleText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
