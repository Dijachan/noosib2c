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
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

const PLANS = [
  {
    id: 'free',
    name: 'Basic Care',
    price: '$0',
    period: '/ month',
    badge: null,
    features: [
      { text: 'Standard push notifications', included: true },
      { text: '1 patient care profile', included: true },
      { text: 'Caregiver invitations', included: true },
      { text: 'Voice & WhatsApp alerts', included: false }
    ]
  },
  {
    id: 'premium',
    name: 'Premium Circle',
    price: '$15',
    period: '/ month',
    badge: 'RECOMMENDED',
    features: [
      { text: '3-Tier Escalation Alerts (Push → SMS → Voice)', included: true },
      { text: 'Unlimited caregivers & patient profiles', included: true },
      { text: 'Real-time photo verification & logs', included: true },
      { text: 'Automated WhatsApp escalation checks', included: true }
    ]
  }
];

export default function SubscriptionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { mockLogin } = useAuth();
  
  const [selectedPlanId, setSelectedPlanId] = useState('premium');
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mockLogin('not_started');
    }, 1500);
  };

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
              <Text style={styles.navTitle}>Choose Plan</Text>
              <Text style={styles.navStep}>Step 2 of 2</Text>
            </View>
            <View style={styles.navPlaceholder} />
          </View>

          {/* Title Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose a care plan</Text>
            <Text style={styles.subtitle}>
              Select the plan that fits best for your remote care coordination.
            </Text>
          </View>

          {/* Pricing Cards */}
          <View style={styles.cardsContainer}>
            {PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardActive
                  ]}
                  onPress={() => setSelectedPlanId(plan.id)}
                  activeOpacity={0.9}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  {/* Header info */}
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        <Text style={styles.planPeriod}>{plan.period}</Text>
                      </View>
                    </View>

                    <View style={[styles.selectCircle, isSelected && styles.selectCircleActive]}>
                      {isSelected && <View style={styles.selectCircleInner} />}
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Features List */}
                  <View style={styles.featuresList}>
                    {plan.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureRow}>
                        <Feather
                          name={feature.included ? 'check-circle' : 'x-circle'}
                          size={15}
                          color={feature.included ? '#10B981' : 'rgba(4,9,33,0.24)'}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            !feature.included && styles.featureTextExcluded
                          ]}
                        >
                          {feature.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Continue Button (Fixed at Bottom) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            disabled={isLoading}
            onPress={handleFinish}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Finish & Setup Patient</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
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
  cardsContainer: {
    width: '100%',
    maxWidth: 361,
    gap: 16,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.08)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  planCardActive: {
    borderColor: '#0463DD',
    backgroundColor: 'rgba(4, 99, 221, 0.03)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 16,
    backgroundColor: '#0463DD',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  planName: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  planPrice: {
    fontFamily: 'Baloo2_800ExtraBold',
    fontSize: 28,
    color: '#040921',
    lineHeight: 32,
  },
  planPeriod: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: 'rgba(4,9,33,0.5)',
    marginLeft: 2,
    marginBottom: 2,
  },
  selectCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(4,9,33,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectCircleActive: {
    borderColor: '#0463DD',
  },
  selectCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0463DD',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(4,9,33,0.06)',
    marginVertical: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.7)',
    flex: 1,
  },
  featureTextExcluded: {
    color: 'rgba(4,9,33,0.3)',
    textDecorationLine: 'line-through',
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
});
