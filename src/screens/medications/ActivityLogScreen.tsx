import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';

export default function ActivityLogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { adherenceLogs, activityLogs } = useMedication();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Taken' | 'Admin'>('All');

  // Consolidate and filter activities
  const allActivities = [
    ...(adherenceLogs || []),
    ...(activityLogs || [])
  ]
  .filter(log => {
    // Search filter
    const matchesSearch = log.medName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.slot?.toString().includes(searchQuery);
    
    // Type filter
    if (filter === 'Taken') return matchesSearch && log.type === 'taken';
    if (filter === 'Admin') return matchesSearch && log.type !== 'taken';
    return matchesSearch;
  })
  .sort((a, b) => b.timestamp - a.timestamp);

  const getActivityConfig = (type: string) => {
    switch (type) {
      case 'taken': return { icon: 'checkmark-circle', color: '#10B981', action: 'taken' };
      case 'created': return { icon: 'add-circle', color: '#0463DD', action: 'added' };
      case 'edited': return { icon: 'create', color: '#6366F1', action: 'updated' };
      case 'deleted': return { icon: 'trash', color: '#EF4444', action: 'unlinked' };
      default: return { icon: 'information-circle', color: '#64748B', action: 'activity' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity History</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search medication or slot..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          {(['All', 'Taken', 'Admin'] as const).map((f) => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.timeline}>
          {allActivities.length > 0 ? (
            allActivities.map((log, index) => {
              const config = getActivityConfig(log.type);
              return (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityIconContainer, { backgroundColor: config.color + '1A' }]}>
                    <Ionicons name={config.icon as any} size={20} color={config.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTitle} numberOfLines={1}>
                        {log.medName} <Text style={{ color: config.color }}>{config.action}</Text>
                      </Text>
                      <Text style={styles.activityTime}>{log.time}</Text>
                    </View>
                    <Text style={styles.activityMeta}>Slot {log.slot} • {log.date}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyActivity}>
              <Ionicons name="search-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyActivityText}>No activities match your filters.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  searchFilterContainer: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    gap: 16,
    borderBottomWidth:1,
    borderBottomColor: '#F8FAFC',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#0463DD',
    borderColor: '#0463DD',
  },
  filterText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  timeline: {
    paddingHorizontal: 24,
    gap: 24,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  activityTime: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#94A3B8',
  },
  activityMeta: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#64748B',
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyActivityText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#94A3B8',
  },
});
