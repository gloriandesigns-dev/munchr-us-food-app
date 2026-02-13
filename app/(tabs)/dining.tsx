import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, FlatList, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ThemedText } from '../../components/ThemedText';
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- Mock Data ---

const GRAB_DEALS = [
  {
    id: '1',
    name: 'Blah!',
    offer: 'UP TO 20% OFF',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Baamee All Day Eatery',
    offer: 'UP TO 35% OFF',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Silken Feast',
    offer: 'FLAT 15% OFF',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop',
  }
];

const MOODS = [
  { id: '1', name: 'Romantic\ndining', image: 'https://www.dropbox.com/scl/fi/sbgqju4nu7pf960ad1dyh/WhatsApp-Image-2026-02-13-at-6.09.41-PM-8.webp?rlkey=41jw07w9r6r0mntkakhuqu08d&st=ftaz635s&dl=1' },
  { id: '2', name: 'North\nIndian', image: 'https://www.dropbox.com/scl/fi/00j8xatzdkc92h9gtzx5h/WhatsApp-Image-2026-02-13-at-6.09.41-PM-7.webp?rlkey=bp9hklapskl4fpuf9yw0dt86s&st=brjoveqn&dl=1' },
  { id: '3', name: 'Biryani', image: 'https://www.dropbox.com/scl/fi/ej53qpdj1jkorpojb62a1/WhatsApp-Image-2026-02-13-at-6.09.41-PM-6.webp?rlkey=cvpl51eg56zmlv7j0i2a0ib65&st=gafwn47c&dl=1' },
  { id: '4', name: 'Outdoor\ndining', image: 'https://www.dropbox.com/scl/fi/a2m2fx79mmxsi5t5sj1tw/WhatsApp-Image-2026-02-13-at-6.09.41-PM-5.webp?rlkey=rr7mb7ybqtc8s4wnwkoq1vvzz&st=ctcpecwz&dl=1' },
  { id: '5', name: 'Premium\ndining', image: 'https://www.dropbox.com/scl/fi/0wirld7sumonka8qq40u8/WhatsApp-Image-2026-02-13-at-6.09.41-PM-4.webp?rlkey=4uhjzokw8y57vahk2m4swi9i6&st=hnfgisu3&dl=1' },
  { id: '6', name: 'Buffet', image: 'https://www.dropbox.com/scl/fi/uezl4s9trpgcftyyx1u6d/WhatsApp-Image-2026-02-13-at-6.09.41-PM-3.webp?rlkey=mkf6zptjtu6i3bylzaldgt48z&st=j36rhmfc&dl=1' },
  { id: '7', name: 'Cozy\ncafes', image: 'https://www.dropbox.com/scl/fi/1vn45m7lry9fto6bcrpmm/WhatsApp-Image-2026-02-13-at-6.09.40-PM-2.webp?rlkey=n0frwi3ccutig8wj7bjstq6xs&st=tgam9ijz&dl=1' },
  { id: '8', name: 'Pubs & \nBars', image: 'https://www.dropbox.com/scl/fi/mqum14bw4sbyxqgsek9fh/WhatsApp-Image-2026-02-13-at-6.09.41-PM-1.webp?rlkey=gjdoysnvp0fwr36upwrm9g64f&st=48g0g9ly&dl=1' },
];

const LIMELIGHT = [
  {
    id: '1',
    name: 'Midnight Mirage',
    offer: 'Flat 30% OFF',
    image: 'https://www.dropbox.com/scl/fi/x1zstrpjzxgwarfvuzxmw/WhatsApp-Image-2026-02-13-at-6.09.41-PM-2.webp?rlkey=qbx44aybtajgzei2adtjwvnwm&st=uf729vmm&dl=1',
  },
  {
    id: '2',
    name: 'Golden Dragon',
    offer: 'Free Dessert',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?q=80&w=2069&auto=format&fit=crop',
  }
];

const BANK_OFFERS = [
    { id: '1', bank: 'HSBC', type: 'PREMIER CREDIT CARD', offer: '10% OFF', limit: 'up to $15' },
    { id: '2', bank: 'AURUM', type: 'CREDIT CARD', offer: '15% OFF', limit: 'up to $10' },
    { id: '3', bank: 'HSBC', type: 'PRIVE CREDIT CARD', offer: '12% OFF', limit: 'up to $20' },
];

