import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function DrugDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { drug, isEditing, editMed } = route.params || { drug: { name: 'Metformin', dosage: '500mg', type: 'Tablet' } };

  const [dosage, setDosage] = useState(editMed?.dosageAmount || '1');
  const [unit, setUnit] = useState(editMed?.dosageUnit || drug.type || 'Tablet');
  const [tempUnit, setTempUnit] = useState(unit);
  const [instructions, setInstructions] = useState(editMed?.instructions || '');
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const units = ['Tablet', 'Capsule', 'Sachet', 'Caplet', 'Lozenge'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Step 2 of 5</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.drugSummary}>
            <View style={styles.iconCircle}>
               <Ionicons name="medical" size={32} color="#0463DD" />
            </View>
            <Text style={styles.drugName}>{drug.name}</Text>
            <Text style={styles.drugType}>{drug.type} • {drug.dosage}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosage per intake</Text>
              <View style={styles.dosageInputContainer}>
                <TouchableOpacity 
                  style={styles.dosageBtn} 
                  onPress={() => setDosage(Math.max(0.5, parseFloat(dosage) - 0.5).toString())}
                >
                  <Ionicons name="remove" size={24} color="#0F172A" />
                </TouchableOpacity>
                <TextInput 
                  style={styles.dosageInput}
                  value={dosage}
                  onChangeText={setDosage}
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  style={styles.dosageBtn}
                  onPress={() => setDosage((parseFloat(dosage) + 0.5).toString())}
                >
                  <Ionicons name="add" size={24} color="#0F172A" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.unitSelector} 
                  onPress={() => setShowUnitPicker(true)}
                >
                  <Text style={styles.dosageUnit}>{unit}(s)</Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Intake Instructions (Optional)</Text>
              <TextInput 
                style={styles.textArea}
                placeholder="e.g. Take after breakfast. Avoid alcohol."
                multiline
                numberOfLines={4}
                value={instructions}
                onChangeText={setInstructions}
              />
            </View>

            <View style={styles.tipBox}>
              <Ionicons name="information-circle-outline" size={20} color="#0463DD" />
              <Text style={styles.tipText}>
                Ensuring correct dosage prevents medical complications. Follow the physician's prescription.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('SlotMapping', { 
              drugData: { 
                ...drug, 
                dosageAmount: dosage, 
                dosageUnit: unit,
                instructions,
                slot: route.params?.slot // Forward the intent
              },
              isEditing,
              editMed
            })}
          >
            <Text style={styles.primaryBtnText}>Continue to Slot Mapping</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showUnitPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity 
            style={styles.dismissOverlay} 
            activeOpacity={1} 
            onPress={() => setShowUnitPicker(false)} 
          />
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Unit</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.unitList}>
              {units.map((u) => (
                <TouchableOpacity 
                  key={u} 
                  style={[styles.unitItem, tempUnit === u && styles.unitItemSelected]} 
                  onPress={() => setTempUnit(u)}
                >
                  <Text style={[styles.unitText, tempUnit === u && styles.unitTextSelected]}>{u}</Text>
                  {tempUnit === u && <Ionicons name="checkmark-circle" size={20} color="#0463DD" />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => {
                setTempUnit(unit);
                setShowUnitPicker(false);
              }}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={() => {
                setUnit(tempUnit);
                setShowUnitPicker(false);
              }}>
                <Text style={styles.modalConfirmBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
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
  drugSummary: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  drugName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#0F172A',
    textAlign: 'center',
  },
  drugType: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0F172A',
  },
  dosageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dosageBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dosageInput: {
    flex: 1,
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
    textAlign: 'center',
  },
  dosageUnit: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0F172A',
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 4,
    gap: 4,
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#0F172A',
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4, 99, 221, 0.03)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: 'rgba(15, 23, 42, 0.7)',
    lineHeight: 18,
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
  primaryBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    maxHeight: '60%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  pickerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
  },
  unitList: {
    gap: 8,
  },
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  unitItemSelected: {
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.1)',
  },
  unitText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#475569',
  },
  unitTextSelected: {
    color: '#0463DD',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#64748B',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
