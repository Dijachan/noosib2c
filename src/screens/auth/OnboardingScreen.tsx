import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated as RNAnimated,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';

import OnboardingBg from '../../components/OnboardingBg';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = 361;

const ONBOARDING_DATA = [
  { id: '1', title: 'Medication\nMistakes Happen.', subtitle: 'Patients miss doses,\ncaregivers struggle.', image: require('../../../assets/images/onboarding/onboarding_device_view1.jpg') },
  { id: '2', title: 'Meet Noosi,\nYour Assistant.', subtitle: 'Automates dispensing\nand tracks in real-time.', image: require('../../../assets/images/onboarding/onboarding_device_view2.jpg') },
  { id: '3', title: 'Safe, Secure\n& Reliable.', subtitle: 'Encrypted health data\nwith offline support.', image: require('../../../assets/images/onboarding/onboarding_device_view3.jpg') },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to Auth/SignUp screen
      navigation.replace('SignUp');
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
    } else {
      navigation.goBack();
      // or navigation.replace('Splash2')
    }
  };

  const skipToLast = () => {
    slidesRef.current?.scrollToIndex({ index: ONBOARDING_DATA.length - 1 });
  };

  return (
    <View style={styles.container}>

      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={scrollToPrevious} style={styles.backButton}>
          <Feather name="chevron-left" size={20} color="rgba(4,9,33,0.76)" />
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
          {ONBOARDING_DATA.map((_, index) => {
            const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: ['rgba(4,9,33,0.08)', '#040921', 'rgba(4,9,33,0.08)'],
              extrapolate: 'clamp',
            });

            return (
              <RNAnimated.View
                key={index.toString()}
                style={[styles.dot, { backgroundColor: dotColor }]}
              />
            );
          })}
        </View>

        <TouchableOpacity onPress={skipToLast}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Blur Card & Carousel */}
      <View style={styles.cardWrapper}>
        <BlurView intensity={60} tint="light" style={styles.blurCard}>
          {/* White overlay to ensure it closely matches the "bg-white backdrop-blur" effect */}
          <View style={styles.cardOverlay} />
          
          <FlatList
            data={ONBOARDING_DATA}
            ref={slidesRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <View style={styles.imageContainer}>
                  <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
          />
        </BlurView>
      </View>

      {/* Background SVG Blob - Centered, Rendered AFTER card to float over it */}
      <View style={styles.bgContainer} pointerEvents="none">
        <OnboardingBg width={600} height={600} />
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.nextButton} onPress={scrollToNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNav: {
    position: 'absolute',
    top: 68,
    width: CARD_WIDTH,
    left: '50%',
    marginLeft: -(CARD_WIDTH / 2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(4,9,33,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 8,
    width: 44,
    borderRadius: 30,
  },
  skipText: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 14,
    color: 'rgba(4,9,33,0.6)',
    letterSpacing: 0.2,
  },
  cardWrapper: {
    position: 'absolute',
    top: 140,
    left: '50%',
    marginLeft: -(CARD_WIDTH / 2),
    alignItems: 'center',
    zIndex: 10,
  },
  blurCard: {
    width: CARD_WIDTH,
    height: 487,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: 'rgba(4, 9, 33, 0.1)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 10,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  slide: {
    width: CARD_WIDTH,
    height: 487,
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  textContainer: {
    paddingHorizontal: 32,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 30,
    lineHeight: 40,
    color: 'rgba(4,9,33,0.76)',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(4,9,33,0.76)',
    width: 191,
  },
  bottomSection: {
    position: 'absolute',
    top: 735,
    left: '50%',
    marginLeft: -(CARD_WIDTH / 2),
    width: CARD_WIDTH,
    alignItems: 'center',
    zIndex: 20,
  },
  nextButton: {
    backgroundColor: '#0463DD',
    width: CARD_WIDTH,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  nextButtonText: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 20,
    lineHeight: 32,
    color: '#FFFFFF',
  },
});
