import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ThemedText } from '../components/ThemedText';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring, SlideOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'reached' | 'delivered';

const STATUS_CONFIG = {
    placed: {
        title: 'Order placed',
        subtitle: 'Food preparation will begin shortly',
        color: '#1A4D2E', // Dark Green
        icon: 'receipt-outline'
    },
    preparing: {
        title: 'Preparing your order',
        subtitle: 'Arriving in 20 mins • On time',
        color: '#1A4D2E',
        icon: 'restaurant-outline'
    },
    out_for_delivery: {
        title: 'Out for delivery',
        subtitle: 'Arriving in 12 mins',
        color: '#1A4D2E',
        icon: 'bicycle-outline'
    },
    reached: {
        title: 'Reached your location',
        subtitle: 'Coming to your doorstep',
        color: '#1A4D2E',
        icon: 'location-outline'
    },
    delivered: {
        title: 'Delivered',
        subtitle: 'Enjoy your meal!',
        color: '#1A4D2E',
        icon: 'checkmark-circle-outline'
    }
};

const TIPS = [3, 5, 7];
const FEEDBACK_TAGS = [
    "Fast delivery", "Polite attitude", "Location awareness", 
    "Responsive", "Neat & Clean", "Food handling", "Minimal calling"
];

export default function OrderTrackingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [status, setStatus] = useState<OrderStatus>('placed');
    const [selectedTip, setSelectedTip] = useState<number | null>(null);
    const [rating, setRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    // Animation Values
    const progress = useSharedValue(0);

    // Simulate Order Lifecycle
    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        
        timers.push(setTimeout(() => setStatus('preparing'), 3000));
        timers.push(setTimeout(() => setStatus('out_for_delivery'), 8000));
        timers.push(setTimeout(() => setStatus('reached'), 14000));
        timers.push(setTimeout(() => setStatus('delivered'), 18000));

        return () => timers.forEach(clearTimeout);
    }, []);

    // Progress Bar Animation
    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 1500, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const handleSubmitRating = () => {
        // Logic to submit rating
        router.replace('/(tabs)');
    };

    const renderMapSection = () => (
        <View style={styles.mapContainer}>
            {/* CSS-based Dark Map Simulation */}
            <View style={styles.mapBackground}>
                {/* Roads */}
                <View style={[styles.road, { top: '20%', height: 40, width: '100%' }]} />
                <View style={[styles.road, { top: '60%', height: 30, width: '100%' }]} />
                <View style={[styles.road, { left: '30%', width: 35, height: '100%' }]} />
                <View style={[styles.road, { left: '70%', width: 25, height: '100%' }]} />
                
                {/* Diagonal Road */}
                <View style={[styles.road, { top: '40%', left: '-10%', width: '120%', height: 30, transform: [{ rotate: '30deg' }] }]} />
                
                {/* Blocks/Buildings (Abstract) */}
                <View style={[styles.block, { top: '5%', left: '5%', width: '20%', height: '10%' }]} />
                <View style={[styles.block, { top: '30%', left: '40%', width: '25%', height: '25%' }]} />
                <View style={[styles.block, { top: '70%', left: '10%', width: '15%', height: '20%' }]} />
                <View style={[styles.block, { top: '10%', left: '80%', width: '15%', height: '40%' }]} />
            </View>
            
            <View style={styles.mapOverlay} />
            
            {/* Route Line Simulation */}
            {status !== 'delivered' && (
                <View style={styles.routeContainer}>
                    {/* Restaurant Pin */}
                    <View style={[styles.mapPin, { top: '30%', left: '30%' }]}>
                        <View style={styles.pinBubble}>
                            <Ionicons name="restaurant" size={12} color={Colors.white} />
                        </View>
                        <View style={styles.pinPoint} />
                    </View>

                    {/* Dotted Line (Visual only) */}
                    <View style={styles.dottedLineContainer}>
                        <View style={[styles.dottedLine, { transform: [{ rotate: '45deg' }] }]} />
                    </View>

                    {/* User Pin */}
                    <View style={[styles.mapPin, { top: '60%', left: '70%' }]}>
                         <View style={[styles.pinBubble, { backgroundColor: Colors.primary }]}>
                            <Ionicons name="home" size={12} color={Colors.white} />
                        </View>
                        <View style={[styles.pinPoint, { borderTopColor: Colors.primary }]} />
                    </View>

                    {/* Driver Pin (Moving) */}
                    {(status === 'out_for_delivery' || status === 'reached') && (
                        <Animated.View 
                            entering={FadeIn}
                            style={[styles.driverPin, { top: status === 'reached' ? '58%' : '45%', left: status === 'reached' ? '68%' : '50%' }]}
                        >
                            <Image 
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png' }}
                                style={{ width: 30, height: 30 }}
                            />
                            {status === 'reached' && (
                                <View style={styles.driverTooltip}>
                                    <ThemedText style={styles.tooltipText} weight="medium">Hi! I'm delivering on an EV ▸</ThemedText>
                                </View>
                            )}
                        </Animated.View>
                    )}
                </View>
            )}
        </View>
    );

    if (status === 'delivered') {
        return (
            <View style={styles.deliveredContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#1A4D2E" />
                
                {/* Background Gradient */}
                <LinearGradient
                    colors={['#1A4D2E', '#0D2617', '#111416']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Header */}
                <View style={[styles.deliveredHeader, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.iconBtn}>
                        <Ionicons name="chevron-down" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle} weight="bold">Maiz Mexican Kitchen</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Confirmation Card */}
                <View style={styles.confirmationCardContainer}>
                    <Animated.View entering={FadeIn.duration(800)} style={styles.confirmationCard}>
                        <Image 
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2927/2927347.png' }}
                            style={styles.bagIcon}
                            contentFit="contain"
                        />
                        <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={16} color={Colors.white} />
                        </View>
                        
                        <ThemedText style={styles.deliveredText} weight="bold">Order delivered at Home</ThemedText>
                        <ThemedText style={styles.deliveredTime} fontFamily="dmsans">Delivered at 12:35 PM</ThemedText>
                    </Animated.View>
                </View>

                {/* Rating Bottom Sheet */}
                <Animated.View entering={SlideInUp.delay(500).springify()} style={styles.ratingSheet}>
                    {/* Driver Info Header */}
                    <View style={styles.ratingHeader}>
                        <View style={styles.driverInfoLeft}>
                            <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop' }}
                                style={styles.driverAvatarSmall}
                            />
                            <ThemedText style={styles.driverNameRating} weight="medium">Michael</ThemedText>
                        </View>
                        <View style={styles.driverRatingBadge}>
                            <ThemedText style={styles.ratingBadgeText} weight="bold">4.8</ThemedText>
                            <Ionicons name="star" size={10} color={Colors.white} />
                        </View>
                    </View>

                    <ThemedText style={styles.thankYouText} weight="bold">Thank you for rating!</ThemedText>

                    {/* Star Rating */}
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Ionicons 
                                    name={rating >= star ? "star" : "star-outline"} 
                                    size={36} 
                                    color="#F5C043" 
                                    style={{ marginHorizontal: 6 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ThemedText style={styles.whatDidYouLike} weight="medium">What did you like?</ThemedText>

                    {/* Feedback Tags */}
                    <View style={styles.tagsContainer}>
                        {FEEDBACK_TAGS.map((tag) => (
                            <TouchableOpacity 
                                key={tag} 
                                style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipSelected]}
                                onPress={() => toggleTag(tag)}
                            >
                                <ThemedText 
                                    style={[styles.tagText, selectedTags.includes(tag) && { color: Colors.white }]} 
                                    fontFamily="dmsans"
                                >
                                    {tag}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRating}>
                        <ThemedText style={styles.submitButtonText} weight="bold">Submit rating</ThemedText>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={STATUS_CONFIG[status].color} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top, backgroundColor: STATUS_CONFIG[status].color }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="chevron-down" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle} weight="bold">Maiz Mexican Kitchen</ThemedText>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="share-outline" size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.statusContainer}>
                    <ThemedText style={styles.statusTitle} weight="bold">{STATUS_CONFIG[status].title}</ThemedText>
                    
                    {status === 'preparing' || status === 'out_for_delivery' || status === 'reached' ? (
                        <View style={styles.statusBadge}>
                            <ThemedText style={styles.statusSubtitle} weight="medium">{STATUS_CONFIG[status].subtitle}</ThemedText>
                            <Animated.View style={styles.refreshIcon}>
                                <Ionicons name="sync" size={14} color={Colors.white} />
                            </Animated.View>
                        </View>
                    ) : (
                        <ThemedText style={styles.statusSubtitleSimple} fontFamily="dmsans">{STATUS_CONFIG[status].subtitle}</ThemedText>
                    )}
                </View>
            </View>

            {/* Map Background */}
            {renderMapSection()}

            {/* Scrollable Bottom Sheet */}
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Spacer to reveal map */}
                <View style={{ height: height * 0.35 }} />

                <View style={styles.sheetContainer}>
                    {/* Payment Pending Banner */}
                    <View style={styles.paymentCard}>
                        <ThemedText style={styles.paymentText} fontFamily="dmsans">
                            Your payment is pending. Pay now for a smoother delivery experience.
                        </ThemedText>
                        <TouchableOpacity style={styles.payButton}>
                            <ThemedText style={styles.payButtonText} weight="bold">Pay $25.50 now</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Gamification Card */}
                    <View style={styles.gameCard}>
                        <View style={styles.gameContent}>
                            <ThemedText style={styles.gameTag} weight="black">HEALTHY HIGH-FIVE</ThemedText>
                            <ThemedText style={styles.gameTitle} weight="bold">Healthy start! 1st High-five unlocked</ThemedText>
                            <ThemedText style={styles.gameSubtitle} fontFamily="dmsans">Count will be updated post delivery</ThemedText>
                            <TouchableOpacity>
                                <ThemedText style={styles.gameLink} weight="bold">See your journey ▸</ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gameIcon}>
                            <Ionicons name="hand-left-outline" size={32} color="#4CAF50" />
                        </View>
                    </View>

                    {/* Driver / Tip Card */}
                    <View style={styles.driverCard}>
                        {status === 'placed' || status === 'preparing' ? (
                            <View style={styles.driverHeader}>
                                <View style={styles.driverAvatarPlaceholder}>
                                    <Ionicons name="person" size={24} color="#555" />
                                </View>
                                <ThemedText style={styles.driverStatus} weight="bold">Assigning delivery partner shortly</ThemedText>
                            </View>
                        ) : (
                            <View style={styles.driverHeader}>
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop' }}
                                    style={styles.driverAvatar}
                                />
                                <View style={{ flex: 1 }}>
                                    <ThemedText style={styles.driverName} weight="bold">Michael</ThemedText>
                                    <View style={styles.driverRating}>
                                        <ThemedText style={styles.ratingText} weight="bold">4.8</ThemedText>
                                        <Ionicons name="star" size={10} color={Colors.white} />
                                    </View>
                                </View>
                                <View style={styles.driverActions}>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="call" size={20} color={Colors.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="chatbubble" size={20} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <ThemedText style={styles.tipTitle} fontFamily="dmsans">
                            Make their day by leaving a tip. 100% of the amount will go to them after delivery
                        </ThemedText>

                        <View style={styles.tipRow}>
                            {TIPS.map(amount => (
                                <TouchableOpacity 
                                    key={amount} 
                                    style={[styles.tipBtn, selectedTip === amount && styles.tipBtnSelected]}
                                    onPress={() => setSelectedTip(amount)}
                                >
                                    <View style={styles.tipEmoji}><ThemedText>😊</ThemedText></View>
                                    <ThemedText style={[styles.tipText, selectedTip === amount && { color: Colors.black }]} weight="bold">${amount}</ThemedText>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity style={styles.tipBtn}>
                                <ThemedText style={styles.tipText} weight="bold">Other</ThemedText>
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity style={styles.safetyRow}>
                            <MaterialIcons name="security" size={16} color={Colors.white} style={{ marginRight: 8 }} />
                            <ThemedText style={styles.safetyText} fontFamily="dmsans">Learn about delivery partner safety</ThemedText>
                            <Ionicons name="chevron-forward" size={16} color="#888" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>
                    </View>

                    {/* Address Card */}
                    <View style={styles.addressCard}>
                        <View style={styles.addressHeader}>
                            <ThemedText style={styles.addressTitle} fontFamily="dmsans">All your delivery details in one place</ThemedText>
                            <ThemedText style={{fontSize: 16}}>👇</ThemedText>
                        </View>
                        
                        <View style={styles.addressContent}>
                            <View style={styles.addressIcon}>
                                <Ionicons name="call-outline" size={20} color={Colors.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={styles.contactName} weight="bold">Glorian, 897668XXXX</ThemedText>
                                <ThemedText style={styles.contactSub} fontFamily="dmsans">Delivery partner may call this number</ThemedText>
                            </View>
                            <TouchableOpacity>
                                <ThemedText style={styles.editText} weight="bold">Edit</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111416',
    },
    header: {
        paddingBottom: 20,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        color: Colors.white,
    },
    statusContainer: {
        alignItems: 'center',
    },
    statusTitle: {
        fontSize: 22,
        color: Colors.white,
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusSubtitle: {
        fontSize: 14,
        color: Colors.white,
        marginRight: 8,
    },
    statusSubtitleSimple: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    refreshIcon: {
        
    },
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.6, // Map takes up top 60% visually
        zIndex: 0,
        backgroundColor: '#222', // Fallback
    },
    mapBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1C1C1E', // Dark map base
        position: 'relative',
        overflow: 'hidden',
    },
    road: {
        position: 'absolute',
        backgroundColor: '#2C2C2E', // Slightly lighter road color
    },
    block: {
        position: 'absolute',
        backgroundColor: '#121212', // Darker blocks
        opacity: 0.5,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(17, 20, 22, 0.1)', // Very slight overlay
    },
    scrollView: {
        flex: 1,
        zIndex: 2,
    },
    scrollContent: {
        flexGrow: 1,
    },
    sheetContainer: {
        backgroundColor: '#111416',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 16,
        minHeight: height * 0.7,
    },
    paymentCard: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    paymentText: {
        color: Colors.white,
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    payButton: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    payButtonText: {
        color: Colors.white,
        fontSize: 16,
    },
    gameCard: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    gameContent: {
        flex: 1,
    },
    gameTag: {
        color: '#4CAF50',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 4,
    },
    gameTitle: {
        color: Colors.white,
        fontSize: 14,
        marginBottom: 4,
    },
    gameSubtitle: {
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
    },
    gameLink: {
        color: Colors.primary,
        fontSize: 12,
    },
    gameIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    driverCard: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    driverAvatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    driverAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 2,
        borderColor: Colors.green,
    },
    driverStatus: {
        color: Colors.white,
        fontSize: 16,
        flex: 1,
    },
    driverName: {
        color: Colors.white,
        fontSize: 18,
    },
    driverRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.green,
        alignSelf: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        marginTop: 4,
    },
    ratingText: {
        color: Colors.white,
        fontSize: 12,
        marginRight: 2,
    },
    driverActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipTitle: {
        color: '#CCC',
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    tipRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    tipBtn: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#444',
        flexDirection: 'row',
        gap: 6,
    },
    tipBtnSelected: {
        backgroundColor: Colors.white,
        borderColor: Colors.white,
    },
    tipEmoji: {
        
    },
    tipText: {
        color: Colors.white,
        fontSize: 14,
    },
    safetyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    safetyText: {
        color: Colors.white,
        fontSize: 14,
    },
    addressCard: {
        backgroundColor: '#2A1A1A', // Brownish dark
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3E2723',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    addressTitle: {
        color: '#F5C043',
        fontSize: 14,
    },
    addressContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressIcon: {
        marginRight: 16,
    },
    contactName: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 4,
    },
    contactSub: {
        color: '#888',
        fontSize: 12,
    },
    editText: {
        color: Colors.primary,
        fontSize: 14,
    },

    // Map Elements
    routeContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    mapPin: {
        position: 'absolute',
        alignItems: 'center',
    },
    pinBubble: {
        backgroundColor: '#333',
        padding: 6,
        borderRadius: 20,
        marginBottom: 4,
    },
    pinPoint: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#333',
    },
    dottedLineContainer: {
        position: 'absolute',
        top: '35%',
        left: '35%',
        width: '35%',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dottedLine: {
        width: '100%',
        height: 2,
        borderWidth: 1,
        borderColor: Colors.white,
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    driverPin: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    driverTooltip: {
        position: 'absolute',
        bottom: 35,
        backgroundColor: Colors.white,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    tooltipText: {
        color: Colors.black,
        fontSize: 12,
    },

    // --- Delivered State Styles ---
    deliveredContainer: {
        flex: 1,
        backgroundColor: '#111416',
    },
    deliveredHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
        zIndex: 10,
    },
    confirmationCardContainer: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    confirmationCard: {
        backgroundColor: '#1E2328',
        width: '100%',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    bagIcon: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    checkBadge: {
        position: 'absolute',
        top: 80,
        right: '42%',
        backgroundColor: Colors.green,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1E2328',
    },
    deliveredText: {
        fontSize: 20,
        color: Colors.white,
        marginBottom: 8,
    },
    deliveredTime: {
        fontSize: 14,
        color: '#888',
    },
    ratingSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#111416',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 20,
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#1E2328',
        padding: 12,
        borderRadius: 12,
    },
    driverInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverAvatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    driverNameRating: {
        color: Colors.white,
        fontSize: 16,
    },
    driverRatingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.green,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 6,
    },
    ratingBadgeText: {
        color: Colors.white,
        fontSize: 12,
        marginRight: 2,
    },
    thankYouText: {
        color: Colors.white,
        fontSize: 18,
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    whatDidYouLike: {
        color: '#CCC',
        fontSize: 16,
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 30,
    },
    tagChip: {
        backgroundColor: '#1E2328',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    tagChipSelected: {
        backgroundColor: '#333',
        borderColor: '#666',
    },
    tagText: {
        color: '#AAA',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: 16,
    },
});
