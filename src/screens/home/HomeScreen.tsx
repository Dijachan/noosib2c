import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BottomNav from '../../components/navigation/BottomNav';
import { useMedication, Medication } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';
import MedicationDetailModal from '../../components/medications/MedicationDetailModal';
import DeleteConfirmationModal from '../../components/medications/DeleteConfirmationModal';
import CustomAlertModal from '../../components/medications/CustomAlertModal';
import MiniPillVector from '../../components/medications/MiniPillVector';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { 
    medicationList, 
    deleteMedication,
    toggleMedicationStatus 
  } = useMedication();
  
  const { 
    user, 
    patientProfile, 
    alertActive, 
    isOffline,
    setIsOffline,
    offlineQueue,
    setOfflineQueue,
    demoPatientId,
    demoDeviceId 
  } = useAuth();

  const isCaregiver = user?.user_metadata?.role === 'caregiver';

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showAlert = (
    title: string, 
    message: string, 
    onConfirm?: () => void, 
    confirmText = 'OK', 
    onCancel?: () => void, 
    cancelText?: string
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onCancel) onCancel();
      }
    });
  };

  // Caregiver Dashboard Vitals Form States
  const [isVitalsModalVisible, setIsVitalsModalVisible] = useState(false);
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [painLevel, setPainLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [isSavingVitals, setIsSavingVitals] = useState(false);

  // Live clocks for London (Admin) and Lagos (Patient)
  const [clocks, setClocks] = useState({ admin: '', patient: '' });

  useEffect(() => {
    const updateTimes = () => {
      try {
        const adminTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Europe/London',
          timeZoneName: 'short'
        }).format(new Date());

        const patientTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Africa/Lagos',
          timeZoneName: 'short'
        }).format(new Date());

        setClocks({ admin: adminTime, patient: patientTime });
      } catch (e) {
        const fallback = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        setClocks({ admin: `${fallback} BST`, patient: `${fallback} WAT` });
      }
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const adminName = user?.user_metadata?.full_name?.split(' ')[0] || 'Dija';
  const patientName = patientProfile?.name || 'Grandpa Kunle';

  const getMockStock = (medName: string) => {
    if (medName.toLowerCase().includes('metformin')) return 6;
    if (medName.toLowerCase().includes('lisinopril')) return 18;
    return 24;
  };

  const lowStockMed = medicationList.find(med => getMockStock(med.name) <= 6);

  const handleMedPress = (id: string) => {
    const med = medicationList.find(m => m.id === id);
    if (med) {
      setSelectedMed(med);
      setIsModalVisible(true);
    }
  };

  const handleEditMed = (med: Medication) => {
    setIsModalVisible(false);
    navigation.navigate('SearchDrug', { 
      editMed: med,
      isEditing: true
    });
  };

  const handleDeleteMed = (med: Medication) => {
    setSelectedMed(med);
    setIsModalVisible(false);
    setTimeout(() => {
      setIsDeleteModalVisible(true);
    }, 100);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 100);
  };

  const confirmDelete = async () => {
    if (selectedMed) {
      try {
        await deleteMedication(selectedMed.id);
        setIsDeleteModalVisible(false);
        setIsModalVisible(false);
      } catch (error) {
        showAlert('Error', 'Failed to delete medication.');
      }
    }
  };

  const handleRefill = (medName: string) => {
    showAlert(
      'Authorize Refill',
      `Would you like to authorize a 30-day refill for ${medName}? Order details will be sent to the pharmacy hub.`,
      () => {
        setTimeout(() => {
          showAlert('Refill Ordered', 'Refill order successfully transmitted!');
        }, 300);
      },
      'Refill Now',
      () => {},
      'Cancel'
    );
  };

  const handleChatAI = () => {
    showAlert(
      '🤖 Noosi AI',
      'Noosi AI Assistant is preparing to chat. This feature is coming soon in the production release!'
    );
  };

  // Caregiver Checklist Logging
  const handleCheckDose = async (med: Medication) => {
    const newStatus = med.status === 'Taken' ? 'Pending' : 'Taken';
    
    if (isOffline) {
      const queueMsg = `Checked ${med.name} (${newStatus}) at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      setOfflineQueue([...offlineQueue, queueMsg]);
      toggleMedicationStatus(med.id, newStatus);
      showAlert('Offline Logging', 'Dose logged offline. Action saved to queue.');
    } else {
      try {
        toggleMedicationStatus(med.id, newStatus);
        
        await supabase.from('adherence_logs').insert({
          device_id: demoDeviceId,
          medication_id: med.id,
          status: newStatus,
          captured_at: new Date().toISOString()
        });

        await supabase.from('activity_logs').insert({
          device_id: demoDeviceId,
          medication_name: med.name,
          slot_number: med.slot,
          action_type: 'taken',
          performed_at: new Date().toISOString()
        });

        showAlert('Sync Successful', `${med.name} status updated and synchronized.`);
      } catch (err) {
        console.error('Logging Sync Error:', err);
        showAlert('Sync Error', 'Failed to synchronize with server.');
      }
    }
  };

  // Caregiver Offline Toggle switch
  const handleOfflineToggle = (value: boolean) => {
    setIsOffline(value);
    if (!value && offlineQueue.length > 0) {
      handleForceSync();
    }
  };

  // Force Sync local queue
  const handleForceSync = () => {
    if (offlineQueue.length === 0) return;
    
    showAlert(
      'Synchronize Queue',
      `Ready to synchronize ${offlineQueue.length} pending actions to Noosi cloud?`,
      () => {
        setOfflineQueue([]);
        setTimeout(() => {
          showAlert('Sync Successful', 'All offline logs successfully synchronized!');
        }, 300);
      },
      'Sync Now',
      () => {},
      'Cancel'
    );
  };

  // Caregiver Vitals Logger
  const handleSaveVitals = async () => {
    if (!bp.trim() && !temp.trim() && !weight.trim()) {
      showAlert('Empty Form', 'Please enter at least one vital reading.');
      return;
    }
    
    setIsSavingVitals(true);

    const bpVal = bp.trim() || '120/80';
    const tempVal = temp.trim() || '36.6';
    const wtVal = weight.trim() || '70';

    setTimeout(async () => {
      setIsSavingVitals(false);
      setIsVitalsModalVisible(false);

      if (isOffline) {
        const queueMsg = `Logged vitals (BP: ${bpVal}, Temp: ${tempVal}°C) at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setOfflineQueue([...offlineQueue, queueMsg]);
        setTimeout(() => {
          showAlert('Offline Logging', 'Vitals logged offline. Action saved to queue.');
        }, 300);
      } else {
        try {
          await supabase.from('vital_logs').insert({
            patient_id: demoPatientId,
            vital_type: 'temperature',
            value: parseFloat(tempVal),
            captured_at: new Date().toISOString()
          });

          await supabase.from('vital_logs').insert({
            patient_id: demoPatientId,
            vital_type: 'blood_pressure',
            value: parseFloat(bpVal.split('/')[0]) || 120,
            captured_at: new Date().toISOString()
          });

          setTimeout(() => {
            showAlert('Sync Successful', 'Vitals uploaded to patient dashboard.');
          }, 300);
        } catch (err) {
          console.error('Vitals Upload Error:', err);
          setTimeout(() => {
            showAlert('Sync Error', 'Failed to upload vitals.');
          }, 300);
        }
      }

      setBp('');
      setTemp('');
      setWeight('');
      setPainLevel('Low');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* DYNAMIC RENDERING: CAREGIVER DASHBOARD */}
        {isCaregiver ? (
          <View style={{ flex: 1 }}>
            {/* Caregiver Header Panel */}
            <View style={styles.caregiverHeader}>
              <View>
                <Text style={styles.headerTitle}>Caregiver Dashboard</Text>
                <Text style={styles.headerSubtitle}>Patient: {patientName}</Text>
              </View>
              <View style={styles.offlineToggleRow}>
                <Text style={[styles.offlineToggleLabel, isOffline && styles.offlineActiveText]}>
                  {isOffline ? 'Offline' : 'Online'}
                </Text>
                <Switch
                  value={isOffline}
                  onValueChange={handleOfflineToggle}
                  trackColor={{ false: '#D1D5DB', true: '#F59E0B' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>

            {/* Offline Sync Banner */}
            {isOffline && (
              <TouchableOpacity 
                style={styles.offlineBanner}
                onPress={handleForceSync}
                activeOpacity={0.9}
              >
                <View style={styles.bannerLeft}>
                  <Feather name="wifi-off" size={18} color="#D97706" />
                  <Text style={styles.bannerText}>
                    ⚠️ Local Logs Queue: {offlineQueue.length} actions pending
                  </Text>
                </View>
                {offlineQueue.length > 0 && (
                  <View style={styles.syncChip}>
                    <Text style={styles.syncChipText}>Sync Now</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Log Vitals Card */}
              <TouchableOpacity 
                style={styles.vitalsCard}
                onPress={() => setIsVitalsModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.vitalsLeft}>
                  <View style={styles.vitalsIconContainer}>
                    <Ionicons name="activity" size={24} color="#0463DD" />
                  </View>
                  <View>
                    <Text style={styles.vitalsTitle}>Log Vitals Shortcut</Text>
                    <Text style={styles.vitalsSubtitle}>Record BP, Temp, Weight, Pain</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(4,9,33,0.3)" />
              </TouchableOpacity>

              {/* Today's Checklist */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Schedule</Text>
              </View>

              <View style={styles.medList}>
                {medicationList.length > 0 ? (
                  medicationList.map((med) => {
                    const isTaken = med.status === 'Taken';
                    return (
                      <View key={med.id} style={[styles.medCard, isTaken && styles.medCardTaken]}>
                        <View style={styles.medInfo}>
                          <View style={styles.pillIconContainer}>
                            <MiniPillVector 
                              formFactor={med.formFactor || 'Tablet'} 
                              pillColor={med.pillColor || '#3B82F6'} 
                            />
                          </View>
                          <View style={styles.medTextGroup}>
                            <Text style={styles.medName} numberOfLines={1}>{med.name}</Text>
                            <Text style={styles.medDetails}>
                              Slot {med.slot} • Due at {med.time}
                            </Text>
                            <Text style={styles.medInstructions} numberOfLines={1}>
                              {med.instructions || 'Take with water'}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity 
                          style={[styles.checkCircle, isTaken && styles.checkCircleActive]}
                          onPress={() => navigation.navigate('LogDoseQuick', { medId: med.id })}
                          activeOpacity={0.8}
                        >
                          {isTaken ? (
                            <Feather name="check" size={16} color="#FFFFFF" strokeWidth={3} />
                          ) : (
                            <Feather name="check" size={16} color="#9CA3AF" strokeWidth={2} />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyContainer}>
                    <Feather name="clipboard" size={32} color="rgba(4,9,33,0.2)" />
                    <Text style={styles.emptyText}>No medications scheduled.</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.fab}
              onPress={() => navigation.navigate('LogDoseQuick')}
              activeOpacity={0.8}
            >
              <Feather name="check" size={24} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        ) : (
          
          /* DYNAMIC RENDERING: ADMIN / COMMAND CENTRE */
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Panel */}
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.greetingText}>Good morning, {adminName}! 🌱</Text>
                <View style={styles.monitoringBadge}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&q=80&w=100' }}
                    style={styles.patientAvatar}
                  />
                  <Text style={styles.monitoringText}>Caring for {patientName} ❤️</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.hubActionBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={26} color="#0463DD" />
                {alertActive && <View style={styles.hubBadge} />}
              </TouchableOpacity>
            </View>

            {/* Timezone Indicator Card */}
            <View style={styles.timezoneIndicatorCard}>
              <View style={styles.timezoneRow}>
                <Feather name="home" size={12} color="#0463DD" />
                <Text style={styles.timezoneText} numberOfLines={1}>YOU: {clocks.admin}</Text>
              </View>
              <View style={styles.timezoneRow}>
                <Feather name="heart" size={12} color="#10B981" />
                <Text style={styles.timezoneText} numberOfLines={1}>{patientName.split(' ')[0].toUpperCase()}: {clocks.patient}</Text>
              </View>
            </View>

            {/* Adherence Summary Card */}
            <TouchableOpacity 
              style={styles.summaryCard}
              onPress={() => navigation.navigate('AdherenceHistory')}
              activeOpacity={0.9}
            >
              <View style={styles.summaryTextSection}>
                <Text style={styles.summaryLabel}>TODAY'S ADHERENCE RATE</Text>
                <Text style={styles.summaryValue}>94%</Text>
                <Text style={styles.summarySublabel}>Last synced: 2 min ago</Text>
              </View>
              <View style={styles.summaryChartSection}>
                <View style={styles.chartCircle}>
                  <Ionicons name="trending-up" size={32} color="#0463DD" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Proof of Life Feed Quick CTA */}
            <TouchableOpacity 
              style={styles.adminFeedBtn}
              onPress={() => navigation.navigate('ProofOfLifeFeed')}
              activeOpacity={0.8}
            >
              <View style={styles.adminFeedLeft}>
                <Feather name="shield" size={18} color="#8B5CF6" />
                <Text style={styles.adminFeedText}>View Proof of Life Feed</Text>
              </View>
              <Feather name="chevron-right" size={18} color="rgba(4,9,33,0.3)" />
            </TouchableOpacity>

            {/* Critical Missed Dose Banner (Conditional) */}
            {alertActive && (
              <TouchableOpacity 
                style={styles.criticalBanner}
                onPress={() => navigation.navigate('Notifications')}
                activeOpacity={0.9}
              >
                <View style={styles.criticalLeft}>
                  <Feather name="alert-triangle" size={20} color="#FFFFFF" />
                  <Text style={styles.criticalText}>
                    CRITICAL ALERT: {patientName} missed 8 AM Dose!
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* Low Stock Refill Banner (Conditional) */}
            {lowStockMed && (
              <View style={styles.refillBanner}>
                <View style={styles.refillLeft}>
                  <Feather name="archive" size={18} color="#D97706" />
                  <Text style={styles.refillText}>
                    {lowStockMed.name} is running low ({getMockStock(lowStockMed.name)} tablets left)
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.refillChip}
                  onPress={() => handleRefill(lowStockMed.name)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.refillChipText}>Refill</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Today's Dose Schedule Strip */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CareSchedule')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.scheduleStrip}
              style={styles.horizontalScroll}
            >
              {medicationList.length > 0 ? (
                medicationList.map((med) => {
                  const stock = getMockStock(med.name);
                  const isTaken = med.status === 'Taken';
                  return (
                    <TouchableOpacity 
                      key={med.id} 
                      style={[
                        styles.stripCard, 
                        isTaken ? styles.stripCardTaken : styles.stripCardPending
                      ]}
                      onPress={() => handleMedPress(med.id)}
                      activeOpacity={0.8}
                    >
                      <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <Text style={styles.stripMedName} numberOfLines={1}>
                          {med.name}
                        </Text>
                        
                        <View style={styles.stripCardBottom}>
                          <Text style={styles.stripStock}>{stock} pills left</Text>
                          
                          <View style={styles.stripTimeRow}>
                            <Feather 
                              name={isTaken ? "check-circle" : "clock"} 
                              size={12} 
                              color={isTaken ? '#10B981' : '#0463DD'} 
                            />
                            <Text style={[
                              styles.stripTimeText,
                              isTaken ? styles.stripTimeTextTaken : styles.stripTimeTextPending
                            ]}>
                              {med.time.split('-')[0].trim()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptyStrip}>
                  <Text style={styles.emptyStripText}>No medications scheduled.</Text>
                </View>
              )}
            </ScrollView>

            {/* Quick Actions Grid */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => navigation.navigate('SearchDrug')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(4,99,221,0.08)' }]}>
                  <Feather name="plus" size={20} color="#0463DD" />
                </View>
                <Text style={styles.actionLabel}>Add Med</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => navigation.navigate('InviteCaregiver')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(16,185,129,0.08)' }]}>
                  <Feather name="users" size={20} color="#10B981" />
                </View>
                <Text style={styles.actionLabel}>Invite Care</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => navigation.navigate('AIChat')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(139,92,246,0.08)' }]}>
                  <Feather name="message-square" size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.actionLabel}>Chat AI</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.actionsGrid, { marginTop: -8 }]}>
              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => navigation.navigate('PrescriptionScanner')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(236,72,153,0.08)' }]}>
                  <Feather name="camera" size={20} color="#EC4899" />
                </View>
                <Text style={styles.actionLabel}>Scan Rx</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => navigation.navigate('VoiceCommand')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
                  <Feather name="mic" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.actionLabel}>Voice Cmd</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem} 
                onPress={() => navigation.navigate('AIInsights')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(59,130,246,0.08)' }]}>
                  <Feather name="bar-chart-2" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.actionLabel}>Insights</Text>
              </TouchableOpacity>
            </View>

            {/* Activity Feed */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activity Feed</Text>
            </View>

            <View style={styles.feedContainer}>
              <View style={styles.feedItem}>
                <View style={[styles.feedIconContainer, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                  <Feather name="check" size={16} color="#10B981" />
                </View>
                <View style={styles.feedContent}>
                  <Text style={styles.feedTime}>1:30 PM</Text>
                  <Text style={styles.feedDescription}>
                    <Text style={styles.boldText}>Lisinopril Taken</Text> (Logged by Nurse Temi. Photo proof verified via AI).
                  </Text>
                </View>
              </View>

              <View style={styles.feedItem}>
                <View style={[styles.feedIconContainer, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                  <Feather name="alert-triangle" size={16} color="#EF4444" />
                </View>
                <View style={styles.feedContent}>
                  <Text style={styles.feedTime}>8:00 AM</Text>
                  <Text style={styles.feedDescription}>
                    <Text style={styles.boldText}>Metformin Missed</Text> (Escalated to Voice Call. Elder acknowledged but did not take).
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      <BottomNav activeTab="Home" />

      <MedicationDetailModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        medication={selectedMed}
        onEdit={handleEditMed}
        onDelete={handleDeleteMed}
      />

      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        medName={selectedMed?.name || ''}
        slot={selectedMed?.slot.toString() || ''}
      />

      <CustomAlertModal
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />

      {/* Caregiver Vitals Modal */}
      <Modal
        visible={isVitalsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVitalsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Vitals</Text>
              <TouchableOpacity onPress={() => setIsVitalsModalVisible(false)}>
                <Feather name="x" size={24} color="rgba(4,9,33,0.6)" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm} keyboardShouldPersistTaps="handled">
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Blood Pressure (mmHg)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 120/80"
                  keyboardType="numbers-and-punctuation"
                  value={bp}
                  onChangeText={setBp}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Body Temperature (°C)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 36.8"
                  keyboardType="numeric"
                  value={temp}
                  onChangeText={setTemp}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 72"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Pain Level</Text>
                <View style={styles.pillContainer}>
                  {(['Low', 'Medium', 'High'] as const).map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.painPill,
                        painLevel === level && styles.painPillActive
                      ]}
                      onPress={() => setPainLevel(level)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.painPillText,
                        painLevel === level && styles.painPillTextActive
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleSaveVitals}
                disabled={isSavingVitals}
              >
                {isSavingVitals ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Save Vitals</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  adminFeedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  adminFeedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminFeedText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.76)',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 12,
    width: '100%',
  },
  greetingText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 26,
    color: '#0F172A',
  },
  monitoringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4, 99, 221, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 8,
  },
  patientAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  monitoringText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: '#0463DD',
  },
  hubActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4, 99, 221, 0.08)',
    position: 'relative',
  },
  hubBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  timezoneIndicatorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
  },
  timezoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
    flex: 0.48,
  },
  timezoneText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 11,
    color: 'rgba(4,9,33,0.5)',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTextSection: {
    flex: 1,
  },
  summaryLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 32,
    color: '#040921',
  },
  summarySublabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#0463DD',
    marginTop: 2,
  },
  summaryChartSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  criticalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  criticalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  criticalText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: '#FFFFFF',
    flex: 1,
  },
  refillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  refillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  refillText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: '#92400E',
    flex: 1,
  },
  refillChip: {
    backgroundColor: '#D97706',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  refillChipText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: 'rgba(4,9,33,0.76)',
  },
  seeAllText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD',
  },
  horizontalScroll: {
    width: '100%',
    marginBottom: 16,
  },
  scheduleStrip: {
    paddingHorizontal: 16,
    gap: 12,
  },
  stripCard: {
    width: 170,
    height: 125,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  stripCardPending: {
    borderLeftColor: '#0463DD',
  },
  stripCardTaken: {
    borderLeftColor: '#10B981',
    backgroundColor: '#F8FAFC',
  },
  stripCardBottom: {
    gap: 4,
  },
  stripMedName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#1E293B',
  },
  stripTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stripTimeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
  },
  stripTimeTextPending: {
    color: '#0463DD',
  },
  stripTimeTextTaken: {
    color: '#10B981',
  },
  stripStock: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
  },
  emptyStrip: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
  },
  emptyStripText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
    width: '100%',
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.76)',
  },
  feedContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginBottom: 20,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  feedIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  feedContent: {
    flex: 1,
  },
  feedTime: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
    marginBottom: 2,
  },
  feedDescription: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(4,9,33,0.6)',
  },
  boldText: {
    fontFamily: 'Baloo2_700Bold',
    color: '#040921',
  },

  /* CAREGIVER DASHBOARD EXCLUSIVE STYLES */
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16,
    width: '100%',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 22,
    color: 'rgba(4,9,33,0.76)',
  },
  headerSubtitle: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#0463DD',
    marginTop: -2,
  },
  offlineToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  offlineToggleLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#10B981',
  },
  offlineActiveText: {
    color: '#D97706',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  bannerText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: '#92400E',
    flex: 1,
  },
  syncChip: {
    backgroundColor: '#D97706',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  syncChipText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  vitalsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  vitalsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vitalsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalsTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 2,
  },
  vitalsSubtitle: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
  },
  medList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  medCardTaken: {
    borderColor: 'rgba(16, 185, 129, 0.15)',
    backgroundColor: 'rgba(16, 185, 129, 0.01)',
  },
  medInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  pillIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillEmoji: {
    fontSize: 20,
  },
  medTextGroup: {
    flex: 1,
  },
  medDetails: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#0463DD',
    marginBottom: 2,
  },
  medInstructions: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.4)',
  },
  fab: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  modalForm: {
    gap: 16,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.5)',
  },
  formInput: {
    height: 52,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#0F172A',
  },
  pillContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  painPill: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  painPillActive: {
    borderColor: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
  },
  painPillText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.6)',
  },
  painPillTextActive: {
    color: '#0463DD',
  },
  modalSubmitButton: {
    backgroundColor: '#0463DD',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalSubmitButtonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
