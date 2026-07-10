import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication, DoseLog } from '../../context/MedicationContext';

export default function ProofOfLifeFeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { doseLogs } = useMedication();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Photo' | 'Missed'>('All');

  const filteredLogs = doseLogs.filter(log => {
    if (activeFilter === 'Photo') return log.photoVerified;
    if (activeFilter === 'Missed') return log.outcome === 'missed';
    return true;
  });

  const getBadgeStyle = (log: DoseLog) => {
    if (log.outcome === 'missed') {
      return { bg: 'rgba(239, 68, 68, 0.08)', text: '#FF6F61', label: 'Missed ✗' };
    }
    if (log.verificationMethod === 'photo_ai') {
      return { bg: 'rgba(16, 185, 129, 0.08)', text: '#10B981', label: 'WhatsApp Photo ✓' };
    }
    return { bg: 'rgba(4, 99, 221, 0.08)', text: '#06565F', label: 'Caregiver Manual' };
  };

  const formatLogTime = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let day = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (date.toDateString() === today.toDateString()) {
      day = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      day = 'Yesterday';
    }

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${time}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Proof of Life Feed</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AdherenceHistory')}
            style={styles.historyBtn}
          >
            <Feather name="calendar" size={20} color="#06565F" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['All', 'Photo', 'Missed'] as const).map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter === 'Photo' ? 'Photo Only' : filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chronological List */}
        <ScrollView 
          style={styles.feedScroll}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => {
              const badge = getBadgeStyle(log);
              return (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.statusIndicator, { backgroundColor: log.outcome === 'missed' ? '#FF6F61' : '#10B981' }]}>
                        <Feather 
                          name={log.outcome === 'missed' ? "x" : "check"} 
                          size={12} 
                          color="#FFFFFF" 
                          strokeWidth={3} 
                        />
                      </View>
                      <View>
                        <Text style={styles.medTitle}>
                          {log.medName} - {log.outcome === 'taken' ? 'taken' : 'missed'}
                        </Text>
                        <Text style={styles.logTimestamp}>{formatLogTime(log.loggedAt)}</Text>
                      </View>
                    </View>
                    
                    {/* Verification Badge */}
                    <View style={[styles.badgeContainer, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.logNotes}>{log.notes}</Text>

                  {/* NDPR compliance footer */}
                  {log.ndprEncrypted && (
                    <View style={styles.ndprFooter}>
                      <Ionicons name="lock-closed" size={12} color="#10B981" />
                      <Text style={styles.ndprText}>Encrypted under NDPR compliance</Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="list" size={40} color="rgba(4,9,33,0.2)" />
              <Text style={styles.emptyText}>No matching logs found in this feed.</Text>
            </View>
          )}
        </ScrollView>
      </View>
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
    maxWidth: 393,
    width: '100%',
    alignSelf: 'center',
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
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#06565F',
    borderColor: '#06565F',
  },
  filterText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.5)',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  feedScroll: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#0F172A',
  },
  logTimestamp: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -2,
  },
  badgeContainer: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
  },
  logNotes: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginLeft: 36,
  },
  ndprFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    marginLeft: 36,
  },
  ndprText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#10B981',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.4)',
  },
});
