import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMedication } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  plan?: {
    name: string;
    brand: string;
    strength: string;
    frequency: string;
    time: string;
  };
}

export default function AIChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { addMedication, medicationList } = useMedication();
  const { patientProfile } = useAuth();
  
  const patientName = patientProfile?.name || 'Grandpa Kunle';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am scanning ${patientName}'s records. Do you want to 'Add medication' or check 'Adherence this week'?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Mock AI Response with Extracted Action Plan if user wants to add Metformin
    setTimeout(() => {
      setIsTyping(false);
      
      const lower = textToSend.toLowerCase();
      let reply: Message;

      if (lower.includes('metformin') || lower.includes('add')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'I detected a prescription setup instruction. Here is the extracted dosing details:',
          plan: {
            name: 'Metformin',
            brand: 'Glucophage',
            strength: '500mg',
            frequency: 'Daily',
            time: '08:00 AM - With Breakfast',
          },
        };
      } else if (lower.includes('adherence')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `${patientName}'s overall adherence is 86% this week. They missed one Metformin dose at 8 AM on Tuesday, but took all Lisinopril doses successfully.`,
        };
      } else {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Got it. I'm ready to coordinate ${patientName}'s prescriptions. Tell me to 'Add Metformin' or 'Check adherence'.`,
        };
      }

      setMessages(prev => [...prev, reply]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const handleConfirmWrite = async (plan: NonNullable<Message['plan']>) => {
    // Check for Lisinopril Conflict Interception before saving!
    const hasConflict = medicationList.some(m => 
      m.name.toLowerCase().includes('lisinopril') || 
      m.brand?.toLowerCase().includes('zestril')
    );

    const proposedMed = {
      id: 'ai-extracted-' + Date.now().toString(),
      name: plan.name,
      brand: plan.brand,
      dosage: plan.strength,
      type: 'Tablet',
      dosageAmount: '1',
      dosageUnit: 'Tablet',
      slot: 3,
      frequency: plan.frequency,
      time: plan.time,
      date: 'Daily',
      instructions: 'Take with water after food.',
      status: 'Pending' as const,
      stock: '60',
      daysLeft: 60,
      priority: 'Maintenance' as const,
      formFactor: 'Tablet' as const,
      pillColor: '#06565F',
    };

    if (hasConflict) {
      // Redirect to Conflict Alert screen!
      navigation.navigate('AIConflictAlert', {
        newMed: proposedMed,
        existingMed: medicationList.find(m => 
          m.name.toLowerCase().includes('lisinopril') || 
          m.brand?.toLowerCase().includes('zestril')
        )
      });
    } else {
      try {
        await addMedication(proposedMed);
        Alert.alert('Medication Added', `${plan.name} has been added from chat.`);
        navigation.navigate('CareSchedule');
      } catch (e) {
        Alert.alert('Error', 'Failed to add medication.');
      }
    }
  };

  const handleEditPlan = (plan: NonNullable<Message['plan']>) => {
    navigation.navigate('SearchDrug', {
      editMed: {
        name: plan.name,
        brand: plan.brand,
        dosage: plan.strength,
        frequency: plan.frequency,
        time: plan.time,
      },
      isEditing: true
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="rgba(4,9,33,0.76)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Noosi AI Assistant</Text>
          <View style={styles.navPlaceholder} />
        </View>

        {/* Scroll Thread */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatThread}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View 
              key={msg.id} 
              style={[
                styles.messageContainer, 
                msg.sender === 'user' ? styles.userContainer : styles.aiContainer
              ]}
            >
              {msg.sender === 'ai' && (
                <View style={styles.avatar}>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.bubbleWrapper}>
                <View 
                  style={[
                    styles.bubble, 
                    msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : styles.aiText
                  ]}>
                    {msg.text}
                  </Text>
                </View>

                {/* Inline Action Plan Card */}
                {msg.plan && (
                  <View style={styles.planCard}>
                    <View style={styles.planHeader}>
                      <Ionicons name="clipboard" size={18} color="#06565F" />
                      <Text style={styles.planTitle}>Extracted Action Plan</Text>
                    </View>
                    <View style={styles.planBody}>
                      <View style={styles.planRow}>
                        <Text style={styles.planLabel}>Medicine</Text>
                        <Text style={styles.planVal}>{msg.plan.name} ({msg.plan.brand})</Text>
                      </View>
                      <View style={styles.planRow}>
                        <Text style={styles.planLabel}>Strength</Text>
                        <Text style={styles.planVal}>{msg.plan.strength}</Text>
                      </View>
                      <View style={styles.planRow}>
                        <Text style={styles.planLabel}>Frequency</Text>
                        <Text style={styles.planVal}>{msg.plan.frequency}</Text>
                      </View>
                      <View style={styles.planRow}>
                        <Text style={styles.planLabel}>Time</Text>
                        <Text style={styles.planVal}>{msg.plan.time}</Text>
                      </View>
                    </View>
                    <View style={styles.planButtons}>
                      <TouchableOpacity 
                        style={styles.planBtnSecondary}
                        onPress={() => handleEditPlan(msg.plan!)}
                      >
                        <Text style={styles.planBtnTextSecondary}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.planBtnPrimary}
                        onPress={() => handleConfirmWrite(msg.plan!)}
                      >
                        <Text style={styles.planBtnTextPrimary}>Confirm & Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiContainer]}>
              <View style={styles.avatar}>
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </View>
              <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#06565F" />
                <Text style={styles.typingText}>Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestion Prompts */}
        <View style={styles.promptContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptScroll}>
            {[
              'Add Metformin 500mg daily at 8:00 AM',
              'Check Adherence this week',
              'Pause alerts for today'
            ].map(prompt => (
              <TouchableOpacity
                key={prompt}
                style={styles.promptChip}
                onPress={() => handleSend(prompt)}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('PrescriptionScanner')}
            activeOpacity={0.8}
          >
            <Feather name="camera" size={20} color="#64748B" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('VoiceCommand')}
            activeOpacity={0.8}
          >
            <Feather name="mic" size={20} color="#64748B" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Ask Noosi AI..."
            placeholderTextColor="rgba(4,9,33,0.3)"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend(inputText)}
          />

          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend(inputText)}
            activeOpacity={0.8}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={18} color="#D6FB00" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
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
  chatThread: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    gap: 10,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#06565F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubbleWrapper: {
    maxWidth: '80%',
    gap: 8,
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userBubble: {
    backgroundColor: '#06565F',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#0F172A',
  },
  typingText: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 14,
    color: '#06565F',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.08)',
    borderRadius: 20,
    padding: 16,
    width: 270,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  planTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 14,
    color: '#06565F',
  },
  planBody: {
    gap: 6,
    marginBottom: 14,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planLabel: {
    fontFamily: 'Baloo2_500Medium',
    fontSize: 12,
    color: 'rgba(4,9,33,0.4)',
  },
  planVal: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#0F172A',
  },
  planButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  planBtnSecondary: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planBtnTextSecondary: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.5)',
  },
  planBtnPrimary: {
    flex: 2,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#06565F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planBtnTextPrimary: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  promptContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  promptScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  promptText: {
    fontFamily: 'Baloo2_600SemiBold',
    fontSize: 12,
    color: 'rgba(4,9,33,0.6)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontFamily: 'Baloo2_500Medium',
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(4,9,33,0.06)',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#06565F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
});
