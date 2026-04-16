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
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/inputs/Input';
import OnboardingBg from '../../components/OnboardingBg';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Alert, ActivityIndicator } from 'react-native';

export default function DevicePairingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, refreshOnboarding, mockNextStep } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState('NOOSI-77');
  const [scanned, setScanned] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setDeviceId(data);
    // Vibrate or play sound could be added here
    setTimeout(() => setScanned(false), 2000); // Allow scanning again after 2 seconds
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

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
          {/* Custom Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
            </TouchableOpacity>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Main Content (Centered) */}
          <View style={styles.mainContent}>
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Pair Your Device</Text>
              <Text style={styles.subtitle}>
                Scan the QR code on your Noosi device or enter the ID manually to connect.
              </Text>
            </View>

            {/* QR Scanner */}
            <View style={styles.scannerContainer}>
              {permission.granted ? (
                <CameraView
                  style={[StyleSheet.absoluteFillObject, { opacity: cameraReady ? 1 : 0 }]}
                  onCameraReady={() => setCameraReady(true)}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                />
              ) : (
                <View style={styles.permissionContainer}>
                  <Feather name="camera-off" size={40} color="rgba(4,9,33,0.3)" />
                  <Text style={styles.permissionText}>Camera access is required to scan QR codes</Text>
                  <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Enable Camera</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Corner Accents */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              {/* Scan Line */}
              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
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
          </View>
        </ScrollView>

        {/* Action Button (Fixed at bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, (!deviceId || isLoading) && styles.disabledButton]}
            disabled={!deviceId || isLoading}
            onPress={() => {
              setIsLoading(true);
              // Fake pairing sequence
              setTimeout(() => {
                mockNextStep();
                setIsLoading(false);
              }, 1500);
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" />
              </>
            )}
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
    paddingBottom: 40,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    width: '100%',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  navPlaceholder: {
    width: 42,
    height: 42,
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
  scannerContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 280,
    marginBottom: 40,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'rgba(4, 99, 221, 0.1)',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#0463DD',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
  permissionContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: '#0463DD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  permissionBtnText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
