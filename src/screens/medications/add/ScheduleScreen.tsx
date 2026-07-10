import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../../context/MedicationContext';
import DateTimePickerModal from '../../../components/medications/DateTimePickerModal';
import CustomAlertModal from '../../../components/medications/CustomAlertModal';
import DropdownSelector from '../../../components/medications/DropdownSelector';

const MEAL_ANCHORS = [
  'With Breakfast',
  'With Lunch',
  'With Dinner',
  'Before Bed',
  'No Meal Anchor'
];

const CLASSIFICATION_OPTIONS = [
  {
    label: 'Supplement',
    value: 'Supplement',
    description: 'Vitamins or non-essential additions. Bypasses compliance checks.',
    icon: 'plus-circle',
    iconColor: '#10B981',
  },
  {
    label: 'Maintenance',
    value: 'Maintenance',
    description: 'Daily routine medications. Generates standard daily reminders.',
    icon: 'activity',
    iconColor: '#06565F',
  },
  {
    label: 'Critical',
    value: 'Critical',
    description: 'Life-essential medications. Bypasses delay alerts, triggers calls if missed.',
    icon: 'alert-triangle',
    iconColor: '#FF6F61',
  },
];

const DURATION_OPTIONS = [
  { label: 'Ongoing Schedule', value: 'Ongoing', icon: 'repeat', iconColor: '#06565F' },
  { label: '7 Days', value: '7 Days', icon: 'calendar', iconColor: '#64748B' },
  { label: '14 Days', value: '14 Days', icon: 'calendar', iconColor: '#64748B' },
  { label: '30 Days', value: '30 Days', icon: 'calendar', iconColor: '#64748B' },
];

