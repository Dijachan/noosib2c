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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function DrugDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { drug } = route.params || { drug: { name: 'Metformin', dosage: '500mg', type: 'Tablet' } };

  const [dosage, setDosage] = useState('1'); // Number of pills per dose
  const [instructions, setInstructions] = useState('');

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
                <Text style={styles.dosageUnit}>{drug.type}(s)</Text>
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
              drugData: { ...drug, dosageAmount: dosage, instructions } 
            })}
          >
            <Text style={styles.primaryBtnText}>Continue to Slot Mapping</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    color: '#64748B',
    paddingRight: 12,
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
});
