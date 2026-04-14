import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      type: 'Tablet',
      dosageAmount: '1',
      slot: 1,
      frequency: 'Daily',
      time: '08:00 AM',
      date: 'Today',
      status: 'Taken',
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg',
      type: 'Tablet',
      dosageAmount: '1',
      slot: 2,
      frequency: 'Daily',
      time: '01:00 PM',
      date: 'Today',
      status: 'Taken',
    },
    {
      id: '3',
      name: 'Vitamin C',
      dosage: '1000mg',
      type: 'Capsule',
      dosageAmount: '1',
      slot: 3,
      frequency: 'Daily',
      time: '08:00 PM',
      date: 'Today',
      status: 'Pending',
    },
    {
      id: '4',
      name: 'Aspirin',
      dosage: '81mg',
      type: 'Tablet',
      dosageAmount: '1',
      slot: 4,
      frequency: 'Daily',
      time: '12:00 PM',
      date: 'Today',
      status: 'Missed',
    },
  ]);

  const addMedication = (med: Medication) => {
    setMedications((prev) => [...prev, med]);
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