export default function ScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { addMedication } = useMedication();
  const route = useRoute<any>();
  
  const { drugData, isEditing, editMed } = route.params || { 
    drugData: { 
      name: 'Metformin', 
      brand: 'Glucophage',
      strength: '500mg', 
      formFactor: 'Tablet',
      pillColor: '#06565F',
      instructions: '',
    } 
  };

  const [frequency, setFrequency] = useState<'Daily' | 'Specific Days' | 'As Needed (PRN)'>(
    editMed?.frequency || 'Daily'
  );

  // Split existing time context if editing (e.g. "08:00 AM, 02:00 PM - With Breakfast")
  const getInitialTimeParts = () => {
    const defaultTime = '08:00 AM';
    const defaultAnchor = 'With Breakfast';
    if (!editMed?.time) return { times: [defaultTime], anchor: defaultAnchor };
    
    const parts = editMed.time.split(' - ');
    const timesPart = parts[0] || defaultTime;
    const timesArray = timesPart.split(', ').map((t: string) => t.trim());
    return {
      times: timesArray.length > 0 ? timesArray : [defaultTime],
      anchor: parts[1] || 'No Meal Anchor'
    };
  };

  const initialParts = getInitialTimeParts();
  const [doseTimes, setDoseTimes] = useState<string[]>(initialParts.times);
  const [dosesPerDay, setDosesPerDay] = useState<number>(initialParts.times.length);
  const [activeDoseIdx, setActiveDoseIdx] = useState<number>(0);
  const [selectedMeal, setSelectedMeal] = useState<string>(initialParts.anchor);
  
  const [quantity, setQuantity] = useState(editMed?.dosageAmount || '1');
  const [stock, setStock] = useState(editMed?.stock || '60');
  const [startDate, setStartDate] = useState<Date>(
    editMed?.startDate ? new Date(editMed.startDate) : new Date()
  );
  const [duration, setDuration] = useState<string>(editMed?.duration || 'Ongoing');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Critical' | 'Maintenance' | 'Supplement'>(
    editMed?.priority || 'Maintenance'
  );

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showAlert = (
    title: string, 
    message: string, 
    onConfirm?: () => void, 
    confirmText = 'OK', 
    onCancel?: () => void, 
    cancelText?: string
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onCancel) onCancel();
      }
    });
  };

  const [showTimePicker, setShowTimePicker] = useState(false);

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleDosesPerDayChange = (count: number) => {
    setDosesPerDay(count);
    let newTimes = [...doseTimes];
    if (count === 1) {
      newTimes = [newTimes[0] || '08:00 AM'];
    } else if (count === 2) {
      newTimes = [
        newTimes[0] || '08:00 AM',
        newTimes[1] || '08:00 PM'
      ];
    } else if (count === 3) {
      newTimes = [
        newTimes[0] || '08:00 AM',
        newTimes[1] || '02:00 PM',
        newTimes[2] || '08:00 PM'
      ];
    }
    setDoseTimes(newTimes);
  };

  const getInitialTimeObj = () => {
    const d = new Date();
    const currentActiveTime = doseTimes[activeDoseIdx] || '08:00 AM';
    if (currentActiveTime.includes('AM') || currentActiveTime.includes('PM')) {
      const [t, modifier] = currentActiveTime.split(' ');
      let [hours, minutes] = t.split(':');
      let h = parseInt(hours, 10);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      d.setHours(h, parseInt(minutes, 10), 0, 0);
    }
    return d;
  };

  const handleTimeConfirm = (event: any, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      const m = minutes.toString().padStart(2, '0');
      const formattedTime = `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
      
      const newTimes = [...doseTimes];
      newTimes[activeDoseIdx] = formattedTime;
      setDoseTimes(newTimes);
    }
  };

  const handleStartDateConfirm = (event: any, date?: Date) => {
    setShowStartDatePicker(false);
    if (date) {
      setStartDate(date);
    }
  };

  const handleFinish = async () => {
    if (!quantity.trim() || isNaN(parseFloat(quantity))) {
      showAlert('Form error', 'Please enter a valid dosage quantity.');
      return;
    }
    if (!stock.trim() || isNaN(parseInt(stock))) {
      showAlert('Form error', 'Please enter a valid stock level.');
      return;
    }

    try {
      const parsedQty = parseFloat(quantity) || 1;
      const parsedStock = parseInt(stock) || 60;
      const daysLeft = Math.ceil(parsedStock / parsedQty);

      // Dynamically combine Time + Meal Anchor Context
      const timesString = doseTimes.join(', ');
      const finalTimeContext = selectedMeal === 'No Meal Anchor' 
        ? timesString 
        : `${timesString} - ${selectedMeal}`;

      const newMed = {
        id: editMed?.id || uuidv4(),
        name: drugData.name,
        brand: drugData.brand || 'Generic',
        dosage: drugData.strength || '500mg',
        type: drugData.formFactor || 'Tablet',
        dosageAmount: quantity,
        dosageUnit: drugData.formFactor || 'Tablet',
        slot: route.params?.slot || editMed?.slot || 3,
        frequency,
        time: finalTimeContext,
        date: 'Daily',
        instructions: drugData.instructions || '',
        status: 'Pending' as const,
        stock,
        daysLeft,
        priority,
        formFactor: drugData.formFactor,
        pillColor: drugData.pillColor,
        startDate: startDate.toISOString().split('T')[0],
        duration: duration || 'Ongoing',
      };

      await addMedication(newMed);
      showAlert(
        'Medicine Added',
        `${drugData.name} has been added successfully.`,
        () => {
          navigation.navigate('CareSchedule');
        }
      );
    } catch (err) {
      console.error('Error adding med:', err);
      showAlert('Error', 'Failed to save medicine details.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Schedule & Stock</Text>
          <Text style={styles.headerStep}>Step 3 of 3</Text>
        </View>
        <View style={styles.navPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>When should they take it?</Text>
        <Text style={styles.subtitle}>
          Set the time, dose, and stock reminders.
        </Text>

        {/* Frequency Picker */}
        <Text style={styles.fieldLabel}>How often?</Text>
        <View style={styles.frequencyRow}>
          {(['Daily', 'Specific Days', 'As Needed (PRN)'] as const).map(freq => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.freqTab,
                frequency === freq && styles.freqTabActive
              ]}
              onPress={() => setFrequency(freq)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.freqTabText,
                frequency === freq && styles.freqTabTextActive
              ]}>
                {freq === 'As Needed (PRN)' ? 'As Needed' : freq}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Doses per day (Only if not PRN) */}
        {frequency !== 'As Needed (PRN)' ? (
          <>
            <Text style={styles.fieldLabel}>Doses per day</Text>
            <View style={styles.frequencyRow}>
              {([1, 2, 3] as const).map(count => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.freqTab,
                    dosesPerDay === count && styles.freqTabActive
                  ]}
                  onPress={() => handleDosesPerDayChange(count)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.freqTabText,
                    dosesPerDay === count && styles.freqTabTextActive
                  ]}>
                    {count}x Daily
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Render a time picker for each dose */}
            <Text style={styles.fieldLabel}>What time?</Text>
            <View style={{ gap: 10, marginBottom: 16 }}>
              {Array.from({ length: dosesPerDay }).map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.timePickerButton}
                  onPress={() => {
                    setActiveDoseIdx(idx);
                    setShowTimePicker(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Feather name="clock" size={20} color="#06565F" />
                  <Text style={styles.timePickerButtonText}>
                    Dose {idx + 1}: {doseTimes[idx] || 'Select Time'}
                  </Text>
                  <Feather name="edit-2" size={16} color="rgba(4,9,33,0.4)" />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.fieldLabel}>What time?</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => {
                setActiveDoseIdx(0);
                setShowTimePicker(true);
              }}
              activeOpacity={0.8}
            >
              <Feather name="clock" size={20} color="#06565F" />
              <Text style={styles.timePickerButtonText}>
                As Needed (PRN)
              </Text>
              <Feather name="edit-2" size={16} color="rgba(4,9,33,0.4)" />
            </TouchableOpacity>
          </>
        )}

        {/* Meal Anchor Selector Chips */}
        <Text style={styles.fieldLabel}>When to take it relative to meals?</Text>
        <View style={styles.mealGrid}>
          {MEAL_ANCHORS.map(anchor => (
            <TouchableOpacity
              key={anchor}
              style={[
                styles.mealChip,
                selectedMeal === anchor && styles.mealChipActive
              ]}
              onPress={() => setSelectedMeal(anchor)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.mealChipText,
                selectedMeal === anchor && styles.mealChipTextActive
              ]}>
                {anchor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dosage Quantity and Stock */}
        <View style={styles.rowFields}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>How many?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 1"
                placeholderTextColor="rgba(4,9,33,0.3)"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>Current Stock</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 60"
                placeholderTextColor="rgba(4,9,33,0.3)"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>
          </View>
        </View>

        {/* Start Date & Duration */}
        <Text style={styles.fieldLabel}>Start Date & Duration</Text>
        
        <Text style={styles.fieldLabel}>Start Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowStartDatePicker(true)}
          activeOpacity={0.8}
        >
          <Feather name="calendar" size={16} color="#06565F" />
          <Text style={styles.datePickerButtonText}>
            {startDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </Text>
        </TouchableOpacity>

        <DropdownSelector
          label="Duration"
          options={DURATION_OPTIONS}
          selectedValue={duration}
          onValueChange={setDuration}
          placeholder="Select duration"
        />

        <DropdownSelector
          label="Medication Classification"
          options={CLASSIFICATION_OPTIONS}
          selectedValue={priority}
          onValueChange={(val: any) => setPriority(val)}
          placeholder="Select classification"
        />
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Finish: Add Medication</Text>
          <Feather name="check" size={20} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Time Picker Scroll Modal */}
      <DateTimePickerModal
        isVisible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        value={getInitialTimeObj()}
        mode="time"
        onConfirm={handleTimeConfirm}
      />

      {/* Start Date Picker Scroll Modal */}
      <DateTimePickerModal
        isVisible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        value={startDate}
        mode="date"
        onConfirm={handleStartDateConfirm}
      />

      <CustomAlertModal
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  headerStep: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#06565F',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    color: 'rgba(4,9,33,0.5)',
    lineHeight: 20,
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: 'rgba(4,9,33,0.6)',
    marginBottom: 8,
    marginTop: 8,
  },
  subFieldLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
    marginBottom: 8,
    marginTop: 8,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    width: '100%',
  },
  freqTab: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freqTabActive: {
    backgroundColor: '#06565F',
  },
  freqTabText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  freqTabTextActive: {
    color: '#FFFFFF',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '100%',
  },
  timePickerButtonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#06565F',
    flex: 1,
    marginLeft: 12,
  },
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  mealChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  mealChipActive: {
    backgroundColor: '#E6F3F4',
    borderColor: '#06565F',
  },
  mealChipText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  mealChipTextActive: {
    color: '#06565F',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  halfField: {
    flex: 0.48,
  },
  priorityGroup: {
    width: '100%',
    gap: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  priorityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 6,
  },
  priorityCardCritical: {
    backgroundColor: '#FFF1EE',
    borderColor: 'rgba(255,111,97,0.1)',
  },
  priorityCardSupplementActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.02)',
  },
  priorityCardMaintenanceActive: {
    borderColor: '#06565F',
    backgroundColor: 'rgba(4, 99, 221, 0.02)',
  },
  priorityCardCriticalActive: {
    borderColor: '#FF6F61',
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
  },
  priorityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityCardTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityCardDescription: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(4,9,33,0.5)',
    paddingLeft: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  primaryBtn: {
    backgroundColor: '#06565F',
    width: '100%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#06565F',
    marginLeft: 8,
  },
  durationGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  durationChip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  durationChipActive: {
    backgroundColor: '#E6F3F4',
    borderColor: '#06565F',
  },
  durationChipText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  durationChipTextActive: {
    color: '#06565F',
  },
});
