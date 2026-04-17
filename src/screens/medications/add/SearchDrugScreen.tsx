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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const MOCK_EMDEX_DRUGS = [
  { id: '1', name: 'Metformin', dosage: '500mg', type: 'Tablet' },
  { id: '2', name: 'Amlodipine Besylate', dosage: '5mg', type: 'Tablet' },
  { id: '3', name: 'Lisinopril', dosage: '10mg', type: 'Tablet' },
  { id: '4', name: 'Panadol Extra', dosage: '500mg', type: 'Caplet' },
  { id: '5', name: 'Vitamin C (Ascorbic Acid)', dosage: '100mg', type: 'Tablet' },
  { id: '6', name: 'Atorvastatin', dosage: '20mg', type: 'Tablet' },
  { id: '7', name: 'Omeprazole Magnesium', dosage: '20mg', type: 'Capsule' },
  { id: '8', name: 'Amoxicillin Trihydrate', dosage: '500mg', type: 'Capsule' },
];

export default function SearchDrugScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { isEditing, editMed } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(MOCK_EMDEX_DRUGS);

  React.useEffect(() => {
    if (isEditing && editMed) {
      navigation.replace('DrugDetail', { 
        drug: editMed, 
        isEditing: true,
        editMed: editMed 
      });
    }
  }, [isEditing, editMed]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = MOCK_EMDEX_DRUGS.filter(d => 
        d.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(MOCK_EMDEX_DRUGS);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Step 1 of 5</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>What medication are you adding?</Text>
          <Text style={styles.subtitle}>Search the EMDEX database for accurate drug info.</Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search drug name (e.g. Metformin)"
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>

          <FlatList 
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.drugItem}
                onPress={() => {
                  const { id, ...drugData } = item;
                  navigation.navigate('DrugDetail', { 
                    drug: drugData,
                    isEditing,
                    editMed,
                    slot: route.params?.slot // Forward the intent
                  });
                }}
              >
                <View style={styles.drugIconContainer}>
                  <Ionicons name="medical" size={20} color="#0463DD" />
                </View>
                <View style={styles.drugInfo}>
                  <Text style={styles.drugName}>{item.name}</Text>
                  <Text style={styles.drugMeta}>{item.type} • {item.dosage}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContent}>
                <Ionicons name="search-outline" size={48} color="#E2E8F0" />
                <Text style={styles.emptyText}>No drugs found for "{searchQuery}"</Text>
                <TouchableOpacity style={styles.manualBtn} onPress={() => {
                   navigation.navigate('DrugDetail', { 
                     drug: null, 
                     isEditing: false,
                     slot: route.params?.slot // Forward the intent
                   });
                }}>
                   <Text style={styles.manualText}>Add drug manually</Text>
                </TouchableOpacity>
              </View>
            }
          />
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
  closeBtn: {
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
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
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
  listContent: {
    paddingBottom: 40,
  },
  drugItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  drugIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  drugInfo: {
    flex: 1,
  },
  drugName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  drugMeta: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: '#64748B',
  },
  emptyContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    textAlign: 'center',
  },
  manualBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
  },
  manualText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0463DD',
  },
});
