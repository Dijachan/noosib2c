import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const NotificationItem = ({ 
  title, 
  message, 
  time, 
  type, 
  isRead 
}: { 
  title: string; 
  message: string; 
  time: string; 
  type: 'alert' | 'update' | 'hardware'; 
  isRead: boolean;
}) => {
  const getIcon = () => {
    switch (type) {
      case 'alert': return 'alert-circle';
      case 'hardware': return 'cloud-circle';
      default: return 'notifications';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'alert': return '#EF4444';
      case 'hardware': return '#0463DD';
      default: return '#64748B';
    }
  };

  return (
    <TouchableOpacity style={[styles.notiItem, !isRead && styles.notiItemUnread]}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '15' }]}>
        <Ionicons name={getActiveIcon(type) as any} size={22} color={getIconColor()} />
      </View>
      <View style={styles.notiContent}>
        <View style={styles.notiHeader}>
          <Text style={styles.notiTitle}>{title}</Text>
          <Text style={styles.notiTime}>{time}</Text>
        </View>
        <Text style={styles.notiMsg}>{message}</Text>
      </View>
      {!isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const getActiveIcon = (type: string) => {
  switch (type) {
    case 'alert': return 'alert-circle';
    case 'hardware': return 'cloud-circle';
    default: return 'notifications';
  }
};

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Care Alerts</Text>
        <TouchableOpacity style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent</Text>
        </View>
        
        <NotificationItem 
          title="Medication Missed" 
          message="Mummy K missed her 10:00 AM Metformin dose." 
          time="24m ago" 
          type="alert" 
          isRead={false} 
        />

        <NotificationItem 
          title="Hub Update Complete" 
          message="Noosi Smart Hub v2 firmware updated to v1.2.0." 
          time="1h ago" 
          type="hardware" 
          isRead={true} 
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
        </View>

        <NotificationItem 
          title="Profile Verified" 
          message="Mummy K's health records have been securely synced." 
          time="1d ago" 
          type="update" 
          isRead={true} 
        />

        <NotificationItem 
          title="Connectivity Alert" 
          message="Room probe experienced a brief disconnection at 8:44 PM." 
          time="1d ago" 
          type="hardware" 
          isRead={true} 
        />
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  markReadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markReadText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#64748B',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  notiItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notiItemUnread: {
    borderColor: 'rgba(4, 99, 221, 0.1)',
    backgroundColor: '#F0F7FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notiContent: {
    flex: 1,
    marginLeft: 16,
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notiTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#0F172A',
  },
  notiTime: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#94A3B8',
  },
  notiMsg: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0463DD',
    marginLeft: 8,
  },
});
