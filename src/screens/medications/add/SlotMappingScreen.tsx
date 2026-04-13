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

const { width } = Dimensions.get('window');

export default function SlotMappingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { drugData } = route.params || { drugData: { name: 'Metformin' } };

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Mock occupied slots (1, 2, 4, 8, 9 are taken based on MedsTrayScreen mock)
  const occupiedSlots = [1, 2, 4, 8, 9];

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
          {Array.from({ length: 12 }, (_, i) => renderSlot(i + 1))}
          <View style={styles.flushRow}>
             {renderSlot(13)}
             {renderSlot(14)}
          </View>
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
        <TouchableOpacity 
          style={[styles.primaryBtn, !selectedSlot && styles.btnDisabled]}
          disabled={!selectedSlot}
          onPress={() => navigation.navigate('Schedule', { 
            drugData: { ...drugData, slot: selectedSlot } 
          })}
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
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  slot: {
    width: (width - 48 - 16) / 2, // 2 columns for 2x7 grid
    height: 100,
    borderRadius: 20,
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
    fontSize: 24,
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
});
