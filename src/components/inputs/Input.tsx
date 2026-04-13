import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
}

export default function Input({ label, icon, isPassword, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        {icon && (
          <Feather 
            name={icon} 
            size={20} 
            color={isFocused ? '#0463DD' : 'rgba(4,9,33,0.32)'} 
            style={styles.inputIcon} 
          />
        )}
        <TextInput 
          style={styles.input}
          placeholderTextColor="rgba(4,9,33,0.32)"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Feather 
              name={showPassword ? "eye" : "eye-off"} 
              size={20} 
              color={isFocused ? '#0463DD' : 'rgba(4,9,33,0.32)'} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 4,
    width: '100%',
  },
  label: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    marginLeft: 2,
  },
  labelFocused: {
    color: '#0463DD',
    fontFamily: 'Baloo2_700Bold',
  },
  inputWrapper: {
    width: '100%',
    height: 48,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.32)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.05)',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#040921',
  },
  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    padding: 4,
  },
});
