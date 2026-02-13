import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemedText } from '../components/ThemedText';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalContext';
import { 
    HERO_SLIDES, 
    CATEGORIES, 
    FEATURED_RESTAURANTS, 
    NEW_FOR_YOU, 
    FEED_RESTAURANTS, 
    EXPLORE_MORE, 
    FILTERS 
} from '../constants/MockData';

const { width, height } = Dimensions.get('window');

// --- Components ---

const DeliveryTimeText = ({ time }: { time: string }) => {
  const [showTime, setShowTime] = useState(true);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
      setTimeout(() => {
        setShowTime(prev => !prev);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Animated.Text style={[styles.cardMetaText, animatedStyle]}>
      {showTime ? time : 'Near & Fast'}
    </Animated.Text>
  );
};

const FeaturedCard = ({ item, onPress }: { item: typeof FEATURED_RESTAURANTS[0], onPress: () => void }) => {
    const [activeImage, setActiveImage] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let next = activeImage + 1;
            if (next >= item.images.length) next = 0;
            
            flatListRef.current?.scrollToIndex({ index: next, animated: true });
            setActiveImage(next);
        }, 4000);
        return () => clearInterval(interval);
    }, [activeImage]);

    return (
        <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.featuredImageContainer}>
                <FlatList 
                    ref={flatListRef}
                    data={item.images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item: img }) => (
                        <Image source={{ uri: img }} style={styles.featuredImage} contentFit="cover" />
                    )}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
                        setActiveImage(index);
                    }}
                    getItemLayout={(_, index) => ({
                        length: width - 32,
                        offset: (width - 32) * index,
                        index,
                    })}
                />
                
                {/* Pagination Dots */}
                <View style={styles.featuredPagination}>
                    {item.images.map((_, i) => (
                        <View 
                            key={i} 
                            style={[
                                styles.featuredDot, 
                                i === activeImage ? { backgroundColor: Colors.white, opacity: 1 } : { backgroundColor: 'rgba(255,255,255,0.5)' }
                            ]} 
                        />
                    ))}
                </View>

                {/* Top Overlay Badges */}
                <View style={styles.featuredOverlayTop}>
                     <View style={styles.priceBadge}>
                        <ThemedText style={styles.priceBadgeText} weight="medium">{item.tags[0]} • {item.price} for one</ThemedText>
                     </View>
                     <TouchableOpacity style={styles.bookmarkBtnSmall}>
                        <Ionicons name="bookmark-outline" size={16} color={Colors.white} />
                     </TouchableOpacity>
                </View>
            </View>

            <View style={styles.featuredContent}>
                <View style={styles.rowBetween}>
                    <ThemedText style={styles.featuredTitle} weight="bold">{item.name}</ThemedText>
                    <View style={styles.ratingBadge}>
                        <ThemedText style={styles.ratingText} weight="bold">{item.rating}</ThemedText>
                        <Ionicons name="star" size={10} color={Colors.white} style={{marginLeft: 2}} />
                    </View>
                </View>
                <ThemedText style={styles.featuredMeta} fontFamily="dmsans" weight="medium">
                    <Ionicons name="flash" size={12} color={Colors.green} /> {item.time}  |  {item.distance}
                </ThemedText>
                
                <View style={styles.offerRow}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/879/879757.png' }} style={{width: 14, height: 14, tintColor: Colors.blue, marginRight: 6}} />
                    <ThemedText style={styles.offerTextBlue} fontFamily="dmsans" weight="bold">{item.offer}</ThemedText>
                </View>

                {item.socialProof && (
                    <View style={styles.socialProofRow}>
                         <View style={styles.socialAvatars}>
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop' }} 
                                style={styles.socialAvatar} 
                            />
                         </View>
                         <ThemedText style={styles.socialProofText} fontFamily="dmsans">{item.socialProof}</ThemedText>
                         <Ionicons name="chevron-down" size={12} color="#888" style={{marginLeft: 4}} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const VegToggle = ({ isVeg, onToggle }: { isVeg: boolean; onToggle: () => void }) => {
    return (
        <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.vegToggleContainer}>
            <Animated.View style={[styles.vegToggleTrack, isVeg ? styles.vegToggleTrackActive : styles.vegToggleTrackInactive]}>
                <Animated.View style={[styles.vegToggleThumb, isVeg ? styles.vegToggleThumbActive : styles.vegToggleThumbInactive]}>
                    {isVeg && <Ionicons name="leaf" size={10} color={Colors.green} />}
                </Animated.View>
            </Animated.View>
            <ThemedText style={styles.vegToggleLabel} weight="bold" fontFamily="dmsans">VEG</ThemedText>
        </TouchableOpacity>
    );
};

const VegModeOnOverlay = () => {
    return (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={styles.overlayContainer}>
            <View style={styles.ringsContainer}>
                {[1, 2, 3].map((ring, index) => (
                    <View key={index} style={[styles.ring, { width: 200 + index * 100, height: 200 + index * 100, opacity: 0.1 + (0.05 * (3 - index)) }]} />
                ))}
            </View>
            
            <View style={styles.vegBadgeLarge}>
                <ThemedText style={styles.vegBadgeTextLarge} weight="bold">100%</ThemedText>
                <ThemedText style={styles.vegBadgeTextLarge} weight="bold">VEG</ThemedText>
            </View>
            
            <ThemedText style={styles.overlayText} fontFamily="dmsans">Explore veg dishes from all restaurants</ThemedText>
        </Animated.View>
    );
};

const VegModeOffOverlay = () => {
    return (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={styles.overlayContainer}>
            <ActivityIndicator size="large" color={Colors.green} style={{ marginBottom: 20 }} />
            <ThemedText style={styles.overlayText} fontFamily="dmsans">Switching off Veg Mode for you</ThemedText>
        </Animated.View>
    );
};


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isVegMode, setVegMode } = useGlobalContext();
  const [activeSlide, setActiveSlide] = useState(0);
  const slideRef = useRef<FlatList>(null);
  
  const [transitionState, setTransitionState] = useState<'none' | 'turning-on' | 'turning-off'>('none');

  // Filtered Data
  const filteredCategories = isVegMode ? CATEGORIES.filter(c => c.isVeg) : CATEGORIES;
  const filteredFeatured = isVegMode ? FEATURED_RESTAURANTS.filter(r => r.isVeg) : FEATURED_RESTAURANTS;
  const filteredNewForYou = isVegMode ? NEW_FOR_YOU.filter(i => i.isVeg) : NEW_FOR_YOU;
  const filteredFeed = isVegMode ? FEED_RESTAURANTS.filter(r => r.isVeg) : FEED_RESTAURANTS;
  const filteredHero = isVegMode ? HERO_SLIDES.filter(s => s.isVeg) : HERO_SLIDES;

  const handleToggleVegMode = () => {
      if (isVegMode) {
          // Turn OFF
          setTransitionState('turning-off');
          setTimeout(() => {
              setVegMode(false);
              setTransitionState('none');
          }, 1500);
      } else {
          // Turn ON
          setTransitionState('turning-on');
          setTimeout(() => {
              setVegMode(true);
              setTransitionState('none');
          }, 2000);
      }
  };

  const handleCategoryPress = (catId: string) => {
      router.push(`/category/${catId}`);
  };

  const handleRestaurantPress = (id: string) => {
      router.push(`/restaurant/${id}`);
  };

  const handleProfilePress = () => {
      router.push('/profile');
  };

  // Auto-carousel logic for Hero
  useEffect(() => {
    const interval = setInterval(() => {
      if (filteredHero.length > 0) {
        let nextIndex = activeSlide + 1;
        if (nextIndex >= filteredHero.length) {
            nextIndex = 0;
        }
        slideRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setActiveSlide(nextIndex);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlide, filteredHero]);

  const renderHeroItem = ({ item }: { item: typeof HERO_SLIDES[0] }) => (
    <View style={styles.heroCardContainer}>
        <View style={[styles.heroCard, { backgroundColor: item.bgColor }]}>
             <Image 
                source={{ uri: item.image }} 
                style={styles.heroImage} 
                contentFit="cover" 
            />
            {/* Dark overlay for text readability */}
            <View style={styles.heroOverlay} />

            <View style={styles.heroContent}>
                <ThemedText style={styles.heroTitle} weight="bold">
                    {item.title.split('\n')[0]}
                    {'\n'}
                    <Text style={{color: item.accentColor}}>{item.title.split('\n')[1]}</Text>
                </ThemedText>
                <ThemedText style={styles.heroSubtitle} fontFamily="dmsans">{item.subtitle}</ThemedText>
                
                <TouchableOpacity style={styles.orderNowBtn}>
                    <ThemedText style={styles.orderNowText} fontFamily="dmsans" weight="bold">Order now</ThemedText>
                    <Ionicons name="chevron-forward" size={12} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={24} color={Colors.primary} />
            <View style={{ marginLeft: 8 }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ThemedText style={styles.locationTitle} weight="bold">New York, NY</ThemedText>
                    <Ionicons name="chevron-down" size={16} color={Colors.white} />
                </View>
                <ThemedText style={styles.locationSubtitle} fontFamily="dmsans">Manhattan, 10001</ThemedText>
            </View>
        </View>
        <View style={styles.headerActions}>
            <VegToggle isVeg={isVegMode} onToggle={handleToggleVegMode} />
            <TouchableOpacity style={styles.profileBtn} onPress={handleProfilePress}>
                <View style={styles.profileAvatar}>
                    <ThemedText style={styles.profileInitial} weight="bold">G</ThemedText>
                </View>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]} // Make filters sticky
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
                <TextInput 
                    placeholder="Restaurant name or a dish..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                />
                <View style={styles.searchDivider} />
                <TouchableOpacity>
                    <Ionicons name="mic-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>
        </View>

        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
            <FlatList
                ref={slideRef}
                data={filteredHero}
                renderItem={renderHeroItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setActiveSlide(index);
                }}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {filteredHero.map((_, i) => (
                    <View 
                        key={i} 
                        style={[
                            styles.dot, 
                            i === activeSlide ? { backgroundColor: Colors.white, width: 16 } : { backgroundColor: 'rgba(255,255,255,0.3)' }
                        ]} 
                    />
                ))}
            </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {filteredCategories.map((cat, index) => (
                    <TouchableOpacity 
                        key={cat.id} 
                        style={styles.categoryItem}
                        onPress={() => handleCategoryPress(cat.id)}
                    >
                        <View style={styles.categoryImageContainer}>
                            <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                            {index === 0 && <View style={styles.activeCategoryIndicator} />}
                        </View>
                        <ThemedText 
                            style={[styles.categoryText, index === 0 && { color: Colors.white }]}
                            weight={index === 0 ? 'bold' : 'regular'}
                            fontFamily="dmsans"
                        >
                            {cat.name}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Filters (Sticky) */}
        <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                <TouchableOpacity style={styles.filterChipOutline}>
                    <Ionicons name="options-outline" size={16} color={Colors.white} style={{marginRight: 4}} />
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Filters</ThemedText>
                    <Ionicons name="caret-down-outline" size={10} color={Colors.white} style={{marginLeft: 4}} />
                </TouchableOpacity>
                {FILTERS.slice(1).map((filter, i) => (
                    <TouchableOpacity key={i} style={[styles.filterChip, filter === 'Near & Fast' && styles.activeFilterChip]}>
                        {filter === 'Near & Fast' && <Ionicons name="flash" size={12} color={Colors.black} style={{marginRight: 4}} />}
                        <ThemedText 
                            style={[styles.filterText, filter === 'Near & Fast' && { color: Colors.black }]}
                            weight={filter === 'Near & Fast' ? 'bold' : 'medium'}
                            fontFamily="dmsans"
                        >
                            {filter}
                        </ThemedText>
                        {filter === 'New to you' && <View style={styles.newBadge} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* 6. Explore More */}
        <View style={styles.sectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                {EXPLORE_MORE.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.exploreCard}>
                        <View style={[styles.exploreIconContainer, { backgroundColor: item.color + '20' }]}>
                            <Ionicons name={item.icon as any} size={20} color={item.color} />
                        </View>
                        <ThemedText style={styles.exploreText} weight="medium" fontFamily="dmsans">{item.name}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* 7. Restaurant Count Header */}
        <View style={styles.countHeader}>
            <ThemedText style={styles.countText} fontFamily="dmsans">
                {isVegMode ? '1,402 veg restaurants delivering to you' : '2,887 restaurants delivering to you'}
            </ThemedText>
        </View>

        {/* 8. Featured Restaurants */}
        <View style={styles.sectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                {filteredFeatured.map((item) => (
                    <FeaturedCard key={item.id} item={item} onPress={() => handleRestaurantPress(item.id)} />
                ))}
            </ScrollView>
        </View>

        {/* 9. New For You */}
        <View style={[styles.sectionContainer, { marginTop: 24 }]}>
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionSubtitle} fontFamily="dmsans" weight="medium">NEW FOR YOU</ThemedText>
                <ThemedText style={styles.sectionTitleLarge} weight="bold">Most ordered by friends</ThemedText>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                {filteredNewForYou.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.newCard} onPress={() => handleRestaurantPress(item.id)}>
                        <View style={styles.newCardImageContainer}>
                            <Image source={{ uri: item.image }} style={styles.newCardImage} />
                            <View style={styles.offerBadgeAbsolute}>
                                <ThemedText style={styles.offerText} weight="bold" fontFamily="dmsans">{item.offer}</ThemedText>
                            </View>
                        </View>
                        <View style={styles.newCardContent}>
                            <View style={styles.rowBetween}>
                                <ThemedText style={styles.newCardTitle} weight="bold" numberOfLines={2}>{item.name}</ThemedText>
                            </View>
                            <View style={styles.rowStart}>
                                <View style={styles.ratingBadgeSmall}>
                                    <ThemedText style={styles.ratingTextSmall} weight="bold" fontFamily="dmsans">{item.rating}</ThemedText>
                                    <Ionicons name="star" size={8} color={Colors.white} style={{marginLeft: 2}} />
                                </View>
                                <ThemedText style={styles.metaDot} fontFamily="dmsans">•</ThemedText>
                                <ThemedText style={styles.metaTextSmall} fontFamily="dmsans">{item.time}</ThemedText>
                            </View>
                            <View style={styles.socialBadge}>
                                <ThemedText style={styles.socialBadgeText} fontFamily="dmsans" weight="medium">{item.social}</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* 10. Continuous Restaurant Feed */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <ThemedText style={styles.sectionTitle} fontFamily="dmsans" weight="medium">ALL RESTAURANTS</ThemedText>
        </View>

        <View style={styles.listContainer}>
            {filteredFeed.map((restaurant) => (
                <TouchableOpacity key={restaurant.id} style={styles.restaurantCard} onPress={() => handleRestaurantPress(restaurant.id)}>
                    <View style={styles.cardImageContainer}>
                        <Image source={{ uri: restaurant.image }} style={styles.cardImage} />
                        <View style={styles.bookmarkBtn}>
                            <Ionicons name="heart-outline" size={20} color={Colors.white} />
                        </View>
                        {restaurant.offer ? (
                            <View style={styles.offerBadge}>
                                <ThemedText style={styles.offerText} weight="bold" fontFamily="dmsans">{restaurant.offer}</ThemedText>
                            </View>
                        ) : null}
                        {restaurant.promoted && (
                            <View style={styles.promotedBadge}>
                                <ThemedText style={styles.promotedText} fontFamily="dmsans">Ad</ThemedText>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.cardContent}>
                        <View style={styles.cardHeaderRow}>
                            <ThemedText style={styles.restaurantName} weight="bold" numberOfLines={1}>{restaurant.name}</ThemedText>
                            <View style={styles.ratingBadge}>
                                <ThemedText style={styles.ratingText} weight="bold">{restaurant.rating}</ThemedText>
                                <Ionicons name="star" size={10} color={Colors.white} style={{marginLeft: 2}} />
                            </View>
                        </View>
                        
                        <View style={styles.cardMetaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="flash" size={12} color={Colors.green} style={{marginRight: 4}} />
                                <DeliveryTimeText time={restaurant.time} />
                            </View>
                            <ThemedText style={styles.metaDot} fontFamily="dmsans">•</ThemedText>
                            <ThemedText style={styles.cardMetaText} fontFamily="dmsans">{restaurant.distance}</ThemedText>
                            <ThemedText style={styles.metaDot} fontFamily="dmsans">•</ThemedText>
                            <ThemedText style={styles.cardMetaText} fontFamily="dmsans">$$</ThemedText>
                        </View>
                        
                        <View style={styles.tagsRow}>
                            {restaurant.tags.map((tag, i) => (
                                <ThemedText key={i} style={styles.tagText} fontFamily="dmsans">
                                    {tag}{i < restaurant.tags.length - 1 ? ', ' : ''}
                                </ThemedText>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
        
        {/* Bottom padding for scroll */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Transition Overlays */}
      {transitionState === 'turning-on' && <VegModeOnOverlay />}
      {transitionState === 'turning-off' && <VegModeOffOverlay />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  header: {
    backgroundColor: Colors.darkHeader,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    color: Colors.white,
    marginRight: 4,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 18,
    color: '#BCAAA4',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: Colors.darkHeader,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkSearch,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#555',
    marginHorizontal: 10,
  },
  heroContainer: {
    marginTop: 20,
    height: 200,
  },
  heroCardContainer: {
    width: width,
    paddingHorizontal: 16,
  },
  heroCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTitle: {
    fontSize: 24,
    color: Colors.white,
    marginBottom: 8,
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  orderNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  orderNowText: {
    fontSize: 12,
    color: Colors.white,
    marginRight: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    width: 6,
  },
  categoriesContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryImageContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  activeCategoryIndicator: {
    position: 'absolute',
    bottom: -4,
    left: '20%',
    width: '60%',
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
  },
  filtersContainer: {
    backgroundColor: Colors.darkBackground,
    paddingVertical: 12,
    marginBottom: 10,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
    backgroundColor: Colors.darkCard,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipOutline: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  activeFilterChip: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  filterText: {
    fontSize: 13,
    color: Colors.white,
  },
  newBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  restaurantCard: {
    backgroundColor: Colors.darkBackground,
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.blue,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  offerText: {
    fontSize: 10,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  promotedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  promotedText: {
    color: 'white',
    fontSize: 10,
  },
  cardContent: {
    paddingTop: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 20,
    color: Colors.white,
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.white,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardMetaText: {
    fontSize: 14,
    color: Colors.white,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDot: {
    marginHorizontal: 6,
    color: '#666',
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagText: {
    fontSize: 14,
    color: '#888',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  exploreCard: {
    alignItems: 'center',
    width: 70,
  },
  exploreIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  exploreText: {
    fontSize: 12,
    color: Colors.white,
  },
  countHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  countText: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 0.5,
  },
  featuredCard: {
    width: width - 32,
    backgroundColor: Colors.darkCard,
    borderRadius: 24,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  featuredImage: {
    width: width - 32,
    height: 220,
  },
  featuredPagination: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
  },
  featuredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featuredOverlayTop: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  priceBadgeText: {
    color: Colors.white,
    fontSize: 12,
  },
  bookmarkBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 22,
    color: Colors.white,
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredMeta: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 12,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerTextBlue: {
    fontSize: 14,
    color: Colors.blue,
  },
  socialProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  socialAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkCard,
  },
  socialProofText: {
    fontSize: 12,
    color: '#CCC',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitleLarge: {
    fontSize: 20,
    color: Colors.white,
  },
  newCard: {
    width: 160,
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    overflow: 'hidden',
  },
  newCardImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  newCardImage: {
    width: '100%',
    height: '100%',
  },
  offerBadgeAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.blue,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomRightRadius: 12,
  },
  newCardContent: {
    padding: 12,
  },
  newCardTitle: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 8,
    height: 36, // Fixed height for 2 lines
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  ratingTextSmall: {
    fontSize: 10,
    color: Colors.white,
  },
  metaTextSmall: {
    fontSize: 10,
    color: '#888',
  },
  socialBadge: {
    backgroundColor: '#3E2C20', // Brownish
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  socialBadgeText: {
    fontSize: 10,
    color: '#F5C043', // Gold
  },
  
  // --- Veg Mode Components ---
  vegToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  vegToggleTrack: {
      width: 44,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      paddingHorizontal: 2,
  },
  vegToggleTrackActive: {
      backgroundColor: Colors.green,
  },
  vegToggleTrackInactive: {
      backgroundColor: '#444',
  },
  vegToggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
  },
  vegToggleThumbActive: {
      alignSelf: 'flex-end',
  },
  vegToggleThumbInactive: {
      alignSelf: 'flex-start',
  },
  vegToggleLabel: {
      fontSize: 12,
      color: Colors.white,
      letterSpacing: 0.5,
  },
  overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#111416', // Dark background
      zIndex: 100,
      alignItems: 'center',
      justifyContent: 'center',
  },
  ringsContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
  },
  ring: {
      position: 'absolute',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: Colors.green,
  },
  vegBadgeLarge: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: Colors.green,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111416',
      marginBottom: 30,
  },
  vegBadgeTextLarge: {
      color: Colors.green,
      fontSize: 24,
      lineHeight: 28,
  },
  overlayText: {
      color: '#CCC',
      fontSize: 16,
      textAlign: 'center',
  },
});
