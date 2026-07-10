import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface CustomAlertModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function CustomAlertModal({
  isVisible,
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
}: CustomAlertModalProps) {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity 
          style={styles.dismissOverlay} 
          activeOpacity={1} 
          onPress={onCancel || onConfirm} 
        />
        
        <View style={styles.modalContent}>
          {title ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          ) : null}

          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          <View style={styles.actionRow}>
            {cancelText ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
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
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#040921',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#0F172A',
    textAlign: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  messageText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#64748B',
  },
  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
