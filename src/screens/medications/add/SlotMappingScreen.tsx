import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../../context/MedicationContext';

const { width } = Dimensions.get('window');

export default function SlotMappingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { medicationList } = useMedication();
  const { drugData, isEditing, editMed } = route.params || { drugData: { name: 'Metformin' } };

  const [selectedSlot, setSelectedSlot] = useState<number | null>(drugData?.slot || editMed?.slot || null);
  const [hasConfirmedMove, setHasConfirmedMove] = useState(false);

  const isSlotChanged = isEditing && editMed && selectedSlot !== editMed.slot;
  const shouldShowConsent = !isEditing || isSlotChanged;

  React.useEffect(() => {
    // If editing and staying in the same slot, auto-confirm
    if (isEditing && editMed && selectedSlot === editMed.slot) {
      setHasConfirmedMove(true);
    } else {
      // For moves or new additions, require manual confirmation
      setHasConfirmedMove(false);
    }
  }, [selectedSlot, isEditing, editMed]);

  // Derive occupied slots from real MedicationContext state
  const occupiedSlots = medicationList
    .filter(m => !isEditing || m.id !== editMed?.id)
    .map(m => m.slot);

  const renderSlot = (id: number) => {
    const isOccupied = occupiedSlots.includes(id);
    const isSelected = selectedSlot === id;

    return (
      <TouchableOpacity 
        key={id}
        disabled={isOccupied}
        onPress={() => setSelectedSlot(id)}
        style={[
          styles.slot,
          isOccupied && styles.slotOccupied,
          isSelected && styles.slotSelected,
        ]}
      >
        <Text style={[
          styles.slotId,
          isOccupied && styles.textDisabled,
          isSelected && styles.textSelected
        ]}>
          {id}
        </Text>
        {isOccupied && (
          <Ionicons name="lock-closed" size={16} color="#CBD5E1" />
        )}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 3 of 5</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Map medication to a slot</Text>
        <Text style={styles.subtitle}>
          Tap the physical slot in the tray where you placed the <Text style={styles.drugHighlight}>{drugData.name}</Text>.
        </Text>

        <View style={styles.grid}>
          {Array.from({ length: 14 }, (_, i) => renderSlot(i + 1))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F1F5F9' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#0463DD' }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {shouldShowConsent && (
          <TouchableOpacity 
            style={[
              styles.ackContainer, 
              !isEditing && styles.ackContainerNew,
              hasConfirmedMove && (isSlotChanged ? styles.ackContainerActive : styles.ackContainerNewActive)
            ]} 
            onPress={() => setHasConfirmedMove(!hasConfirmedMove)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox, 
              isSlotChanged ? styles.checkboxRed : styles.checkboxBlue,
              hasConfirmedMove && (isSlotChanged ? styles.checkboxRedActive : styles.checkboxBlueActive)
            ]}>
              {hasConfirmedMove && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={[
              styles.ackText,
              !isEditing && styles.ackTextNew
            ]}>
              {isSlotChanged 
                ? "I consent that the medication has been moved to another slot" 
                : "I have placed the medication in the selected slot"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.primaryBtn, (!selectedSlot || !hasConfirmedMove) && styles.btnDisabled]}
          onPress={() => selectedSlot && navigation.navigate('Schedule', { 
            drugData: { ...drugData, slot: selectedSlot },
            isEditing,
            editMed
          })}
          disabled={!selectedSlot || !hasConfirmedMove}
        >
          <Text style={styles.primaryBtnText}>Confirm Slot {selectedSlot}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  drugHighlight: {
    color: '#0463DD',
    fontFamily: 'Baloo2_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  slot: {
    width: (width - 48 - 12) / 2, // 2 columns for clear 14-slot layout
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotOccupied: {
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  slotSelected: {
    backgroundColor: '#0463DD',
    borderColor: '#0463DD',
  },
  slotId: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 18,
    color: '#94A3B8',
  },
  textDisabled: {
    color: '#CBD5E1',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 40,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryBtn: {
    backgroundColor: '#0463DD',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  primaryBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  flushRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 0,
    marginTop: 0,
  },
  warningBox: {
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.15)',
    marginBottom: 32,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#D97706',
    textTransform: 'uppercase',
  },
  warningText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(180, 83, 9, 0.8)',
    lineHeight: 20,
  },
  warningHighlight: {
    fontFamily: 'Baloo2_700Bold',
    color: '#B45309',
    textDecorationLine: 'underline',
  },
  ackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxRed: {
    borderColor: '#EF4444',
  },
  checkboxBlue: {
    borderColor: '#0463DD',
  },
  checkboxRedActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  checkboxBlueActive: {
    backgroundColor: '#0463DD',
    borderColor: '#0463DD',
  },
  ackText: {
    flex: 1,
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#EF4444',
    lineHeight: 20,
  },
  ackTextNew: {
    color: '#0463DD',
  },
  ackContainerNew: {
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    borderColor: 'rgba(4, 99, 221, 0.1)',
  },
  ackContainerActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  ackContainerNewActive: {
    backgroundColor: 'rgba(4, 99, 221, 0.1)',
    borderColor: 'rgba(4, 99, 221, 0.2)',
  },
  ackHighlight: {
    fontFamily: 'Baloo2_800ExtraBold',
    textDecorationLine: 'underline',
  },
});
