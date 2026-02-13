import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, StatusBar, SectionList, Text, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Image } from 'expo-image';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { getRestaurantDetails } from '../../constants/MockData';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { CustomizationSheet } from '../../components/CustomizationSheet';

const { width, height } = Dimensions.get('window');

const MENU_FILTERS = ['Filters', 'Veg', 'Non-veg', 'Highly reordered', 'Spicy', 'Sweet'];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const restaurant = getRestaurantDetails(id as string);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVegFilter, setIsVegFilter] = useState(false);
  
  // Cart State
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Customization State
  const [customizationVisible, setCustomizationVisible] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<any>(null);

  // Menu Modal State
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const sectionListRef = useRef<SectionList>(null);

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  const handleAddItem = (item: any) => {
      if (item.customizable) {
          setSelectedItemForCustomization(item);
          setCustomizationVisible(true);
      } else {
          addToCart(item, 1, item.price);
      }
  };

  const addToCart = (item: any, quantity: number, price: number) => {
      setCartItems(prev => ({
          ...prev,
          [item.id]: (prev[item.id] || 0) + quantity
      }));
      setTotalPrice(prev => prev + price);
  };

  const handleRemoveItem = (item: any) => {
      if (!cartItems[item.id]) return;
      
      setCartItems(prev => {
          const newState = { ...prev };
          if (newState[item.id] > 1) {
              newState[item.id] -= 1;
          } else {
              delete newState[item.id];
          }
          return newState;
      });
      setTotalPrice(prev => Math.max(0, prev - item.price));
  };

  const handleViewCart = () => {
      router.push('/cart');
  };

  const scrollToSection = (index: number) => {
      setMenuModalVisible(false);
      setTimeout(() => {
          sectionListRef.current?.scrollToLocation({
              sectionIndex: index,
              itemIndex: 0,
              animated: true,
              viewOffset: 100 // Adjust for sticky header
          });
      }, 300);
  };

  // Filter menu sections based on Veg toggle
  const filteredSections = restaurant.menuSections.map((section: any) => ({
      ...section,
      data: isVegFilter ? section.data.filter((item: any) => item.isVeg) : section.data
  })).filter((section: any) => section.data.length > 0);

  const renderHeroImage = ({ item }: { item: string }) => (
      <View style={styles.heroImageContainer}>
          <Image source={{ uri: item }} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
          />
      </View>
  );

  const renderHeader = () => (
    <View>
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
            <FlatList
                data={restaurant.images}
                renderItem={renderHeroImage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setActiveSlide(index);
                }}
            />
            
            <View style={styles.pagination}>
                {restaurant.images.map((_: any, i: number) => (
                    <View 
                        key={i} 
                        style={[
                            styles.dot, 
                            i === activeSlide ? { backgroundColor: Colors.white, width: 16 } : { backgroundColor: 'rgba(255,255,255,0.5)' }
                        ]} 
                    />
                ))}
            </View>

            {restaurant.featuredDish && (
                <View style={styles.featuredDishOverlay}>
                    <ThemedText style={styles.featuredDishText} weight="medium">
                        {restaurant.featuredDish} <Ionicons name="chevron-forward" size={12} color={Colors.white} />
                    </ThemedText>
                </View>
            )}
        </View>

        {/* INFO SECTION */}
        <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
                <ThemedText style={styles.restaurantName} weight="bold">{restaurant.name}</ThemedText>
                <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.ratingRow}>
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.white} style={{marginRight: 4}} />
                    <ThemedText style={styles.ratingText} weight="bold">{restaurant.rating}</ThemedText>
                </View>
                <ThemedText style={styles.ratingCount} fontFamily="dmsans">By {restaurant.ratingCount}</ThemedText>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Ionicons name="location-sharp" size={14} color="#AAA" style={{marginRight: 4}} />
                    <ThemedText style={styles.metaText} fontFamily="dmsans">{restaurant.distance} • {restaurant.address}</ThemedText>
                </View>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Ionicons name="flash" size={14} color={Colors.green} style={{marginRight: 4}} />
                    <ThemedText style={styles.metaText} fontFamily="dmsans">{restaurant.time} • Schedule for later</ThemedText>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
                {restaurant.tags.map((tag: string, i: number) => (
                    <View key={i} style={styles.tagBadge}>
                        {tag.includes('loved') && <Ionicons name="heart" size={10} color="#F5C043" style={{marginRight: 6}} />}
                        {tag.includes('reordered') && <Ionicons name="repeat" size={10} color={Colors.green} style={{marginRight: 6}} />}
                        <ThemedText style={styles.tagText} fontFamily="dmsans">{tag}</ThemedText>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.offerStrip}>
                <View style={styles.offerLeft}>
                    <View style={styles.offerIconBg}>
                        <FontAwesome5 name="lock" size={10} color="#8B6E28" />
                    </View>
                    <ThemedText style={styles.offerText} weight="medium">{restaurant.offer || 'Free delivery'}</ThemedText>
                </View>
                <View style={styles.offerRight}>
                    <ThemedText style={styles.offerCount} fontFamily="dmsans">{restaurant.offerCount} offers</ThemedText>
                    <Ionicons name="chevron-down" size={12} color="#AAA" />
                </View>
            </View>
        </View>

        {/* STICKY FILTERS */}
        <View style={styles.menuFilterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                <TouchableOpacity style={styles.filterChipOutline}>
                    <Ionicons name="options-outline" size={16} color={Colors.white} style={{marginRight: 4}} />
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Filters</ThemedText>
                    <Ionicons name="caret-down-outline" size={10} color={Colors.white} style={{marginLeft: 4}} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.filterChip, isVegFilter && styles.activeFilterChip]}
                    onPress={() => setIsVegFilter(!isVegFilter)}
                >
                    <View style={[styles.vegIcon, { borderColor: Colors.green }]}>
                        <View style={[styles.vegDot, { backgroundColor: Colors.green }]} />
                    </View>
                    <ThemedText style={[styles.filterText, isVegFilter && {color: Colors.black}]} weight="medium" fontFamily="dmsans">Veg</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterChip}>
                    <View style={[styles.vegIcon, { borderColor: Colors.primary }]}>
                        <View style={[styles.vegDot, { backgroundColor: Colors.primary }]} />
                    </View>
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Non-veg</ThemedText>
                </TouchableOpacity>
                
                {/* Category Tabs */}
                 <TouchableOpacity style={styles.filterChip}>
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Recommended</ThemedText>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.filterChip}>
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Bowls</ThemedText>
                </TouchableOpacity>

                {MENU_FILTERS.slice(3).map((filter, i) => (
                    <TouchableOpacity key={i} style={styles.filterChip}>
                        <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">{filter}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    </View>
  );

  const renderMenuItem = ({ item }: { item: any }) => {
      const count = cartItems[item.id] || 0;

      return (
        <View style={styles.menuItem}>
            <View style={styles.menuItemInfo}>
                <View style={[styles.vegIcon, !item.isVeg && { borderColor: Colors.primary }]}>
                    <View style={[styles.vegDot, !item.isVeg && { backgroundColor: Colors.primary }]} />
                </View>
                
                {item.isBestseller && (
                    <View style={styles.bestsellerBadge}>
                        <Ionicons name="star" size={8} color="#F5C043" style={{marginRight: 2}} />
                        <ThemedText style={styles.bestsellerText} weight="medium">Highly reordered</ThemedText>
                    </View>
                )}

                <ThemedText style={styles.menuItemName} weight="bold">{item.name}</ThemedText>
                <ThemedText style={styles.menuItemPrice} weight="bold" fontFamily="dmsans">${item.price.toFixed(2)}</ThemedText>
                <ThemedText style={styles.menuItemDesc} fontFamily="dmsans" numberOfLines={2}>{item.desc}</ThemedText>
            </View>
            
            <View style={styles.menuItemImageContainer}>
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                
                {/* ADD BUTTON */}
                <View style={styles.addBtnContainer}>
                    {count === 0 ? (
                        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddItem(item)}>
                            <ThemedText style={styles.addBtnText} weight="bold">ADD</ThemedText>
                            <Ionicons name="add" size={12} color={Colors.primary} style={{position: 'absolute', top: 2, right: 2}} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.qtyBtn}>
                             <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.qtyAction}>
                                <Ionicons name="remove" size={16} color={Colors.white} />
                             </TouchableOpacity>
                             <ThemedText style={styles.qtyText} weight="bold">{count}</ThemedText>
                             <TouchableOpacity onPress={() => handleAddItem(item)} style={styles.qtyAction}>
                                <Ionicons name="add" size={16} color={Colors.white} />
                             </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
      );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SectionList
        ref={sectionListRef}
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle} weight="bold">{title}</ThemedText>
            </View>
        )}
        ListHeaderComponent={renderHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FLOATING HEADER */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="search" size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                  <Feather name="user-plus" size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
              </TouchableOpacity>
          </View>
      </View>

      {/* FLOATING CART BAR */}
      {cartCount > 0 && (
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.cartBarContainer}>
              <View style={styles.cartBar}>
                  <View style={styles.cartInfo}>
                      <ThemedText style={styles.cartCountText} weight="bold">{cartCount} item{cartCount > 1 ? 's' : ''} added</ThemedText>
                      <ThemedText style={styles.cartTotalText} weight="bold" fontFamily="dmsans">Total: ${totalPrice.toFixed(2)}</ThemedText>
                  </View>
                  <TouchableOpacity style={styles.viewCartBtn} onPress={handleViewCart}>
                      <ThemedText style={styles.viewCartText} weight="bold">View cart</ThemedText>
                      <Ionicons name="chevron-forward" size={16} color={Colors.white} />
                  </TouchableOpacity>
              </View>
              
              {/* Unlock Offer Tip */}
              <View style={styles.cartTip}>
                  <View style={styles.percentIcon}>
                      <ThemedText style={{color: Colors.white, fontSize: 10, fontWeight: 'bold'}}>%</ThemedText>
                  </View>
                  <ThemedText style={styles.cartTipText} fontFamily="dmsans">Unlock Flat $5 OFF on orders above $30</ThemedText>
              </View>
          </Animated.View>
      )}

      {/* FLOATING MENU FAB */}
      <TouchableOpacity 
        style={[styles.menuFab, cartCount > 0 && { bottom: 90 }]}
        onPress={() => setMenuModalVisible(true)}
      >
          <MaterialIcons name="restaurant-menu" size={20} color={Colors.white} style={{marginRight: 8}} />
          <ThemedText style={styles.menuFabText} weight="bold">Menu</ThemedText>
      </TouchableOpacity>

      {/* Customization Sheet */}
      <CustomizationSheet 
          visible={customizationVisible}
          item={selectedItemForCustomization}
          onClose={() => setCustomizationVisible(false)}
          onAdd={addToCart}
      />

      {/* Menu Modal */}
      <Modal
        visible={menuModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setMenuModalVisible(false)}
        >
            <View style={styles.menuModalContent}>
                <View style={styles.menuModalHeader}>
                    <ThemedText style={styles.menuModalTitle} weight="bold">Menu</ThemedText>
                    <TouchableOpacity onPress={() => setMenuModalVisible(false)}>
                        <Ionicons name="close" size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.menuModalScroll}>
                    {filteredSections.map((section: any, index: number) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.menuModalItem}
                            onPress={() => scrollToSection(index)}
                        >
                            <ThemedText style={styles.menuModalItemText} fontFamily="dmsans">{section.title}</ThemedText>
                            <ThemedText style={styles.menuModalItemCount} fontFamily="dmsans">{section.data.length}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111416',
  },
  heroContainer: {
    height: 350,
    position: 'relative',
  },
  heroImageContainer: {
    width: width,
    height: 350,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featuredDishOverlay: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  featuredDishText: {
    color: Colors.white,
    fontSize: 12,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#111416',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    color: Colors.white,
    flex: 1,
    marginRight: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.white,
  },
  ratingCount: {
    fontSize: 12,
    color: '#AAA',
  },
  metaRow: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#DDD',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25282E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  tagText: {
    fontSize: 12,
    color: '#DDD',
  },
  offerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2328',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerIconBg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5C043',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  offerText: {
    fontSize: 14,
    color: Colors.white,
  },
  offerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerCount: {
    fontSize: 12,
    color: '#AAA',
    marginRight: 4,
  },
  menuFilterContainer: {
    backgroundColor: '#111416',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
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
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
    backgroundColor: '#1E2328',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilterChip: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  filterText: {
    fontSize: 13,
    color: Colors.white,
  },
  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  sectionHeader: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
      backgroundColor: '#111416',
  },
  sectionTitle: {
      fontSize: 18,
      color: Colors.white,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 24,
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 16,
  },
  bestsellerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      marginTop: 4,
  },
  bestsellerText: {
      color: '#F5C043',
      fontSize: 10,
  },
  menuItemName: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 8,
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  menuItemImageContainer: {
    width: 120,
    alignItems: 'center',
    position: 'relative',
  },
  menuItemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#222',
  },
  addBtnContainer: {
      position: 'absolute',
      bottom: -12,
      width: 90,
      height: 36,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
  },
  addBtn: {
    backgroundColor: '#1E2328', // Dark background
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: Colors.primary, // Red text
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.primary,
      borderRadius: 8,
      flex: 1,
      paddingHorizontal: 8,
  },
  qtyAction: {
      padding: 4,
  },
  qtyText: {
      color: Colors.white,
      fontSize: 16,
  },
  customizableText: {
    fontSize: 10,
    color: '#888',
    marginTop: 16,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 100,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuFab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#444',
    zIndex: 90,
  },
  menuFabText: {
    color: Colors.white,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cartBarContainer: {
      position: 'absolute',
      bottom: 20,
      left: 16,
      right: 16,
      zIndex: 100,
  },
  cartBar: {
      backgroundColor: Colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
  },
  cartInfo: {
      
  },
  cartCountText: {
      color: Colors.white,
      fontSize: 12,
      textTransform: 'uppercase',
      marginBottom: 2,
      opacity: 0.9,
  },
  cartTotalText: {
      color: Colors.white,
      fontSize: 16,
  },
  viewCartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  viewCartText: {
      color: Colors.white,
      fontSize: 16,
  },
  cartTip: {
      backgroundColor: '#2D7AF7', // Blue tip
      marginTop: -10,
      paddingTop: 16,
      paddingBottom: 6,
      paddingHorizontal: 12,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      zIndex: -1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
  },
  cartTipText: {
      color: Colors.white,
      fontSize: 11,
  },
  percentIcon: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuModalContent: {
    backgroundColor: '#1E2328',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
    paddingBottom: 40,
  },
  menuModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuModalTitle: {
    color: Colors.white,
    fontSize: 18,
  },
  menuModalScroll: {
    padding: 16,
  },
  menuModalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  menuModalItemText: {
    color: Colors.white,
    fontSize: 16,
  },
  menuModalItemCount: {
    color: '#888',
    fontSize: 14,
  },
});
