import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const NUM_BARS = 9;

export default function VoiceCommandScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const barAnims = useRef(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(10))
  ).current;
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isListening) {
      animRef.current = setInterval(() => {
        barAnims.forEach(anim => {
          Animated.timing(anim, {
            toValue: Math.random() * 60 + 10,
            duration: 200,
            useNativeDriver: false,
          }).start();
        });
      }, 220);

      // Simulate speech transcription with a small delay
      const transcriptTimer = setTimeout(() => {
        setTranscript('Schedule Lisinopril 10mg every morning');
      }, 2000);

      return () => {
        if (animRef.current) clearInterval(animRef.current);
        clearTimeout(transcriptTimer);
      };
    } else {
      if (animRef.current) clearInterval(animRef.current);
      barAnims.forEach(anim => {
        Animated.timing(anim, {
          toValue: 10,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isListening]);

  const handleToggle = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTranscript('');
    }
  };

  const handleConfirm = () => {
    if (!transcript) {
      Alert.alert('No Command', 'Please speak a command first.');
      return;
    }
    Alert.alert(
      'Action Confirmed',
      `Adding medication from voice: "${transcript}"`,
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Schedule', {
            drugData: {
              name: 'Lisinopril',
              brand: 'Zestril',
              strength: '10mg',
              formFactor: 'Tablet',
              pillColor: '#10B981',
              instructions: 'Take every morning.',
            },
          }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Command</Text>
        <View style={styles.navPlaceholder} />
      </View>

      <View style={styles.container}>
        {/* Waveform Panel */}
        <View style={styles.wavePanel}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, !isListening && styles.statusDotPaused]} />
            <Text style={[styles.statusText, !isListening && styles.statusTextPaused]}>
              {isListening ? 'Listening...' : 'Paused'}
            </Text>
          </View>

          <View style={styles.waveContainer}>
            {barAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: anim,
                    backgroundColor: isListening ? '#06565F' : '#D1D5DB',
                  },
                ]}
              />
            ))}
          </View>

          <Text style={styles.waveHint}>
            {isListening
              ? 'Speak clearly into your microphone'
              : 'Tap the mic to start listening'}
          </Text>
        </View>

        {/* Transcript Box */}
        <View style={styles.transcriptBox}>
          <View style={styles.transcriptHeader}>
            <Feather name="file-text" size={16} color="rgba(4,9,33,0.5)" />
            <Text style={styles.transcriptLabel}>Live Transcript</Text>
          </View>
          <Text style={styles.transcriptText}>
            {transcript || 'Waiting for speech...'}
          </Text>
        </View>

        {/* Mic Toggle Button */}
        <TouchableOpacity
          style={[styles.micBtn, !isListening && styles.micBtnPaused]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Feather
            name={isListening ? 'mic' : 'mic-off'}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={styles.micLabel}>{isListening ? 'Tap to stop' : 'Tap to listen'}</Text>

        {/* Confirm Action Button */}
        {transcript.length > 0 && (
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Feather name="check" size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.confirmBtnText}>Confirm Action</Text>
          </TouchableOpacity>
        )}
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
  headerTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: 'rgba(4,9,33,0.76)',
  },
  navPlaceholder: {
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 24,
  },
  wavePanel: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.04)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  statusDotPaused: {
    backgroundColor: '#9CA3AF',
  },
  statusText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: '#10B981',
  },
  statusTextPaused: {
    color: '#9CA3AF',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 80,
  },
  waveBar: {
    width: 8,
    borderRadius: 4,
  },
  waveHint: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    textAlign: 'center',
  },
  transcriptBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transcriptLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transcriptText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 18,
    color: '#0F172A',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#06565F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#06565F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  micBtnPaused: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
  },
  micLabel: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 13,
    color: 'rgba(4,9,33,0.4)',
    marginTop: -12,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#10B981',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginTop: 8,
  },
  confirmBtnText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
