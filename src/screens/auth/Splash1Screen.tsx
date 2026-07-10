import React from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useFonts, Baloo2_400Regular, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

export default function Splash1Screen() {
  // Visual-only splash. Timing handled by App.tsx.
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/images/splash/logo_full_v2.png')} 
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          <Text style={styles.tagline}>
            Noosi, your Robo nurse for medication Management
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06565F',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.2,
  },
  tagline: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
    marginBottom: 20,
  }
});
