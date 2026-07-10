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
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F59E0B' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Grey', hex: '#9CA3AF' },
];

export default function DrugDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { drug, isEditing, editMed } = route.params || { 
    drug: { name: 'Metformin', brand: 'Glucophage', strength: '500mg', type: 'Tablet', nafdac: 'NAFDAC 02-4567' } 
  };

  const getAllowedShapes = (): ('Tablet' | 'Capsule' | 'Liquid' | 'Injection')[] => {
    const dbType = drug.type?.toLowerCase() || '';
    if (dbType.includes('tablet') || dbType.includes('caplet')) {
      return ['Tablet'];
    }
    if (dbType.includes('capsule')) {
      return ['Capsule'];
    }
    if (dbType.includes('liquid') || dbType.includes('syrup')) {
      return ['Liquid'];
    }
    if (dbType.includes('injection') || dbType.includes('vial') || dbType.includes('ampoule')) {
      return ['Injection'];
    }
    return ['Tablet', 'Capsule', 'Liquid', 'Injection'];
  };

  const allowedShapes = getAllowedShapes();

  const [formFactor, setFormFactor] = useState<'Tablet' | 'Capsule' | 'Liquid' | 'Injection'>(
    editMed?.formFactor && allowedShapes.includes(editMed.formFactor)
      ? editMed.formFactor
      : allowedShapes[0]
  );
  const [selectedColor, setSelectedColor] = useState<string>(editMed?.pillColor || COLORS[4].hex);
  const [notes, setNotes] = useState(editMed?.instructions || '');

  const renderPillPreview = () => {
    switch (formFactor) {
      case 'Capsule':
        return (
          <View style={styles.previewCapsuleContainer}>
            <View style={[styles.capsuleHalf, { backgroundColor: selectedColor }]} />
            <View style={[styles.capsuleHalf, styles.capsuleWhite]} />
          </View>
        );
      case 'Liquid':
        return (
          <View style={styles.previewLiquidContainer}>
            <Ionicons name="flask-outline" size={72} color={selectedColor} />
          </View>
        );
      case 'Injection':
        return (
          <View style={styles.previewLiquidContainer}>
            <Ionicons name="eyedropper-outline" size={72} color={selectedColor} />
          </View>
        );
      default: // Tablet
        return (
          <View style={[styles.previewTablet, { backgroundColor: selectedColor }]}>
            <View style={styles.tabletScoreLine} />
          </View>
        );
    }
  };

  const handleNext = () => {
    navigation.navigate('Schedule', {
      drugData: {
        ...drug,
        formFactor,
        pillColor: selectedColor,
        instructions: notes,
      },
      isEditing,
      editMed,
      slot: route.params?.slot
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Pill Match</Text>
            <Text style={styles.headerStep}>Step 2 of 3</Text>
          </View>
          <View style={styles.navPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>What does it look like?</Text>
          <Text style={styles.subtitle}>
            Select the shape and color to help caregivers identify the pill.
          </Text>

          {/* Live Pill Preview Panel */}
          <View style={styles.previewPanel}>
            {renderPillPreview()}
            <Text style={styles.previewLabel}>{formFactor} Preview</Text>
          </View>

          {/* Form Factor Selector */}
          <Text style={styles.sectionLabel}>Pill Shape</Text>
          <View style={styles.formSelectorRow}>
            {(['Tablet', 'Capsule', 'Liquid', 'Injection'] as const).map(form => {
              const isAllowed = allowedShapes.includes(form);
              return (
                <TouchableOpacity
                  key={form}
                  style={[
                    styles.formTab,
                    formFactor === form && styles.formTabActive,
                    !isAllowed && styles.formTabDisabled
                  ]}
                  onPress={() => setFormFactor(form)}
                  disabled={!isAllowed}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.formTabText,
                    formFactor === form && styles.formTabTextActive,
                    !isAllowed && styles.formTabTextDisabled
                  ]}>
                    {form}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Color Selection Grid */}
          <Text style={styles.sectionLabel}>Pill Color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.hex },
                  selectedColor === color.hex && styles.colorCircleActive
                ]}
                onPress={() => setSelectedColor(color.hex)}
                activeOpacity={0.8}
              >
                {selectedColor === color.hex && (
                  <Feather 
                    name="check" 
                    size={16} 
                    color={color.name === 'Yellow' || color.name === 'Grey' ? '#000000' : '#FFFFFF'} 
                    strokeWidth={3} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Intake Note Input */}
          <Text style={styles.sectionLabel}>Caregiver Notes</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="e.g. Do not crush. Take with milk after breakfast."
            placeholderTextColor="rgba(4,9,33,0.3)"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Next: Schedule & Dosing</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
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
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  headerStep: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#0463DD',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    color: 'rgba(4,9,33,0.5)',
    lineHeight: 20,
    marginBottom: 20,
  },
  previewPanel: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    height: 170,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.04)',
  },
  previewLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  previewTablet: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletScoreLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  previewCapsuleContainer: {
    width: 42,
    height: 84,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.1)',
    overflow: 'hidden',
  },
  capsuleHalf: {
    flex: 1,
  },
  capsuleWhite: {
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderTopColor: 'rgba(4,9,33,0.06)',
  },
  previewLiquidContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.6)',
    marginBottom: 10,
    marginTop: 8,
  },
  formSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
    width: '100%',
  },
  formTab: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTabActive: {
    backgroundColor: '#0463DD',
  },
  formTabDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.5,
  },
  formTabText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  formTabActiveText: {
    color: '#FFFFFF',
  },
  formTabTextActive: {
    color: '#FFFFFF',
  },
  formTabTextDisabled: {
    color: '#9CA3AF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: '#0463DD',
    transform: [{ scale: 1.08 }],
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    borderRadius: 16,
    padding: 16,
    height: 100,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  primaryBtn: {
    backgroundColor: '#0463DD',
    width: '100%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
