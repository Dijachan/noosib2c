import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  onboardingStatus: 'not_started' | 'profile_created' | 'paired' | 'completed' | null;
  isLocked: boolean;
  demoPatientId: string;
  demoDeviceId: string;
  signOut: () => Promise<void>;
  unlock: (password: string) => Promise<void>;
  mockLogin: (status?: 'not_started' | 'profile_created' | 'paired' | 'completed', role?: 'admin' | 'caregiver') => void;
  mockNextStep: () => void;
  setOnboardingStatus: (status: 'not_started' | 'profile_created' | 'paired' | 'completed' | null) => void;
  patientProfile: {
    name: string;
    age: string;
    gender: string;
    phone: string;
    conditions: string[];
    language: string;
  } | null;
  setPatientProfile: (profile: any) => void;
  careCircle: Array<{
    name: string;
    role: 'Admin' | 'Full Caregiver' | 'Observer';
    status: 'Active' | 'Pending Invite';
    phone: string;
  }>;
  setCareCircle: (circle: any) => void;
  alertActive: boolean;
  setAlertActive: (val: boolean) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  offlineQueue: string[];
  setOfflineQueue: (val: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<'not_started' | 'profile_created' | 'paired' | 'completed' | null>('not_started');
  const [isLocked, setIsLocked] = useState(false);

  // Patient Profile & Care Circle Mock Data
  const [patientProfile, setPatientProfile] = useState<{
    name: string;
    age: string;
    gender: string;
    phone: string;
    conditions: string[];
    language: string;
  } | null>({
    name: 'Grandpa Kunle',
    age: '78',
    gender: 'Male',
    phone: '+234 803 123 4567',
    conditions: ['Hypertension'],
    language: 'English'
  });

  const [careCircle, setCareCircle] = useState<Array<{
    name: string;
    role: 'Admin' | 'Full Caregiver' | 'Observer';
    status: 'Active' | 'Pending Invite';
    phone: string;
  }>>([
    {
      name: 'Kunle Jr.',
      role: 'Admin',
      status: 'Active',
      phone: '+1 555 019 2834'
    }
  ]);

  const [alertActive, setAlertActive] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);

  // DEMO USER ID (consistent for hardware link)
  const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';
  const DEMO_PATIENT_ID = '11111111-1111-1111-1111-111111111111';
  const DEMO_DEVICE_ID = '77777777-7777-7777-7777-777777777777';

  const mockLogin = (
    status: 'not_started' | 'profile_created' | 'paired' | 'completed' = 'not_started',
    role: 'admin' | 'caregiver' = 'admin'
  ) => {
    setUser({ 
      id: DEMO_USER_ID, 
      email: 'demo@noosi.com',
      user_metadata: { full_name: 'Dija', role }
    } as any);
    setOnboardingStatus(status);
  };

  const mockNextStep = () => {
    if (onboardingStatus === 'not_started') setOnboardingStatus('profile_created');
    else if (onboardingStatus === 'profile_created') setOnboardingStatus('paired');
    else if (onboardingStatus === 'paired') setOnboardingStatus('completed');
  };

  const signOut = async () => {
    setUser(null);
    setOnboardingStatus('not_started');
    setIsLocked(false);
  };

  const unlock = async (password: string) => {
    setIsLocked(false);
  };

  const refreshOnboarding = async () => {
    // No-op for demo
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      onboardingStatus, 
      isLocked, 
      demoPatientId: DEMO_PATIENT_ID,
      demoDeviceId: DEMO_DEVICE_ID,
      signOut, 
      unlock, 
      refreshOnboarding,
      mockLogin,
      mockNextStep,
      setOnboardingStatus,
      patientProfile,
      setPatientProfile,
      careCircle,
      setCareCircle,
      alertActive,
      setAlertActive,
      isOffline,
      setIsOffline,
      offlineQueue,
      setOfflineQueue
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
