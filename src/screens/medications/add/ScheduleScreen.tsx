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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from '../../../components/medications/DateTimePickerModal';

export default function ScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { drugData, isEditing, editMed } = route.params || { 
    drugData: { 
      name: 'Metformin', 
      dosage: '500mg', 
      type: 'Tablet',
      dosageAmount: '1',
      slot: 3,
      frequency: 'Daily',
      time: '08:00 AM',
      date: 'Today'
    } 
  };

  const [frequency, setFrequency] = useState(editMed?.frequency || 'Daily');
  const [time, setTime] = useState(editMed?.time || '08:00 AM');
  const [date, setDate] = useState(editMed?.date || 'Today');

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Parse time string for picker (e.g. "08:00 AM" -> Date object)
  const getInitialTime = () => {
    const d = new Date();
    if (time.includes('AM') || time.includes('PM')) {
      const [t, modifier] = time.split(' ');
      let [hours, minutes] = t.split(':');
      let h = parseInt(hours, 10);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      d.setHours(h, parseInt(minutes, 10), 0, 0);
    }
    return d;
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      const m = minutes.toString().padStart(2, '0');
      setTime(`${h.toString().padStart(2, '0')}:${m} ${ampm}`);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      if (selectedDate.toDateString() === today.toDateString()) {
        setDate('Today');
      } else {
        setDate(selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
      }
    }
  };

  const frequencies = ['Daily', 'Every 8 hours', 'Twice a day', 'Weekly'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 4 of 5</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Set Medication Schedule</Text>
        <Text style={styles.subtitle}>
          Set when Mummy K should take her <Text style={styles.drugHighlight}>{drugData.name}</Text>.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyList}>
            {frequencies.map((freq) => (
              <TouchableOpacity 
                key={freq}
                style={[styles.freqItem, frequency === freq && styles.freqSelected]}
                onPress={() => setFrequency(freq)}
              >
                <Text style={[styles.freqText, frequency === freq && styles.freqTextSelected]}>
                  {freq}
                </Text>
                {frequency === freq && (
                  <Ionicons name="checkmark-circle" size={20} color="#0463DD" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Intake Time and Date</Text>
          <View style={styles.pickerGroup}>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowTimePicker(true)}>
              <View style={styles.timeInfo}>
                <Ionicons name="time-outline" size={24} color="#0463DD" />
                <Text style={styles.timeLabel}>Reminder Time</Text>
              </View>
              <Text style={styles.timeValue}>{time}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
              <View style={styles.timeInfo}>
                <Ionicons name="calendar-outline" size={24} color="#0463DD" />
                <Text style={styles.timeLabel}>Reminder Date</Text>
              </View>
              <Text style={styles.timeValue}>{date}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          value={getInitialTime()}
          mode="time"
          onConfirm={(selectedDate) => onTimeChange({}, selectedDate)}
        />

        <DateTimePickerModal
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          value={new Date()}
          mode="date"
          onConfirm={(selectedDate) => onDateChange({}, selectedDate)}
        />

        <View style={styles.tipBox}>
           <Ionicons name="notifications-outline" size={20} color="#0463DD" />
           <Text style={styles.tipText}>
             The smart tray will light up and alert at this exact time. We will also notify you on your phone.
           </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ReviewSync', { 
            finalData: { ...drugData, frequency, time, date },
            isEditing,
            editMed
          })}
        >
          <Text style={styles.primaryBtnText}>Review & Sync</Text>
          <Ionicons name="sync-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },
  drugHighlight: {
    color: '#0463DD',
    fontFamily: 'Baloo2_700Bold',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
  },
  frequencyList: {
    gap: 12,
  },
  freqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  freqSelected: {
    borderColor: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.02)',
  },
  freqText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#475569',
  },
  freqTextSelected: {
    color: '#0463DD',
  },
  pickerGroup: {
    gap: 12,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: '#0F172A',
  },
  timeValue: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0463DD',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4, 99, 221, 0.03)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Baloo2_400Regular',
    fontSize: 13,
    color: 'rgba(15, 23, 42, 0.7)',
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryBtn: {
    backgroundColor: '#0463DD',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
