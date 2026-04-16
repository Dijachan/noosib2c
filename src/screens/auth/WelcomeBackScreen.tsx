import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/inputs/Input';

export default function WelcomeBackScreen() {
  const { user, unlock, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fullName = user?.user_metadata?.full_name || 'Caregiver';
  const firstName = fullName.split(' ')[0];

  const handleUnlock = async () => {
    if (!password) return;
    
    setIsLoading(true);
    try {
      await unlock(password);
    } catch (error: any) {
      Alert.alert('Access Denied', 'Incorrect password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{firstName[0]}</Text>
              </View>
              <View style={styles.statusDot} />
            </View>
            
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.subtitle}>Enter your password to unlock the dashboard.</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Password"
              placeholder="xxxxxxxxxxx"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
            
            <TouchableOpacity onPress={handleUnlock} style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.primaryButton, !password && styles.disabledButton]}
            onPress={handleUnlock}
            disabled={!password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Unlock Dashboard</Text>
                <Feather name="lock" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={signOut}>
            <Text style={styles.switchText}>Switch Account</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0463DD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0463DD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarText: {
    fontSize: 40,
    fontFamily: 'Baloo2_700Bold',
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#15F597',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  greeting: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 18,
    color: 'rgba(4,9,33,0.6)',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 32,
    color: '#040921',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: 'rgba(4,9,33,0.6)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
  },
  forgotPass: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  forgotPassText: {
    color: '#0463DD',
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#0463DD',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#0463DD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 16,
    color: 'rgba(4,9,33,0.6)',
    textDecorationLine: 'underline',
  },
});
