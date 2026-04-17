import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface DateTimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  value: Date;
  mode: 'time' | 'date';
  onConfirm: (date: Date) => void;
  title?: string;
}

export default function DateTimePickerModal({
  isVisible,
  onClose,
  value,
  mode,
  onConfirm,
  title,
}: DateTimePickerModalProps) {
  const [currentDate, setCurrentDate] = useState(value);

  const handleConfirm = () => {
    onConfirm(currentDate);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity 
          style={styles.dismissOverlay} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title || (mode === 'time' ? 'Select Time' : 'Select Date')}</Text>
          </View>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={currentDate}
              mode={mode}
              display="spinner"
              minimumDate={new Date()}
              onChange={(event, date) => date && setCurrentDate(date)}
              textColor="#0F172A"
              style={styles.picker}
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#64748B',
  },
  confirmBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
