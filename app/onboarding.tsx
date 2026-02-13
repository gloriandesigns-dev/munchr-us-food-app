import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolation, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Order From Anywhere',
    description: 'Order food from home, work, or wherever you are.',
    image: 'https://www.dropbox.com/scl/fi/fr7ei2rx69a09ve1kfc53/WhatsApp-2.webp?rlkey=7rid17o6bzuwsgdisbh15rzjr&st=c9qfzk0r&dl=1', 
  },
  {
    id: '2',
    title: 'Pay Online',
    description: 'Pay securely online with no cash hassles.',
    image: 'https://www.dropbox.com/scl/fi/lfkyyw6tzqjt8d6moqirl/WhatsApp-1.webp?rlkey=f96cmx0e1gevx6xgzrdi48zqb&st=koy1o0tk&dl=1',
  },
  {
    id: '3',
    title: 'Skip the Line',
    description: 'We’ll notify you when your order is ready.',
    image: 'https://www.dropbox.com/scl/fi/zsly3a80z80o8f3xyzzd7/WhatsApp.webp?rlkey=179ib94ctzh5xdru3pjwzs52i&st=6ckm6vgy&dl=1',
  },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const getItemLayout = (data: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
             <Image 
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="contain"
             />
        </View>

        <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {SLIDES.map((_, i) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            
            const dotWidth = interpolate(
              scrollX.value,
              inputRange,
              [8, 24, 8],
              Extrapolation.CLAMP
            );

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              Extrapolation.CLAMP
            );

            return {
              width: dotWidth,
              opacity,
              backgroundColor: i === currentIndex ? Colors.primary : '#D3D3D3',
            };
          });

          return (
            <Animated.View 
              key={i.toString()} 
              style={[styles.dot, animatedDotStyle]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <AnimatedFlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        style={styles.flatList}
      />

      <View style={styles.bottomContainer}>
        <Paginator />
        <View style={styles.navigationContainer}>
            <TouchableOpacity 
                onPress={handleBack} 
                style={[styles.navButton, { opacity: currentIndex === 0 ? 0 : 1 }]}
                disabled={currentIndex === 0}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <Ionicons name="arrow-back" size={24} color="#9C9C9C" />
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={handleNext} 
                style={[styles.navButton, styles.nextButton]}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <Ionicons 
                    name="arrow-forward" 
                    size={24} 
                    color={Colors.white} 
                />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 10,
  },
  skipText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#9C9C9C',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 24,
    color: '#1C1C1C',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
  },
  bottomContainer: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
});
