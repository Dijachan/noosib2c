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
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';
import OnboardingBg from '../../components/OnboardingBg';

export default function DevicePairingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [deviceId, setDeviceId] = useState('');
  
  // Animations
  const pulseAnim = useState(new Animated.Value(1))[0];
  const scanLineAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Pulsing animation for the status dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scanning line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240], // Height of the scanner area
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgContainer}>
        <OnboardingBg width={600} height={600} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Feather name="smartphone" size={32} color="#0463DD" />
            </View>
            <Text style={styles.title}>Pair Your Device</Text>
            <Text style={styles.subtitle}>
              Scan the QR code on your Noosi device or enter the ID manually to connect.
            </Text>
          </View>

          {/* QR Scanner Mock */}
          <View style={styles.scannerWrapper}>
            <View style={styles.scannerContainer}>
              {/* Corner Accents */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scan Line */}
              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
              
              <View style={styles.scannerPlaceholder}>
                <Feather name="maximize" size={120} color="rgba(255,255,255,0.2)" />
              </View>
            </View>

            {/* Connection Status Indicator */}
            <View style={styles.statusIndicator}>
              <Animated.View style={[styles.statusDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.statusText}>Searching for device...</Text>
            </View>
          </View>

          {/* Manual Input Section */}
          <View style={styles.manualInputSection}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Input 
              label="Device ID"
              placeholder="Enter 8-digit device ID"
              value={deviceId}
              onChangeText={setDeviceId}
              keyboardType="number-pad"
              autoCapitalize="characters"
            />
          </View>
        </ScrollView>

        {/* Action Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !deviceId && styles.disabledButton]}
            disabled={!deviceId}
            onPress={() => console.log('Connect to Device:', deviceId)}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
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
  bgContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 600,
    height: 600,
    marginLeft: -300,
    marginTop: -300,
    opacity: 0.5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: 'rgba(4,9,33,0.76)',
    lineHeight: 24,
    textAlign: 'center',
  },
  scannerWrapper: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 280,
    marginBottom: 40,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'rgba(4, 99, 221, 0.1)',
    backgroundColor: '#000000',
    overflow: 'hidden',
    shadowColor: '#0463DD',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    padding: 30,
    position: 'relative',
    width: 250,
    height: 250,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: '10%',
    width: '80%',
    height: 2,
    backgroundColor: '#0463DD',
    zIndex: 1,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#0463DD',
    zIndex: 20,
  },
  topLeft: {
    top: 25,
    left: 25,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 25,
    right: 25,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 25,
    left: 25,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 25,
    right: 25,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  manualInputSection: {
    width: '100%',
    marginBottom: 40,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(4,9,33,0.05)',
  },
  dividerText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: 'rgba(4,9,33,0.3)',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 16,
    alignSelf: 'center',
    backgroundColor: 'transparent',
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
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