const MUST_TRIES = [
    { id: '1', name: 'Sky high sips', image: 'https://www.dropbox.com/scl/fi/75lv18s57tvmzeghfedst/WhatsApp-Image-2026-02-13-at-6.09.40-PM-1.webp?rlkey=hasyy240ma324vf6lc9040f2p&st=rfxyfszi&dl=1' },
    { id: '2', name: 'Dine by the sea', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop' },
    { id: '3', name: 'Date Night', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop' },
];

const POPULAR_RESTAURANTS = [
    {
        id: '1',
        name: 'Hunky Dory',
        location: 'Hudson Yards, NYC',
        cuisine: 'North Indian • Continental',
        rating: '4.2',
        distance: '6.1km',
        price: '$45 for two',
        offer: 'Flat 40% OFF + 3 more',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'The Sassy Spoon',
        location: 'Manhattan, NYC',
        cuisine: 'European • Modern Indian',
        rating: '4.5',
        distance: '2.3km',
        price: '$60 for two',
        offer: 'Flat 20% OFF',
        image: 'https://www.dropbox.com/scl/fi/cfp62v47yhp73t6ov5e72/WhatsApp-Image-2026-02-13-at-6.09.40-PM.webp?rlkey=sh5hdtv0od1d687qkofbyayw0&st=si5jfn34&dl=1',
    },
    {
        id: '3',
        name: 'Glocal Junction',
        location: 'Brooklyn, NYC',
        cuisine: 'Fusion • Bar',
        rating: '4.0',
        distance: '4.5km',
        price: '$35 for two',
        offer: 'Happy Hour',
        image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1974&auto=format&fit=crop',
    }
];

const FILTERS = ['Filters', 'Offers', 'Near & Top Rated', 'Today\'s Special'];

// --- Components ---

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeaderContainer}>
    <View style={styles.sectionLine} />
    <ThemedText style={styles.sectionTitle} weight="medium">{title}</ThemedText>
    <View style={styles.sectionLine} />
  </View>
);

const DealCard = ({ item }: { item: typeof GRAB_DEALS[0] }) => (
  <TouchableOpacity style={styles.dealCard}>
    <Image source={{ uri: item.image }} style={styles.dealImage} contentFit="cover" />
    <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.dealGradient}
    />
    <View style={styles.dealContent}>
        <ThemedText style={styles.dealName} weight="bold">{item.name}</ThemedText>
        <View style={styles.dealBadge}>
            <ThemedText style={styles.dealBadgeText} weight="bold">{item.offer}</ThemedText>
        </View>
    </View>
  </TouchableOpacity>
);

const MoodItem = ({ item }: { item: typeof MOODS[0] }) => (
  <TouchableOpacity style={styles.moodItem}>
    <View style={styles.moodCard}>
        <Image source={{ uri: item.image }} style={styles.moodImage} contentFit="cover" />
        <View style={styles.moodImageOverlay} />
        <ThemedText style={styles.moodText} weight="medium">{item.name}</ThemedText>
    </View>
  </TouchableOpacity>
);

const LimelightCard = ({ item }: { item: typeof LIMELIGHT[0] }) => (
  <TouchableOpacity style={styles.limelightCard}>
    <Image source={{ uri: item.image }} style={styles.limelightImage} contentFit="cover" />
    <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={StyleSheet.absoluteFill}
    />
    
    {/* Top Left Badge */}
    <View style={styles.limelightBadgeTop}>
        <MaterialIcons name="local-offer" size={12} color={Colors.white} style={{marginRight: 4}} />
        <ThemedText style={styles.limelightBadgeText} weight="bold">{item.offer}</ThemedText>
    </View>

    {/* Bottom Name Badge */}
    <View style={styles.limelightNameBadge}>
        <ThemedText style={styles.limelightName} weight="bold">{item.name}</ThemedText>
    </View>
  </TouchableOpacity>
);

const BankOfferCard = ({ item }: { item: typeof BANK_OFFERS[0] }) => (
    <TouchableOpacity style={styles.bankCard}>
        <View style={styles.bankHeader}>
            <ThemedText style={styles.bankType} fontFamily="dmsans">{item.type}</ThemedText>
        </View>
        <View style={styles.bankLogoRow}>
            {/* Placeholder for Bank Logo */}
            {item.bank === 'AURUM' ? (
                <ThemedText style={[styles.bankLogoText, { color: '#F5C043', fontSize: 18 }]} weight="bold">AURUM</ThemedText>
            ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 16, height: 16, backgroundColor: 'red', transform: [{rotate: '45deg'}], marginRight: 4}} />
                    <ThemedText style={styles.bankLogoText} weight="bold">{item.bank}</ThemedText>
                </View>
            )}
        </View>
        <View style={styles.bankOfferContent}>
            <ThemedText style={styles.bankOfferText} weight="bold">{item.offer}</ThemedText>
            <ThemedText style={styles.bankLimitText} fontFamily="dmsans">{item.limit}</ThemedText>
        </View>
    </TouchableOpacity>
);

