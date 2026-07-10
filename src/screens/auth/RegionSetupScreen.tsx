import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';

const ADMIN_COUNTRIES = [
  { label: 'UK', tz: 'Europe/London' },
  { label: 'USA', tz: 'America/New_York' },
  { label: 'Canada', tz: 'America/Toronto' },
  { label: 'Other', tz: undefined }
];

const PATIENT_COUNTRIES = [
  { label: 'Nigeria', tz: 'Africa/Lagos' },
  { label: 'Ghana', tz: 'Africa/Accra' },
  { label: 'Kenya', tz: 'Africa/Nairobi' },
  { label: 'Other', tz: undefined }
];

export default function RegionSetupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [adminCountry, setAdminCountry] = useState(ADMIN_COUNTRIES[0]);
  const [patientCountry, setPatientCountry] = useState(PATIENT_COUNTRIES[0]);
  const [relationship, setRelationship] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Tick the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeString = (timeZone: string | undefined) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone,
      };
      
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(currentTime);

      const tzOptions: Intl.DateTimeFormatOptions = {
        timeZoneName: 'short',
        timeZone,
      };
      const parts = new Intl.DateTimeFormat('en-US', tzOptions).formatToParts(currentTime);
      const zonePart = parts.find(p => p.type === 'timeZoneName');
      const zoneName = zonePart ? zonePart.value : '';

      return { time: timeStr, zone: zoneName };
    } catch (e) {
      return { 
        time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), 
        zone: 'Local' 
      };
    }
  };

  const adminTimeObj = getTimeString(adminCountry.tz);
  const patientTimeObj = getTimeString(patientCountry.tz);

  const isFormValid = relationship.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <View style={styles.navHeaderTitleContainer}>
              <Text style={styles.navTitle}>Region Setup</Text>
              <Text style={styles.navStep}>Step 1 of 2</Text>
            </View>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Title Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Where is care needed?</Text>
            <Text style={styles.subtitle}>
              We'll automatically sync timezones to coordinate medication reminders.
            </Text>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Admin Base Country Picker */}
            <View style={styles.pickerGroup}>
              <Text style={styles.pickerLabel}>Where are you?</Text>
              <View style={styles.segmentedPicker}>
                {ADMIN_COUNTRIES.map((country) => (
                  <TouchableOpacity
                    key={country.label}
                    style={[
                      styles.pickerSegment,
                      adminCountry.label === country.label && styles.pickerSegmentActive
                    ]}
                    onPress={() => setAdminCountry(country)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pickerSegmentText,
                        adminCountry.label === country.label && styles.pickerSegmentTextActive
                      ]}
                    >
                      {country.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Patient Location Country Picker */}
            <View style={styles.pickerGroup}>
              <Text style={styles.pickerLabel}>Where is your loved one?</Text>
              <View style={styles.segmentedPicker}>
                {PATIENT_COUNTRIES.map((country) => (
                  <TouchableOpacity
                    key={country.label}
                    style={[
                      styles.pickerSegment,
                      patientCountry.label === country.label && styles.pickerSegmentActive
                    ]}
                    onPress={() => setPatientCountry(country)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pickerSegmentText,
                        patientCountry.label === country.label && styles.pickerSegmentTextActive
                      ]}
                    >
                      {country.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dual Clock Sync Widget */}
            <View style={styles.clockWidgetContainer}>
              <View style={styles.clockColumn}>
                <Text style={styles.clockColumnLabel}>YOU</Text>
                <Text style={styles.clockTime}>{adminTimeObj.time}</Text>
                <Text style={styles.clockZone}>{adminTimeObj.zone}</Text>
              </View>

              <View style={styles.syncIconContainer}>
                <Feather name="refresh-cw" size={16} color="#0463DD" />
              </View>

              <View style={styles.clockColumn}>
                <Text style={styles.clockColumnLabel}>THEM</Text>
                <Text style={styles.clockTime}>{patientTimeObj.time}</Text>
                <Text style={styles.clockZone}>{patientTimeObj.zone}</Text>
              </View>
            </View>

            {/* Relationship Input */}
            <Input
              label="Your relationship"
              placeholder="e.g. Son, Daughter, Guardian"
              value={relationship}
              onChangeText={setRelationship}
              autoCapitalize="words"
            />
          </View>
        </ScrollView>

        {/* Next Button (Fixed at Bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, !isFormValid && styles.disabledButton]}
            disabled={!isFormValid}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>
              Continue to Subscription
            </Text>
            <Feather 
              name="arrow-right" 
              size={20} 
              color={isFormValid ? "#FFFFFF" : "#9CA3AF"} 
              strokeWidth={3} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderTitleContainer: {
    alignItems: 'center',
  },
  navTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navStep: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: '#0463DD',
    marginTop: -2,
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  header: {
    marginBottom: 24,
    width: '100%',
    maxWidth: 361,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(4,9,33,0.6)',
  },
  formContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 16,
    marginBottom: 20,
  },
  pickerGroup: {
    gap: 6,
    width: '100%',
  },
  pickerLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    marginLeft: 2,
  },
  segmentedPicker: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 3,
    width: '100%',
    height: 44,
  },
  pickerSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  pickerSegmentActive: {
    backgroundColor: '#0463DD',
    shadowColor: 'rgba(4, 9, 33, 0.06)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerSegmentText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
  },
  pickerSegmentTextActive: {
    color: '#FFFFFF',
  },
  clockWidgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    marginVertical: 4,
  },
  clockColumn: {
    alignItems: 'center',
    flex: 1,
  },
  clockColumnLabel: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 11,
    color: '#0463DD',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  clockTime: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 22,
    color: '#040921',
  },
  clockZone: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 11,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -2,
  },
  syncIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(4, 9, 33, 0.02)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#0463DD',
    width: '100%',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});
