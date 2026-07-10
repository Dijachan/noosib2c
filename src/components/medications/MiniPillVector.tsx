import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MiniPillVectorProps {
  formFactor: string;
  pillColor: string;
  size?: number;
}

export default function MiniPillVector({
  formFactor,
  pillColor,
  size = 20,
}: MiniPillVectorProps) {
  const color = pillColor || '#06565F';

  switch (formFactor) {
    case 'Capsule':
      return (
        <View style={styles.miniCapsule}>
          <View style={[styles.miniCapsuleHalf, { backgroundColor: color }]} />
          <View style={[styles.miniCapsuleHalf, styles.miniCapsuleWhite]} />
        </View>
      );
    case 'Liquid':
      return (
        <Ionicons name="flask-outline" size={size} color={color} />
      );
    case 'Injection':
      return (
        <Ionicons name="eyedrop-outline" size={size} color={color} />
      );
    default: // Tablet
      return (
        <View style={[styles.miniTablet, { backgroundColor: color }]}>
          <View style={styles.miniTabletScore} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  miniTablet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTabletScore: {
    width: '100%',
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  miniCapsule: {
    width: 12,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.06)',
    overflow: 'hidden',
  },
  miniCapsuleHalf: {
    flex: 1,
  },
  miniCapsuleWhite: {
    backgroundColor: '#F1F5F9',
  },
});
