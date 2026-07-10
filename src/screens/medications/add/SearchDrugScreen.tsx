import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const MOCK_EMDEX_DRUGS = [
  { id: '1', name: 'Metformin', brand: 'Glucophage', strength: '500mg', type: 'Tablet', nafdac: 'NAFDAC 02-4567' },
  { id: '2', name: 'Amlodipine Besylate', brand: 'Norvasc', strength: '5mg', type: 'Tablet', nafdac: 'NAFDAC 04-1234' },
  { id: '3', name: 'Lisinopril', brand: 'Zestril', strength: '10mg', type: 'Tablet', nafdac: 'NAFDAC 04-9871' },
  { id: '4', name: 'Panadol Extra', brand: 'Panadol', strength: '500mg', type: 'Caplet', nafdac: 'NAFDAC 01-5678' },
  { id: '5', name: 'Vitamin C (Ascorbic Acid)', brand: 'Redoxon', strength: '1000mg', type: 'Tablet', nafdac: 'NAFDAC 05-4421' },
  { id: '6', name: 'Atorvastatin', brand: 'Lipitor', strength: '20mg', type: 'Tablet', nafdac: 'NAFDAC 03-8821' },
  { id: '7', name: 'Omeprazole Magnesium', brand: 'Losec', strength: '20mg', type: 'Capsule', nafdac: 'NAFDAC 02-1144' },
  { id: '8', name: 'Amoxicillin Trihydrate', brand: 'Amoxil', strength: '500mg', type: 'Capsule', nafdac: 'NAFDAC 01-0988' },
];

export default function SearchDrugScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { isEditing, editMed } = route.params || {};

  const [activeMode, setActiveMode] = useState<'Search Database' | 'Scan Rx' | 'Voice'>('Search Database');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_EMDEX_DRUGS>([]);
  const [selectedDrug, setSelectedDrug] = useState<typeof MOCK_EMDEX_DRUGS[0] | null>(null);

  React.useEffect(() => {
    if (isEditing && editMed) {
      const matched = MOCK_EMDEX_DRUGS.find(d => d.name.toLowerCase().includes(editMed.name.toLowerCase())) || {
        id: 'custom',
        name: editMed.name,
        brand: editMed.brand || 'Generic',
        strength: editMed.dosage || '500mg',
        type: editMed.formFactor || 'Tablet',
        nafdac: 'NAFDAC Verified'
      };
      setSelectedDrug(matched);
    }
  }, [isEditing, editMed]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setSelectedDrug(null);
    if (text.length > 0) {
      const filtered = MOCK_EMDEX_DRUGS.filter(d => 
        d.name.toLowerCase().includes(text.toLowerCase()) || 
        d.brand.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleNext = () => {
    if (!selectedDrug) return;
    navigation.navigate('DrugDetail', {
      drug: selectedDrug,
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Feather name="x" size={22} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Add Medication</Text>
            <Text style={styles.headerStep}>Step 1 of 3</Text>
          </View>
          <View style={styles.navPlaceholder} />
        </View>

        {/* Mode Selector Tabs */}
        <View style={styles.modeContainer}>
          {(['Search Database', 'Scan Rx', 'Voice'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeTab, activeMode === mode && styles.modeTabActive]}
              onPress={() => {
                setActiveMode(mode);
                if (mode !== 'Search Database') {
                  Alert.alert(`${mode} Mode`, `${mode} parsing is in simulation mode. Please use search database.`);
                  setActiveMode('Search Database');
                }
              }}
            >
              <Text style={[styles.modeText, activeMode === mode && styles.modeTextActive]}>
                {mode === 'Search Database' ? 'Search' : mode === 'Scan Rx' ? 'Scan Rx' : 'Voice'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>What medicine are you adding?</Text>
          <Text style={styles.subtitle}>Search our database to confirm the drug info.</Text>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="rgba(4,9,33,0.4)" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search medicine (e.g. Metformin)"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="rgba(4,9,33,0.4)"
            />
          </View>

          {/* Autocomplete list */}
          {searchQuery.length > 0 && !selectedDrug && (
            <FlatList 
              data={results}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.drugItem}
                  onPress={() => {
                    setSelectedDrug(item);
                    setSearchQuery('');
                  }}
                >
                  <View>
                    <Text style={styles.drugItemName}>{item.name}</Text>
                    <Text style={styles.drugItemSub}>
                      Brand: {item.brand} • {item.nafdac}
                    </Text>
                  </View>
                  <Feather name="plus-circle" size={20} color="#06565F" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyResults}>
                  <Text style={styles.emptyResultsText}>No medicines found.</Text>
                </View>
              }
            />
          )}

          {/* Selection Confirmation Box */}
          {selectedDrug && (
            <View style={styles.confirmationBox}>
              <View style={styles.confHeader}>
                <View style={styles.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified Match</Text>
                </View>
              </View>
              <View style={styles.confDetails}>
                <Text style={styles.confName}>{selectedDrug.name}</Text>
                <Text style={styles.confSub}>
                  Brand: {selectedDrug.brand} • {selectedDrug.strength}
                </Text>
                <Text style={styles.confNafdac}>{selectedDrug.nafdac}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedDrug && styles.disabledBtn]}
            disabled={!selectedDrug}
            onPress={handleNext}
          >
            <Text style={[styles.btnText, !selectedDrug && styles.disabledBtnText]}>
              Next: Visual Pill Mapping
            </Text>
            <Feather name="arrow-right" size={20} color={selectedDrug ? '#FFFFFF' : '#9CA3AF'} strokeWidth={3} />
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
  closeBtn: {
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
    color: '#06565F',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  modeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabActive: {
    backgroundColor: '#E6F3F4',
    borderWidth: 1,
    borderColor: '#06565F',
  },
  modeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  modeTextActive: {
    color: '#06565F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  list: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
  },
  drugItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drugItemName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.76)',
  },
  drugItemSub: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: 2,
  },
  emptyResults: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyResultsText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
  },
  confirmationBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  confHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: '#10B981',
  },
  confDetails: {
    gap: 2,
  },
  confName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  confSub: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
  },
  confNafdac: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  primaryBtn: {
    backgroundColor: '#06565F',
    width: '100%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledBtn: {
    backgroundColor: '#E5E7EB',
  },
  btnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  disabledBtnText: {
    color: '#9CA3AF',
  },
});
