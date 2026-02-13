import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, FlatList, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { CATEGORIES, FEED_RESTAURANTS, FILTERS } from '../../constants/MockData';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Reusing components from Home for consistency
const DeliveryTimeText = ({ time }: { time: string }) => (
    <ThemedText style={styles.cardMetaText} fontFamily="dmsans">{time}</ThemedText>
);

export default function CategoryListingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [activeCategory, setActiveCategory] = useState(id as string);
  const [isVegMode, setIsVegMode] = useState(false);

  // Get current category name for filtering
  const currentCategoryName = CATEGORIES.find(c => c.id === activeCategory)?.name || 'All';

  // --- Filtering Logic ---
  const getFilteredRestaurants = () => {
    let results = FEED_RESTAURANTS;

    // 1. Category Filter
    if (currentCategoryName !== 'All') {
        results = results.filter(r => 
            r.tags.some(tag => tag.toLowerCase() === currentCategoryName.toLowerCase())
        );
    }

    // 2. Veg Mode Filter
    if (isVegMode) {
        results = results.filter(r => r.isVeg);
    }

    return results;
  };

  const filteredFeed = getFilteredRestaurants();

  // Handle Category Change
  const handleCategoryPress = (catId: string) => {
    setActiveCategory(catId);
    // In a real app, we might want to push a new route, but for a filter feel, state update is smoother.
    // If "All" is selected, maybe go back to home? For now, we treat "All" as a reset on this page.
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
            <TextInput 
                placeholder="Restaurant name or a dish..."
                placeholderTextColor="#999"
                style={styles.searchInput}
            />
            <TouchableOpacity>
                <Ionicons name="mic-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Make filters sticky
      >
        {/* Categories Scroller */}
        <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity 
                        key={cat.id} 
                        style={styles.categoryItem}
                        onPress={() => handleCategoryPress(cat.id)}
                    >
                        <View style={styles.categoryImageContainer}>
                            <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                            {activeCategory === cat.id && <View style={styles.activeCategoryIndicator} />}
                        </View>
                        <ThemedText 
                            style={[styles.categoryText, activeCategory === cat.id && { color: Colors.white }]}
                            weight={activeCategory === cat.id ? 'bold' : 'regular'}
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
                
                {/* Veg Mode Toggle Chip */}
                <TouchableOpacity 
                    style={[styles.filterChip, isVegMode && styles.activeFilterChip]}
                    onPress={() => setIsVegMode(!isVegMode)}
                >
                    <Ionicons name="leaf" size={12} color={isVegMode ? Colors.black : Colors.green} style={{marginRight: 4}} />
                    <ThemedText 
                        style={[styles.filterText, isVegMode && { color: Colors.black }]}
                        weight="medium" 
                        fontFamily="dmsans"
                    >
                        Veg
                    </ThemedText>
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
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Recommended Header */}
        <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle} fontFamily="dmsans" weight="medium">
                {currentCategoryName === 'All' ? 'RECOMMENDED FOR YOU' : `BEST ${currentCategoryName.toUpperCase()} PLACES`}
            </ThemedText>
        </View>

        {/* Restaurant List */}
        <View style={styles.listContainer}>
            {filteredFeed.length > 0 ? (
                filteredFeed.map((restaurant) => (
                    <Animated.View entering={FadeIn} key={restaurant.id}>
                        <TouchableOpacity style={styles.restaurantCard}>
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
                    </Animated.View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <ThemedText style={styles.emptyText} color="#888">No restaurants found for this category.</ThemedText>
                </View>
            )}
        </View>
        
        {/* Bottom padding */}
        <View style={{height: 100}} />
      </ScrollView>
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
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkSearch,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 16,
    backgroundColor: Colors.darkBackground,
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 13,
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
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  }
});
