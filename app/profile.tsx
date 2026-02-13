import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ThemedText } from '../components/ThemedText';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalContext';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
    { icon: 'receipt-outline', label: 'Your orders', type: 'ionicon' },
    { icon: 'book-outline', label: 'Address book', type: 'ionicon' },
    { icon: 'bookmark-outline', label: 'Your collections', type: 'ionicon' },
    { icon: 'heart-outline', label: 'Manage recommendations', type: 'ionicon' },
    { icon: 'chatbox-ellipses-outline', label: 'Online ordering help', type: 'ionicon' },
    { icon: 'eye-off-outline', label: 'Hidden Restaurants', type: 'ionicon' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { isVegMode, toggleVegMode, theme, setTheme } = useGlobalContext();
    const [personalizedRatings, setPersonalizedRatings] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <View style={{width: 24}} /> 
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
                
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <ThemedText style={styles.avatarText} weight="bold">G</ThemedText>
                        </View>
                        <View style={styles.profileInfo}>
                            <ThemedText style={styles.userName} weight="bold">Gary</ThemedText>
                            <TouchableOpacity style={styles.editProfileBtn}>
                                <ThemedText style={styles.editProfileText} fontFamily="dmsans">Edit profile</ThemedText>
                                <Ionicons name="caret-forward" size={10} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.goldMemberRow}>
                        <View style={styles.goldBadge}>
                            <MaterialCommunityIcons name="crown" size={16} color="#3E2723" />
                        </View>
                        <ThemedText style={styles.goldText} weight="medium">Gold member</ThemedText>
                        
                        <View style={styles.savingsPill}>
                            <ThemedText style={styles.savingsText} weight="bold" fontFamily="dmsans">saved $1166</ThemedText>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={Colors.white} />
                    </View>
                </View>

                {/* Wallet Row */}
                <View style={styles.walletRow}>
                    <TouchableOpacity style={styles.walletCard}>
                        <View style={styles.walletIcon}>
                            <Ionicons name="wallet-outline" size={20} color="#DDD" />
                        </View>
                        <View>
                            <ThemedText style={styles.walletTitle} weight="medium">Munchr Money</ThemedText>
                            <ThemedText style={styles.walletBalance} weight="bold">$0</ThemedText>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.walletCard}>
                        <View style={styles.walletIcon}>
                            <MaterialCommunityIcons name="ticket-percent-outline" size={20} color="#DDD" />
                        </View>
                        <View>
                            <ThemedText style={styles.walletTitle} weight="medium">Your coupons</ThemedText>
                            <ThemedText style={styles.couponBadge} weight="bold">4 new</ThemedText>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Preferences Section - Updated to match JSON */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleRow}>
                        <View style={styles.sectionBar} />
                        <ThemedText style={styles.sectionTitle} weight="bold">Your Preferences</ThemedText>
                    </View>

                    <View style={styles.cardContainer}>
                        {/* Veg Mode */}
                        <View style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <MaterialCommunityIcons name="food-apple-outline" size={20} color={isVegMode ? Colors.green : "#DDD"} />
                            </View>
                            <ThemedText style={styles.menuLabel} fontFamily="dmsans">Veg Mode</ThemedText>
                            <Switch 
                                value={isVegMode} 
                                onValueChange={toggleVegMode}
                                trackColor={{ false: '#333', true: 'rgba(37, 126, 62, 0.5)' }}
                                thumbColor={isVegMode ? Colors.green : '#f4f3f4'}
                            />
                        </View>

                        {/* Personalized Ratings */}
                        <View style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="star-outline" size={20} color="#DDD" />
                            </View>
                            <ThemedText style={styles.menuLabel} fontFamily="dmsans">Show personalized ratings</ThemedText>
                            <Switch 
                                value={personalizedRatings} 
                                onValueChange={setPersonalizedRatings}
                                trackColor={{ false: '#333', true: 'rgba(226, 55, 68, 0.5)' }}
                                thumbColor={personalizedRatings ? Colors.primary : '#f4f3f4'}
                            />
                        </View>

                        {/* Appearance */}
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="color-palette-outline" size={20} color="#DDD" />
                            </View>
                            <ThemedText style={styles.menuLabel} fontFamily="dmsans">Appearance</ThemedText>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <ThemedText style={styles.settingValue} fontFamily="dmsans">Automatic</ThemedText>
                                <Ionicons name="chevron-forward" size={16} color="#666" />
                            </View>
                        </TouchableOpacity>

                        {/* Payment Methods Link */}
                        <TouchableOpacity style={[styles.menuItem, styles.lastItem]} onPress={() => router.push('/payment-methods')}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="card-outline" size={20} color="#DDD" />
                            </View>
                            <ThemedText style={styles.menuLabel} fontFamily="dmsans">Payment Methods</ThemedText>
                            <Ionicons name="chevron-forward" size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Food Delivery Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleRow}>
                        <View style={styles.sectionBar} />
                        <ThemedText style={styles.sectionTitle} weight="bold">Food delivery</ThemedText>
                    </View>
                    
                    <View style={styles.cardContainer}>
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity key={index} style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.lastItem]}>
                                <View style={styles.menuIconContainer}>
                                    <Ionicons name={item.icon as any} size={20} color="#DDD" />
                                </View>
                                <ThemedText style={styles.menuLabel} fontFamily="dmsans">{item.label}</ThemedText>
                                <Ionicons name="chevron-forward" size={16} color="#666" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Footer Invite */}
                <TouchableOpacity style={styles.inviteRow}>
                    <View style={styles.menuIconContainer}>
                        <FontAwesome5 name="dollar-sign" size={16} color="#DDD" />
                    </View>
                    <ThemedText style={styles.menuLabel} fontFamily="dmsans">Invite your friends to Munchr</ThemedText>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>

                <View style={styles.giftCard}>
                    <Ionicons name="gift-outline" size={24} color="#F5C043" style={{marginRight: 12}} />
                    <ThemedText style={styles.giftText} fontFamily="dmsans">
                        Get $10 gift coupons every time your friends complete their first order
                    </ThemedText>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/login')}>
                    <ThemedText style={styles.logoutText} weight="medium">Log out</ThemedText>
                </TouchableOpacity>

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
        backgroundColor: Colors.darkHeader,
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        color: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: '#1E2328',
        margin: 16,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF8E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#F5C043',
    },
    avatarText: {
        fontSize: 28,
        color: '#BCAAA4',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        color: Colors.white,
        marginBottom: 4,
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editProfileText: {
        fontSize: 14,
        color: Colors.white,
        marginRight: 4,
    },
    goldMemberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3E2723',
    },
    goldBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F5C043',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    goldText: {
        color: '#F5C043',
        fontSize: 14,
        flex: 1,
    },
    savingsPill: {
        backgroundColor: '#3E2723',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F5C043',
        marginRight: 8,
    },
    savingsText: {
        color: '#F5C043',
        fontSize: 12,
    },
    walletRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 16,
        marginBottom: 24,
    },
    walletCard: {
        flex: 1,
        backgroundColor: '#1E2328',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    walletIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    walletTitle: {
        color: '#AAA',
        fontSize: 12,
        marginBottom: 2,
    },
    walletBalance: {
        color: Colors.white,
        fontSize: 16,
    },
    couponBadge: {
        color: Colors.blue,
        fontSize: 14,
    },
    sectionContainer: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionBar: {
        width: 4,
        height: 24,
        backgroundColor: Colors.primary,
        marginRight: 12,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 18,
    },
    cardContainer: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    menuIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    menuLabel: {
        flex: 1,
        color: Colors.white,
        fontSize: 16,
    },
    settingValue: {
        color: '#888',
        fontSize: 14,
        marginRight: 8,
    },
    inviteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#222',
        marginTop: 8,
    },
    giftCard: {
        backgroundColor: '#2A2A2A',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    giftText: {
        color: '#CCC',
        fontSize: 12,
        flex: 1,
        lineHeight: 18,
    },
    logoutBtn: {
        marginHorizontal: 16,
        marginTop: 20,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
    },
    logoutText: {
        color: Colors.primary,
        fontSize: 16,
    },
});
