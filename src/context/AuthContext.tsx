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
  refreshOnboarding: () => Promise<void>;
  mockLogin: () => void;
  mockNextStep: () => void;
  setOnboardingStatus: (status: 'not_started' | 'profile_created' | 'paired' | 'completed' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<'not_started' | 'profile_created' | 'paired' | 'completed' | null>('not_started');
  const [isLocked, setIsLocked] = useState(false);

  // DEMO USER ID (consistent for hardware link)
  const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';
  const DEMO_PATIENT_ID = '11111111-1111-1111-1111-111111111111';
  const DEMO_DEVICE_ID = '77777777-7777-7777-7777-777777777777';

  const mockLogin = () => {
    setUser({ 
      id: DEMO_USER_ID, 
      email: 'demo@noosi.com',
      user_metadata: { full_name: 'Dija' }
    } as any);
    setOnboardingStatus('not_started');
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
      setOnboardingStatus
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
