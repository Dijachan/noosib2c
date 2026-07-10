import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { height } = Dimensions.get('window');

interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: string;
  iconColor?: string;
}

interface DropdownSelectorProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function DropdownSelector({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select option',
}: DropdownSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.selectorLeft}>
          {selectedOption?.icon && (
            <Feather
              name={selectedOption.icon as any}
              size={18}
              color={selectedOption.iconColor || 'rgba(4,9,33,0.5)'}
              style={{ marginRight: 10 }}
            />
          )}
          <Text
            style={[
              styles.selectedValueText,
              !selectedOption && styles.placeholderText,
            ]}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <Feather name="chevron-down" size={18} color="rgba(4,9,33,0.4)" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity
            style={styles.dismissOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Feather name="x" size={20} color="rgba(4,9,33,0.6)" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => {
                      onValueChange(item.value);
                      setModalVisible(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionLeft}>
                      {item.icon && (
                        <View
                          style={[
                            styles.iconWrapper,
                            isSelected && {
                              backgroundColor: 'rgba(4,99,221,0.08)',
                            },
                          ]}
                        >
                          <Feather
                            name={item.icon as any}
                            size={16}
                            color={
                              isSelected
                                ? '#0463DD'
                                : item.iconColor || 'rgba(4,9,33,0.5)'
                            }
                          />
                        </View>
                      )}
                      <View style={styles.optionTextGroup}>
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {item.description && (
                          <Text style={styles.optionDescription}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    {isSelected && (
                      <Feather name="check" size={18} color="#0463DD" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.6)',
    marginBottom: 8,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    width: '100%',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedValueText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 15,
    color: '#0F172A',
  },
  placeholderText: {
    color: 'rgba(4,9,33,0.3)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.7,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.04)',
  },
  sheetTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.03)',
  },
  optionItemActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#0463DD',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextGroup: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#0F172A',
  },
  optionLabelActive: {
    color: '#0463DD',
  },
  optionDescription: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
