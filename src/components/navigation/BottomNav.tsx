import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  activeTab: 'Home' | 'Meds' | 'Pharmacy' | 'Profile' | 'Hub';
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuth();
  const isCaregiver = user?.user_metadata?.role === 'caregiver';

  const handleMedsPress = () => {
    if (isCaregiver) {
      navigation.navigate('MedsTray');
    } else {
      navigation.navigate('CareSchedule');
    }
  };

  const getActiveColor = (tab: string) => (activeTab === tab ? '#0463DD' : 'rgba(15, 23, 42, 0.4)');

  return (
    <View style={styles.container}>
      <BlurView 
        intensity={Platform.OS === 'ios' ? 80 : 100} 
        tint="light" 
        style={StyleSheet.absoluteFill} 
      />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name={activeTab === 'Home' ? "grid" : "grid-outline"} size={24} color={getActiveColor('Home')} />
          <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleMedsPress}>
          <Ionicons name={activeTab === 'Meds' ? "medical" : "medical-outline"} size={24} color={getActiveColor('Meds')} />
          <Text style={[styles.navText, activeTab === 'Meds' && styles.navTextActive]}>Meds</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navFabContainer}
          onPress={() => navigation.navigate('AIChat')}
        >
          <View style={[styles.navFab, { backgroundColor: '#8B5CF6' }]}>
            <Ionicons name="sparkles" size={26} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('PharmacyHub')}
        >
          <Ionicons name={activeTab === 'Pharmacy' ? "bag-handle" : "bag-handle-outline"} size={24} color={getActiveColor('Pharmacy')} />
          <Text style={[styles.navText, activeTab === 'Pharmacy' && styles.navTextActive]}>Pharm</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name={activeTab === 'Profile' ? "person" : "person-outline"} size={24} color={getActiveColor('Profile')} />
          <Text style={[styles.navText, activeTab === 'Profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'visible',
  },
  navBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
  },
  navText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(15, 23, 42, 0.4)',
  },
  navTextActive: {
    color: '#0463DD',
  },
  navFabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navFab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0463DD',
    marginTop: -25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});
