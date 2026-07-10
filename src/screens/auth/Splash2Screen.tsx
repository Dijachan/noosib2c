import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useFonts, Baloo2_400Regular, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MoonSvg from '../../components/MoonSvg';
import LoaderSvg from '../../components/LoaderSvg';

const { width } = Dimensions.get('window');

export default function Splash2Screen() {
  // Visual-only splash. Timing handled by App.tsx.
  return (
    <LinearGradient
      colors={['#06565F', '#D6FB00']}
      start={{ x: 0.1, y: 0.2 }}
      end={{ x: 0.9, y: 0.8 }}
      style={styles.container}
    >
      {/* Background Pattern */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.backgroundImage}>
          <MoonSvg width="100%" height="100%" color="rgba(255, 255, 255, 0.4)" />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.centerSection}>
            <Image 
              source={require('../../../assets/images/splash/logo_text_v2.png')} 
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.title}>Your Health, Reimagined</Text>
            <Text style={styles.subtitle}>
              Take control of your health from the tips of your finger
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <LoaderSvg width={50} height={50} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: width,
    position: 'absolute',
    top: '30%',
    left: '-20%',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.42,
    height: width * 0.21,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  bottomSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  }
});
