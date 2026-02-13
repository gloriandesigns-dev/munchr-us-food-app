import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// --- Mock Data ---

const CATEGORIES = [
  { id: '1', name: 'All', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', name: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1892&auto=format&fit=crop' },
  { id: '3', name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=2000&auto=format&fit=crop' },
  { id: '4', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2000&auto=format&fit=crop' },
  { id: '5', name: 'Khichdi', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop' },
];

const FILTERS = ['Sort', 'New to you', 'Loved by friends', 'Near & Fast'];

const RESTAURANTS = [
  {
    id: '1',
    name: 'Maiz Mexican Kitchen',
    rating: '4.4',
    ratingCount: '8.2K+',
    time: '25-30 mins',
    isAd: true,
    dishes: [
      {
        id: 'd1',
        name: '1 x Fajita Black Bean Burrito Bowl',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop',
        price: 24.50,
        originalPrice: 32.50,
        isVeg: true,
      },
      {
        id: 'd2',
        name: '1 x Fajita Black Bean Burrito',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1964&auto=format&fit=crop',
        price: 24.50,
        originalPrice: 32.50,
        isVeg: true,
      }
    ]
  },
  {
    id: '2',
    name: 'The Stomach',
    rating: '4.3',
    ratingCount: '1.7K+',
    time: '25-30 mins',
    isAd: false,
    dishes: [
      {
        id: 'd3',
        name: '1 x Vegetable Manchurian Dry',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1974&auto=format&fit=crop',
        price: 23.08,
        originalPrice: 33.50,
        isVeg: true,
      },
      {
        id: 'd4',
        name: '1 x Chicken Fried Rice',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?q=80&w=1925&auto=format&fit=crop',
        price: 21.46,
        originalPrice: 30.96,
        isVeg: false,
      }
    ]
  },
  {
    id: '3',
    name: 'Tingl',
    rating: '4.4',
    ratingCount: '4.1K+',
    time: '20-25 mins',
    isAd: true,
    dishes: [
      {
        id: 'd5',
        name: '1 x Sabudana Sweet Potato Khichdi',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2070&auto=format&fit=crop',
        price: 21.00,
        originalPrice: 31.00,
        isVeg: true,
      }
    ]
  }
];

// --- Components ---

const DishCard = ({ dish, onPress }: { dish: typeof RESTAURANTS[0]['dishes'][0], onPress: () => void }) => (
  <TouchableOpacity style={styles.dishCard} onPress={onPress}>
    <View style={styles.dishImageContainer}>
      <Image source={{ uri: dish.image }} style={styles.dishImage} contentFit="cover" />
    </View>
    
    <View style={styles.dishContent}>
      <View style={styles.dishHeader}>
        <View style={[styles.vegIcon, !dish.isVeg && styles.nonVegIcon]}>
          <View style={[styles.vegDot, !dish.isVeg && styles.nonVegDot]} />
        </View>
        <ThemedText style={styles.dishName} weight="medium" numberOfLines={2}>{dish.name}</ThemedText>
      </View>
      
      <View style={styles.priceRow}>
        <ThemedText style={styles.price} weight="bold">${dish.price.toFixed(2)}</ThemedText>
        <ThemedText style={styles.originalPrice} fontFamily="dmsans">${dish.originalPrice.toFixed(2)}</ThemedText>
      </View>
      
      <View style={styles.footerRow}>
        <ThemedText style={styles.offerText} fontFamily="dmsans">Best offer applied</ThemedText>
        <View style={styles.viewCartBtn}>
          <ThemedText style={styles.viewCartText} weight="bold">Order Now</ThemedText>
          <MaterialIcons name="arrow-right" size={16} color={Colors.primary} />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const RestaurantSection = ({ restaurant, onPress }: { restaurant: typeof RESTAURANTS[0], onPress: () => void }) => (
  <View style={styles.restaurantSection}>
    <View style={styles.restaurantHeader}>
      <View>
        <ThemedText style={styles.restaurantName} weight="bold">{restaurant.name}</ThemedText>
        <View style={styles.restaurantMeta}>
          <Ionicons name="flash" size={12} color={Colors.green} style={{marginRight: 4}} />
          <ThemedText style={styles.metaText} fontFamily="dmsans">{restaurant.time}</ThemedText>
          {restaurant.isAd && (
            <>
              <ThemedText style={styles.metaDivider}>|</ThemedText>
              <ThemedText style={styles.adText} fontFamily="dmsans">Ad</ThemedText>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={10} color={Colors.white} style={{marginRight: 2}} />
        <ThemedText style={styles.ratingText} weight="bold">{restaurant.rating}</ThemedText>
      </View>
      <ThemedText style={styles.ratingCount} fontFamily="dmsans">By {restaurant.ratingCount}</ThemedText>
    </View>

    <FlatList
      data={restaurant.dishes}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.dishesList}
      renderItem={({ item }) => <DishCard dish={item} onPress={onPress} />}
    />
  </View>
);

export default function Under25Screen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleRestaurantPress = (id: string) => {
    // In a real app, we would navigate to the specific restaurant page
    // For now, we'll route to a generic restaurant detail or use ID '107' which has data
    router.push(`/restaurant/107`); 
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
      
      {/* Header (Reused) */}
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
            <TouchableOpacity style={styles.iconBtn}>
                <Feather name="globe" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn}>
                <View style={styles.profileAvatar}>
                    <ThemedText style={styles.profileInitial} weight="bold">G</ThemedText>
                </View>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={['#1E3A8A', '#111827']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            {/* Decorative Coins */}
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png' }} 
                style={[styles.coin, { top: 10, left: 20, width: 30, height: 30, transform: [{rotate: '-15deg'}] }]} 
            />
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png' }} 
                style={[styles.coin, { bottom: 10, right: 30, width: 40, height: 40, transform: [{rotate: '15deg'}] }]} 
            />
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png' }} 
                style={[styles.coin, { top: 20, right: 60, width: 20, height: 20, opacity: 0.7 }]} 
            />

            <View style={styles.bannerContent}>
              <View style={styles.bannerPaper}>
                <ThemedText style={styles.bannerTitle} weight="bold">MEALS UNDER $25</ThemedText>
              </View>
              <View style={styles.bannerRibbon}>
                <ThemedText style={styles.bannerSubtitle} weight="bold">FINAL PRICE, BEST OFFER APPLIED</ThemedText>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity key={cat.id} style={styles.categoryItem}>
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

        {/* Filters */}
        <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                <TouchableOpacity style={styles.filterChipOutline}>
                    <Ionicons name="options-outline" size={16} color={Colors.white} style={{marginRight: 4}} />
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Sort</ThemedText>
                    <Ionicons name="caret-down-outline" size={10} color={Colors.white} style={{marginLeft: 4}} />
                </TouchableOpacity>
                {FILTERS.slice(1).map((filter, i) => (
                    <TouchableOpacity key={i} style={styles.filterChip}>
                        {filter === 'Loved by friends' && <Ionicons name="people" size={12} color="#F5C043" style={{marginRight: 4}} />}
                        {filter === 'Near & Fast' && <Ionicons name="flash" size={12} color={Colors.green} style={{marginRight: 4}} />}
                        <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">{filter}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Restaurant List */}
        <View style={styles.listContainer}>
          {RESTAURANTS.map((restaurant) => (
            <RestaurantSection 
                key={restaurant.id} 
                restaurant={restaurant} 
                onPress={() => handleRestaurantPress(restaurant.id)}
            />
          ))}
        </View>

        {/* Bottom Padding for Tab Bar */}
        <View style={{ height: 100 }} />
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
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 140,
  },
  bannerGradient: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    position: 'absolute',
  },
  bannerContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  bannerPaper: {
    backgroundColor: '#FDF6E3', // Paper color
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: -10, // Overlap
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ rotate: '-1deg' }]
  },
  bannerTitle: {
    color: '#1E3A8A',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  bannerRibbon: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 20,
    zIndex: 3,
    transform: [{ rotate: '1deg' }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  bannerSubtitle: {
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    marginTop: 24,
    marginBottom: 20,
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
    width: 64,
    height: 64,
    borderRadius: 32,
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
    marginBottom: 24,
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
  filterText: {
    fontSize: 13,
    color: Colors.white,
  },
  listContainer: {
    paddingBottom: 20,
  },
  restaurantSection: {
    marginBottom: 24,
  },
  restaurantHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
  },
  restaurantName: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 4,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#AAA',
  },
  metaDivider: {
    color: '#555',
    marginHorizontal: 6,
    fontSize: 12,
  },
  adText: {
    fontSize: 12,
    color: '#888',
  },
  ratingBadge: {
    position: 'absolute',
    right: 16,
    top: 0,
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
  ratingCount: {
    position: 'absolute',
    right: 16,
    top: 24,
    fontSize: 10,
    color: '#888',
  },
  dishesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  dishCard: {
    width: 280,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  dishImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#222',
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  dishContent: {
    padding: 12,
  },
  dishHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  nonVegIcon: {
    borderColor: Colors.primary,
  },
  nonVegDot: {
    backgroundColor: Colors.primary,
  },
  dishName: {
    fontSize: 14,
    color: Colors.white,
    flex: 1,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: Colors.white,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  offerText: {
    fontSize: 11,
    color: '#8CA6DB', // Light blue-ish
  },
  viewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  viewCartText: {
    fontSize: 12,
    color: Colors.primary,
  },
});