const HubCard = () => (
    <TouchableOpacity style={styles.hubCard}>
        <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.hubGradient}
        >
            <View style={styles.hubContent}>
                <View style={styles.hubLocationTag}>
                    <Ionicons name="location-sharp" size={12} color="#FF4B4B" />
                    <ThemedText style={styles.hubLocationText} weight="medium">{'<'} 700m</ThemedText>
                </View>
                <ThemedText style={styles.hubTitle} weight="bold">Hudson Yards</ThemedText>
                <View style={styles.hubCta}>
                    <ThemedText style={styles.hubCtaText} weight="bold">View all restaurants</ThemedText>
                    <Ionicons name="arrow-forward" size={12} color={Colors.white} />
                </View>
            </View>
            {/* Vector Illustration Placeholder */}
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942544.png' }} 
                style={styles.hubIllustration} 
                contentFit="contain"
            />
        </LinearGradient>
    </TouchableOpacity>
);

const MustTryCard = ({ item }: { item: typeof MUST_TRIES[0] }) => (
    <TouchableOpacity style={styles.mustTryCard}>
        <Image source={{ uri: item.image }} style={styles.mustTryImage} contentFit="cover" />
        <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
        />
        <ThemedText style={styles.mustTryText} weight="bold">{item.name}</ThemedText>
    </TouchableOpacity>
);

