import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type MedStatus = 'Empty' | 'Occupied' | 'Missed' | 'Next';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  type: string;
  dosageAmount: string;
  dosageUnit: string;
  slot: number;
  frequency: string;
  time: string;
  date: string;
  instructions?: string;
  status: 'Taken' | 'Pending' | 'Missed';
  brand?: string;
  stock?: string;
  daysLeft?: number;
  priority?: 'Critical' | 'Maintenance' | 'Supplement';
  formFactor?: 'Tablet' | 'Capsule' | 'Liquid' | 'Injection';
  pillColor?: string;
  isArchived?: boolean;
  isAsNeeded?: boolean;
  startDate?: string;
  duration?: string;
}

export interface DoseLog {
  id: string;
  medicationId: string;
  medName: string;
  outcome: 'taken' | 'missed';
  loggedAt: string;           // ISO timestamp (retroactive override supported)
  loggedBy: 'caregiver' | 'elder_whatsapp' | 'system';
  verificationMethod: 'manual' | 'photo_ai' | 'whatsapp_reply' | 'voice_ack';
  photoVerified: boolean;
  ndprEncrypted: boolean;     // All photo evidence encrypted under NDPR
  notes?: string;
}

interface MedicationContextType {
  medicationList: Medication[];
  addMedication: (med: Medication) => Promise<void>;
  deleteMedication: (medId: string) => Promise<void>;
  getSlotStatus: (slotId: number) => MedStatus;
  getMedicationBySlot: (slotId: number) => Medication | undefined;
  adherenceLogs: any[];
  activityLogs: any[];
  toggleMedicationStatus: (medId: string, status: 'Taken' | 'Pending' | 'Missed') => void;
  doseLogs: DoseLog[];
  logDose: (log: Omit<DoseLog, 'id'>) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const { user, demoPatientId, demoDeviceId } = useAuth();
  const [medicationList, setMedicationList] = useState<Medication[]>([]);
  const [adherenceLogs, setAdherenceLogs] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [sessionActivities, setSessionActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([
    {
      id: 'seed-log-1',
      medicationId: 'lisinopril-id',
      medName: 'Lisinopril',
      outcome: 'taken',
      loggedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      loggedBy: 'elder_whatsapp',
      verificationMethod: 'photo_ai',
      photoVerified: true,
      ndprEncrypted: true,
      notes: 'Photo proof verified by AI. Encrypted under NDPR.',
    },
    {
      id: 'seed-log-2',
      medicationId: 'metformin-id',
      medName: 'Metformin',
      outcome: 'taken',
      loggedAt: new Date(Date.now() - 3600000 * 9).toISOString(), // 9 hours ago
      loggedBy: 'caregiver',
      verificationMethod: 'manual',
      photoVerified: false,
      ndprEncrypted: false,
      notes: 'Logged by Nurse Temi with 5-minute delay override.',
    },
    {
      id: 'seed-log-3',
      medicationId: 'metformin-id',
      medName: 'Metformin',
      outcome: 'missed',
      loggedAt: new Date(Date.now() - 3600000 * 33).toISOString(), // 33 hours ago
      loggedBy: 'system',
      verificationMethod: 'voice_ack',
      photoVerified: false,
      ndprEncrypted: false,
      notes: 'Escalated to voice call. Reason: Patient away from home.',
    }
  ]);

  // Sync with Supabase (Digital Twin logic)
  const formatTimeForUI = (timeStr: string) => {
    if (!timeStr) return '12:00 PM';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatTimeForDB = (timeStr: string) => {
    if (!timeStr) return '12:00:00';
    // Robustly extract HH:MM AM/PM even with added suffixes like ' - With Breakfast'
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return '12:00:00';
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = match[3].toUpperCase();
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  };

  const fetchMeds = async () => {
    setIsLoading(true);
    
    // Unified Table Fetch (v3.0)
    const { data: medsData, error: medsError } = await supabase
      .from('medications')
      .select('*')
      .eq('device_id', demoDeviceId);

    if (medsData) {
      const transformed: Medication[] = medsData.map((item: any) => ({
        id: item.id,
        name: item.name,
        dosage: item.dosage || '',
        type: item.type || '',
        dosageAmount: item.dosage_amount?.toString() || '1',
        dosageUnit: item.type || 'Tablet',
        slot: item.slot_number,
        frequency: item.frequency || 'Daily',
        time: formatTimeForUI(item.scheduled_time),
        date: 'Daily',
        instructions: item.instructions || '',
        status: 'Pending',
      }));
      setMedicationList(transformed);
    }

    // Adherence Logs Fetch (v3.0 Points to medication_id)
    const { data: logsData } = await supabase
      .from('adherence_logs')
      .select(`
        status,
        captured_at,
        medication:medication_id (
          slot_number,
          name
        )
      `)
      .order('captured_at', { ascending: false })
      .limit(10);
    
    if (logsData && logsData.length > 0) {
      setAdherenceLogs(logsData.map(log => ({
        id: log.captured_at,
        type: 'taken',
        status: log.status,
        time: new Date(log.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(log.captured_at).toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
        medName: log.medication?.name || 'Medication',
        slot: log.medication?.slot_number,
        timestamp: new Date(log.captured_at).getTime()
      })));
    }

    // System Activity Logs Fetch with Fallback
    let activities: any[] = [];
    try {
      const { data: systemActivities, error: actError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('device_id', demoDeviceId)
        .order('performed_at', { ascending: false })
        .limit(10);

      if (systemActivities && systemActivities.length > 0) {
        activities = systemActivities.map(act => ({
          id: act.id,
          type: act.action_type,
          medName: act.medication_name,
          slot: act.slot_number,
          time: new Date(act.performed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(act.performed_at).toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
          timestamp: new Date(act.performed_at).getTime()
        }));
      }
    } catch (e) {
      console.warn('Activity logs table might not exist yet');
    }

    // Merge session activities with remote logs
    const mergedActivities = [...sessionActivities, ...activities];
    
    // Smart Activity Fusion: Merge real/session logs with derived state from medications
    let consolidatedActivities = [...mergedActivities];

    // If we have medications but no logs, derive "Linked" events for UX consistency
    medicationList.forEach(med => {
      const hasLog = consolidatedActivities.some(a => a.medName === med.name && (a.type === 'created' || a.type === 'edited'));
      if (!hasLog) {
        consolidatedActivities.push({
          id: `derived-${med.id}`,
          type: 'created',
          medName: med.name,
          slot: med.slot,
          time: 'Active',
          date: 'Now',
          timestamp: Date.now() - 1000
        });
      }
    });

    // Ensure we always have empty state fallback if truly nothing exists
    if (consolidatedActivities.length === 0 && adherenceLogs.length === 0) {
      consolidatedActivities = [
        {
          id: 'seed-1',
          type: 'created',
          medName: 'Metformin',
          slot: 5,
          time: '12:45 PM',
          date: 'Today',
          timestamp: Date.now() - 3600000
        }
      ];
    }
    
    setActivityLogs(consolidatedActivities.sort((a, b) => b.timestamp - a.timestamp));

    setIsLoading(false);
  };

  useEffect(() => {
    fetchMeds();

    // Unified Real-time Subscription for clinical changes
    const channel = supabase
      .channel('med_clinical_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'medications',
        filter: `device_id=eq.${demoDeviceId}`
      }, () => fetchMeds())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, () => fetchMeds())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'adherence_logs' }, () => fetchMeds())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [demoDeviceId]);

  const addMedication = async (med: Medication) => {
    try {
      const formattedTime = formatTimeForDB(med.time);
      const isNew = !medicationList.find(m => m.id === med.id);

      // Optimistic Session Log (Immediate UI feedback)
      const sessionLog = {
        id: `optimistic-${Date.now()}`,
        type: isNew ? 'created' : 'edited',
        medName: med.name,
        slot: med.slot,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Just now',
        timestamp: Date.now()
      };
      setSessionActivities(prev => [sessionLog, ...prev]);

      // 1. Log to DB (Non-blocking)
      supabase.from('activity_logs').insert({
        device_id: demoDeviceId,
        medication_name: med.name,
        slot_number: med.slot,
        action_type: isNew ? 'created' : 'edited',
        performed_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.error('Activity Log Sync Error:', error.message);
      });

      // 2. Main Medication Upsert
      const { error } = await supabase
        .from('medications')
        .upsert({
          id: med.id,
          device_id: demoDeviceId,
          patient_id: demoPatientId,
          slot_number: med.slot,
          name: med.name,
          dosage: med.dosage,
          type: med.dosageUnit || med.type,
          instructions: med.instructions,
          scheduled_time: formattedTime,
          dosage_amount: parseFloat(med.dosageAmount) || 1,
          frequency: med.frequency,
          is_active: true
        });

      if (error) throw error;
      await fetchMeds(); 
    } catch (error) {
      console.warn('Network sync failed. Falling back to local state updates.', error);
      
      // Update local react state immediately so prototype flows are not blocked
      setMedicationList(prev => {
        const exists = prev.find(m => m.id === med.id);
        if (exists) {
          return prev.map(m => m.id === med.id ? med : m);
        } else {
          return [...prev, med];
        }
      });
    }
  };
  const deleteMedication = async (medId: string) => {
    try {
      const medToDelete = medicationList.find(m => m.id === medId);
      if (medToDelete) {
        // Optimistic Session Log
        const sessionLog = {
          id: `optimistic-del-${Date.now()}`,
          type: 'deleted',
          medName: medToDelete.name,
          slot: medToDelete.slot,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Just now',
          timestamp: Date.now()
        };
        setSessionActivities(prev => [sessionLog, ...prev]);

        // DB Log (Non-blocking)
        supabase.from('activity_logs').insert({
          device_id: demoDeviceId,
          medication_name: medToDelete.name,
          slot_number: medToDelete.slot,
          action_type: 'deleted',
          performed_at: new Date().toISOString()
        }).then(({ error }) => {
           if (error) console.error('Delete Log Error:', error.message);
        });
      }

      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medId);
      
      if (error) throw error;
      await fetchMeds();
    } catch (error) {
      console.warn('Network delete sync failed. Falling back to local state updates.', error);
      // Update local react state immediately
      setMedicationList(prev => prev.filter(m => m.id !== medId));
    }
  };
  const getSlotStatus = (slotId: number): MedStatus => {
    const med = medicationList.find((m) => m.slot === slotId);
    if (!med) return 'Empty';
    return 'Occupied';
  };

  const getMedicationBySlot = (slotId: number) => {
    return medicationList.find((m) => m.slot === slotId);
  };

  const toggleMedicationStatus = (medId: string, status: 'Taken' | 'Pending' | 'Missed') => {
    setMedicationList(prev => 
      prev.map(m => m.id === medId ? { ...m, status } : m)
    );
  };

  const logDose = async (log: Omit<DoseLog, 'id'>) => {
    const newLog: DoseLog = {
      ...log,
      id: 'log-' + Date.now().toString(),
    };
    setDoseLogs(prev => [newLog, ...prev]);

    // Update medication status in list
    toggleMedicationStatus(log.medicationId, log.outcome === 'taken' ? 'Taken' : 'Missed');

    // Also update Supabase tables
    try {
      await supabase.from('adherence_logs').insert({
        device_id: demoDeviceId,
        medication_id: log.medicationId,
        status: log.outcome === 'taken' ? 'Taken' : 'Missed',
        captured_at: log.loggedAt
      });

      await supabase.from('activity_logs').insert({
        device_id: demoDeviceId,
        medication_name: log.medName,
        slot_number: 1,
        action_type: log.outcome,
        performed_at: log.loggedAt
      });
    } catch (err) {
      console.warn('Network sync for logDose failed, continuing locally:', err);
    }
  };

  return (
    <MedicationContext.Provider value={{ 
      medicationList, 
      addMedication, 
      deleteMedication, 
      getSlotStatus, 
      getMedicationBySlot, 
      adherenceLogs,
      activityLogs,
      toggleMedicationStatus,
      doseLogs,
      logDose
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
