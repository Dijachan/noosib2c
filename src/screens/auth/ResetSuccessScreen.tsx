import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function ResetSuccessScreen() {
  const navigation = useNavigation();

  const handleSignIn = () => {
    // Reset navigation state to Sign In instead of pushing
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="check-circle" size={80} color="#0463DD" />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Password Reset Successfully</Text>
            <Text style={styles.subtitle}>
              You can now log in with your new password.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleSignIn}
            >
              <Text style={styles.buttonText}>Sign In</Text>
              <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(4, 99, 221, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  header: {
    marginBottom: 48,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(4,9,33,0.76)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 361,
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
  buttonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