const DiningFeedCard = ({ item }: { item: typeof POPULAR_RESTAURANTS[0] }) => (
    <TouchableOpacity style={styles.feedCard}>
        <View style={styles.feedImageContainer}>
            <Image source={{ uri: item.image }} style={styles.feedImage} contentFit="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.feedGradient}
            />
            <View style={styles.bookmarkBtn}>
                <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
            </View>
            
            {/* Pre-Book Badge */}
            <View style={styles.preBookBadge}>
                <LinearGradient
                    colors={['#2D7AF7', '#1E3A8A']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={StyleSheet.absoluteFill}
                />
                <View style={{zIndex: 1, padding: 8}}>
                    <ThemedText style={styles.preBookTitle} weight="bold" fontFamily="dmsans">PRE-BOOK TABLE</ThemedText>
                    <ThemedText style={styles.preBookOffer} weight="bold">{item.offer}</ThemedText>
                </View>
            </View>
        </View>

        <View style={styles.feedContent}>
            <View style={styles.rowBetween}>
                <ThemedText style={styles.feedName} weight="bold">{item.name}</ThemedText>
                <View style={styles.ratingBadge}>
                    <ThemedText style={styles.ratingText} weight="bold">{item.rating}</ThemedText>
                    <Ionicons name="star" size={10} color={Colors.white} style={{marginLeft: 2}} />
                </View>
            </View>
            
            <ThemedText style={styles.feedLocation} fontFamily="dmsans">{item.location}</ThemedText>
            <ThemedText style={styles.feedCuisine} fontFamily="dmsans">{item.cuisine}</ThemedText>
            
            <View style={styles.feedFooter}>
                <ThemedText style={styles.feedDistance} fontFamily="dmsans">{item.distance}</ThemedText>
                <View style={styles.feedPriceBadge}>
                    <ThemedText style={styles.feedPrice} weight="medium">{item.price}</ThemedText>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

export default function DiningScreen() {
  const insets = useSafeAreaInsets();
  const [activeLimelight, setActiveLimelight] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={24} color={Colors.white} />
            <View style={{ marginLeft: 8 }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ThemedText style={styles.locationTitle} weight="bold">Hudson Yards</ThemedText>
                    <Ionicons name="chevron-down" size={16} color={Colors.white} />
                </View>
                <ThemedText style={styles.locationSubtitle} fontFamily="dmsans">New York, NY</ThemedText>
            </View>
        </View>
        <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="wallet-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: Colors.blue }]}>
                <ThemedText style={{color: 'white', fontWeight: 'bold'}}>G</ThemedText>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
                <TextInput 
                    placeholder="Search cuisines"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
                <View style={styles.searchDivider} />
                <TouchableOpacity>
                    <Ionicons name="mic-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.bannerContainer}>
            <LinearGradient
                colors={['#4A00E0', '#8E2DE2']} // Purple gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerGradient}
            >
                {/* Floating Money Icons */}
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2474/2474450.png' }} style={[styles.moneyIcon, { top: 10, left: 10, transform: [{rotate: '-20deg'}] }]} />
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2474/2474450.png' }} style={[styles.moneyIcon, { bottom: 10, right: 10, transform: [{rotate: '20deg'}] }]} />
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2474/2474450.png' }} style={[styles.moneyIcon, { top: 20, right: 40, width: 20, height: 20 }]} />

                <View style={styles.bannerContent}>
                    <View style={styles.bannerTicket}>
                        <ThemedText style={styles.bannerTitle} weight="bold">10% CASHBACK</ThemedText>
                        <View style={styles.bannerLine} />
                        <ThemedText style={styles.bannerSubtitle} fontFamily="dmsans">on every dining bill</ThemedText>
                    </View>
                    <TouchableOpacity style={styles.bannerButton}>
                        <ThemedText style={styles.bannerButtonText} weight="bold">Explore all offers</ThemedText>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>

        {/* Grab Your Deal */}
        <View style={styles.sectionContainer}>
            <SectionHeader title="GRAB YOUR DEAL" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                {GRAB_DEALS.map((item) => (
                    <DealCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>

        {/* In The Mood For */}
        <View style={styles.sectionContainer}>
            <SectionHeader title="IN THE MOOD FOR" />
            <View style={styles.gridContainer}>
                {MOODS.map((item) => (
                    <MoodItem key={item.id} item={item} />
                ))}
            </View>
        </View>

        {/* In The Limelight */}
        <View style={styles.sectionContainer}>
            <SectionHeader title="IN THE LIMELIGHT" />
            <FlatList
                data={LIMELIGHT}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
                    setActiveLimelight(index);
                }}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
                renderItem={({ item }) => <LimelightCard item={item} />}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {LIMELIGHT.map((_, i) => (
                    <View 
                        key={i} 
                        style={[
                            styles.dot, 
                            i === activeLimelight ? { backgroundColor: Colors.white } : { backgroundColor: '#555' }
                        ]} 
                    />
                ))}
            </View>
        </View>

        {/* Available Bank Offers */}
        <View style={styles.sectionContainer}>
            <SectionHeader title="AVAILABLE BANK OFFERS" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                {BANK_OFFERS.map((item) => (
                    <BankOfferCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>

        {/* Popular Hub */}
        <View style={styles.sectionContainer}>
            <SectionHeader title="POPULAR HUB NEAR YOU" />
            <View style={{ paddingHorizontal: 16 }}>
                <HubCard />
            </View>
        </View>

        {/* Must Tries */}
        <View style={styles.sectionContainer}>
            <SectionHeader title="MUST-TRIES IN NYC" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
                {MUST_TRIES.map((item) => (
                    <MustTryCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>

        {/* Popular Restaurants Feed */}
        <View style={[styles.sectionContainer, { marginBottom: 0 }]}>
            <SectionHeader title="POPULAR RESTAURANTS AROUND YOU" />
            
            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, marginBottom: 20 }}>
                <TouchableOpacity style={styles.filterChipOutline}>
                    <Ionicons name="options-outline" size={16} color={Colors.white} style={{marginRight: 4}} />
                    <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">Filters</ThemedText>
                    <Ionicons name="caret-down-outline" size={10} color={Colors.white} style={{marginLeft: 4}} />
                </TouchableOpacity>
                {FILTERS.slice(1).map((filter, i) => (
                    <TouchableOpacity key={i} style={[styles.filterChip, filter === 'Offers' && { backgroundColor: '#1E2A38', borderColor: '#2D7AF7' }]}>
                        {filter === 'Offers' && <Ionicons name="pricetag" size={12} color={Colors.blue} style={{marginRight: 4}} />}
                        <ThemedText style={styles.filterText} weight="medium" fontFamily="dmsans">{filter}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Restaurant List */}
            <View style={{ paddingHorizontal: 16, gap: 24 }}>
                {POPULAR_RESTAURANTS.map((item) => (
                    <DiningFeedCard key={item.id} item={item} />
                ))}
            </View>
        </View>

        {/* Bottom Padding for Floating Nav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Map Button */}
      <View style={styles.floatingMapContainer}>
        <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="map-outline" size={18} color={Colors.white} style={{marginRight: 6}} />
            <ThemedText style={styles.mapButtonText} weight="bold">Map</ThemedText>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111416', // Dark background as per reference
  },
  header: {
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
    fontSize: 16,
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
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2328',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#444',
    marginHorizontal: 10,
  },
  bannerContainer: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
  },
  bannerGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  moneyIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    opacity: 0.8,
  },
  bannerContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  bannerTicket: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 24,
    color: '#4A00E0',
    letterSpacing: -0.5,
  },
  bannerLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#333',
  },
  bannerButton: {
    backgroundColor: '#CCFF00', // Neon yellow/green
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: Colors.black,
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 40,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 2,
    marginHorizontal: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dealCard: {
    width: 220,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  dealContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  dealName: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dealBadge: {
    backgroundColor: '#4A00E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dealBadgeText: {
    color: Colors.white,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  moodItem: {
    width: (width - 32 - 36) / 4, // 4 columns with gap
    marginBottom: 12,
  },
  moodCard: {
    backgroundColor: '#1E2328',
    borderRadius: 12,
    height: 100,
    padding: 0,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  moodImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // 20% black opacity
    zIndex: 1,
  },
  moodText: {
    color: Colors.white,
    fontSize: 13, // Increased from 11 to 13
    lineHeight: 14,
    zIndex: 2,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  moodImage: {
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  limelightCard: {
    width: width - 32,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 16,
  },
  limelightImage: {
    width: '100%',
    height: '100%',
  },
  limelightBadgeTop: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.9)', // Blueish
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  limelightBadgeText: {
    color: Colors.white,
    fontSize: 12,
  },
  limelightNameBadge: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  limelightName: {
    color: Colors.black,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  floatingMapContainer: {
    position: 'absolute',
    bottom: 110, // Adjusted to sit above floating nav
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3E46', // Dark teal/slate
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  mapButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  // --- New Styles for Part 2 ---
  bankCard: {
      width: 140,
      height: 100,
      backgroundColor: '#25282E',
      borderRadius: 12,
      padding: 12,
      justifyContent: 'space-between',
  },
  bankHeader: {
      marginBottom: 4,
  },
  bankType: {
      fontSize: 8,
      color: '#888',
      letterSpacing: 0.5,
  },
  bankLogoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
  bankLogoText: {
      color: Colors.white,
      fontSize: 14,
  },
  bankOfferContent: {
      
  },
  bankOfferText: {
      color: Colors.white,
      fontSize: 16,
  },
  bankLimitText: {
      color: '#888',
      fontSize: 10,
  },
  hubCard: {
      width: '100%',
      height: 140,
      borderRadius: 24,
      overflow: 'hidden',
  },
  hubGradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      position: 'relative',
  },
  hubContent: {
      flex: 1,
      zIndex: 2,
  },
  hubLocationTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginBottom: 12,
  },
  hubLocationText: {
      color: '#003366',
      fontSize: 12,
      marginLeft: 4,
  },
  hubTitle: {
      fontSize: 22,
      color: '#003366', // Dark blue text
      marginBottom: 16,
  },
  hubCta: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#003366',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignSelf: 'flex-start',
  },
  hubCtaText: {
      color: Colors.white,
      fontSize: 12,
      marginRight: 4,
  },
  hubIllustration: {
      width: 120,
      height: 120,
      position: 'absolute',
      right: 0,
      bottom: 0,
      zIndex: 1,
  },
  mustTryCard: {
      width: 140,
      height: 180,
      borderTopLeftRadius: 70,
      borderTopRightRadius: 70,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      overflow: 'hidden',
      position: 'relative',
  },
  mustTryImage: {
      width: '100%',
      height: '100%',
  },
  mustTryText: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: Colors.white,
      fontSize: 16,
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
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
    backgroundColor: Colors.darkCard,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 13,
    color: Colors.white,
  },
  feedCard: {
      backgroundColor: '#1E2328',
      borderRadius: 24,
      overflow: 'hidden',
  },
  feedImageContainer: {
      width: '100%',
      height: 220,
      position: 'relative',
  },
  feedImage: {
      width: '100%',
      height: '100%',
  },
  feedGradient: {
      ...StyleSheet.absoluteFillObject,
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
    zIndex: 2,
  },
  preBookBadge: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      overflow: 'hidden',
  },
  preBookTitle: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 10,
      letterSpacing: 1,
      marginBottom: 2,
  },
  preBookOffer: {
      color: Colors.white,
      fontSize: 16,
  },
  feedContent: {
      padding: 16,
  },
  rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
  },
  feedName: {
      fontSize: 20,
      color: Colors.white,
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
  feedLocation: {
      color: '#AAA',
      fontSize: 14,
      marginBottom: 2,
  },
  feedCuisine: {
      color: '#888',
      fontSize: 12,
      marginBottom: 12,
  },
  feedFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#333',
      paddingTop: 12,
  },
  feedDistance: {
      color: Colors.white,
      fontSize: 14,
  },
  feedPriceBadge: {
      backgroundColor: '#333',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
  },
  feedPrice: {
      color: '#DDD',
      fontSize: 12,
  },
});
