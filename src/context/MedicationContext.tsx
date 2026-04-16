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
  slot: number;
  frequency: string;
  time: string;
  date: string;
  instructions?: string;
  status: 'Taken' | 'Pending' | 'Missed';
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (med: Medication) => void;
  getSlotStatus: (slotId: number) => MedStatus;
  getMedicationBySlot: (slotId: number) => Medication | undefined;
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
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Supabase
  useEffect(() => {
    if (!user) return;

    const fetchMeds = async () => {
      setIsLoading(true);
      
      // Fetch slots and join with medications
      const { data, error } = await supabase
        .from('medication_slots')
        .select(`
          slot_number,
          scheduled_time,
          is_active,
          medications (
            id,
            name,
            dosage,
            type
          )
        `);

      if (data) {
        const transformed: Medication[] = data.map((item: any) => ({
          id: item.medications?.id || Math.random().toString(),
          name: item.medications?.name || 'Unknown',
          dosage: item.medications?.dosage || '',
          type: item.medications?.type || '',
          dosageAmount: '1',
          slot: item.slot_number,
          frequency: 'Daily',
          time: item.scheduled_time,
          date: 'Today',
          status: 'Pending', // Real logic would check adherence_logs
        }));
        setMedications(transformed);
      }
      setIsLoading(false);
    };

    fetchMeds();

    // Subscribe to slot changes (The "Digital Twin" heartbeat)
    const subscription = supabase
      .channel('tray-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'medication_slots' 
      }, () => {
        fetchMeds(); // Simple re-fetch on any tray change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addMedication = async (med: Medication) => {
    if (!user) return;

    try {
      // 1. Ensure medication exists
      const { data: medData, error: medError } = await supabase
        .from('medications')
        .upsert({
          name: med.name,
          dosage: med.dosage,
          type: med.type,
          patient_id: user.id, // Assuming user is caregiver and we use their ID for now or find linked patient
        })
        .select()
        .single();

      if (medError) throw medError;

      // 2. Map to slot
      const { error: slotError } = await supabase
        .from('medication_slots')
        .upsert({
          slot_number: med.slot,
          medication_id: medData.id,
          scheduled_time: med.time,
        });

      if (slotError) throw slotError;

      // Local state will update via real-time subscription
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const getSlotStatus = (slotId: number): MedStatus => {
    const med = medications.find((m) => m.slot === slotId);
    if (!med) return 'Empty';
    if (med.status === 'Missed') return 'Missed';
    if (med.status === 'Pending' && med.slot === 3) return 'Next'; // Mocking "Next" logic
    return 'Occupied';
  };

  const getMedicationBySlot = (slotId: number) => {
    return medications.find((m) => m.slot === slotId);
  };

  return (
    <MedicationContext.Provider value={{ medications, addMedication, getSlotStatus, getMedicationBySlot }}>
      {children}
    </MedicationContext.Provider>
  );
};
