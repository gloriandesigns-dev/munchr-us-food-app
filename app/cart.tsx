import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ThemedText } from '../components/ThemedText';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// --- Mock Data ---
const CART_ITEMS_INIT = [
    {
        id: 'c1',
        name: 'Chipotle Chicken Burrito Bowl',
        price: 12.50,
        quantity: 1,
        isVeg: false,
        customization: 'Cilantro Lime Rice, Black Beans, Guacamole',
    },
    {
        id: 'c2',
        name: 'Chips & Salsa',
        price: 3.50,
        quantity: 1,
        isVeg: true,
        customization: '',
    }
];

const SAVED_ADDRESSES = [
    {
        id: 'a1',
        type: 'Home',
        address: '123 Broadway, Apt 4B, New York, NY 10001',
        phone: '+1 917-555-0123',
        distance: '0.5 mi',
    },
    {
        id: 'a2',
        type: 'Work',
        address: 'Empire State Building, 350 5th Ave, NY 10118',
        phone: '+1 212-555-0199',
        distance: '1.2 mi',
    }
];

const PAYMENT_METHODS = [
    { id: 'p1', name: 'Apple Pay', icon: 'apple', type: 'font-awesome' },
    { id: 'p2', name: 'Visa ending in 4242', icon: 'credit-card', type: 'feather' },
    { id: 'p3', name: 'PayPal', icon: 'paypal', type: 'font-awesome' },
    { id: 'p4', name: 'Cash on Delivery', icon: 'cash', type: 'ionicon' },
];

export default function CartScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    // State
    const [cartItems, setCartItems] = useState(CART_ITEMS_INIT);
    const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);
    const [selectedPayment, setSelectedPayment] = useState<any>(null); // Start with no payment selected
    
    // Modals
    const [addressSheetVisible, setAddressSheetVisible] = useState(false);
    const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);

    // Calculations
    const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const platformFee = 1.99;
    const tax = itemTotal * 0.08875; // NY Tax approx
    const discount = 0; // Logic for coupons could go here
    const grandTotal = itemTotal + deliveryFee + platformFee + tax - discount;

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handlePlaceOrder = () => {
        if (!selectedPayment) {
            Alert.alert("Payment Method Required", "Please select a payment method to proceed.");
            setPaymentSheetVisible(true);
            return;
        }
        // In a real app, this would submit the order to the backend
        router.push('/order-tracking');
    };

    // --- Components ---

    const AddressSheet = () => (
        <Modal visible={addressSheetVisible} transparent animationType="none" onRequestClose={() => setAddressSheetVisible(false)}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackdrop} onPress={() => setAddressSheetVisible(false)} activeOpacity={1} />
                <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.modalSheet}>
                    <View style={styles.modalHeader}>
                        <ThemedText style={styles.modalTitle} weight="bold">Select an address</ThemedText>
                        <TouchableOpacity onPress={() => setAddressSheetVisible(false)}>
                            <Ionicons name="close" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={styles.addAddressBtn}>
                        <Ionicons name="add" size={20} color={Colors.primary} />
                        <ThemedText style={styles.addAddressText} weight="bold">Add Address</ThemedText>
                        <Ionicons name="chevron-forward" size={16} color="#666" style={{marginLeft: 'auto'}} />
                    </TouchableOpacity>

                    <ThemedText style={styles.sectionLabel} weight="medium">SAVED ADDRESSES</ThemedText>

                    <ScrollView style={{maxHeight: 400}}>
                        {SAVED_ADDRESSES.map(addr => (
                            <TouchableOpacity 
                                key={addr.id} 
                                style={[styles.addressCard, selectedAddress.id === addr.id && styles.addressCardSelected]}
                                onPress={() => {
                                    setSelectedAddress(addr);
                                    setAddressSheetVisible(false);
                                }}
                            >
                                <View style={styles.addressIcon}>
                                    <Ionicons name={addr.type === 'Home' ? 'home' : 'briefcase'} size={18} color={Colors.white} />
                                </View>
                                <View style={styles.addressContent}>
                                    <View style={styles.rowBetween}>
                                        <ThemedText style={styles.addressType} weight="bold">{addr.type}</ThemedText>
                                        <ThemedText style={styles.addressDistance} fontFamily="dmsans">{addr.distance}</ThemedText>
                                    </View>
                                    <ThemedText style={styles.addressText} fontFamily="dmsans">{addr.address}</ThemedText>
                                    <ThemedText style={styles.addressPhone} fontFamily="dmsans">Phone: {addr.phone}</ThemedText>
                                </View>
                                {selectedAddress.id === addr.id && (
                                    <View style={styles.checkIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );

    const PaymentSheet = () => (
        <Modal visible={paymentSheetVisible} transparent animationType="none" onRequestClose={() => setPaymentSheetVisible(false)}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackdrop} onPress={() => setPaymentSheetVisible(false)} activeOpacity={1} />
                <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.modalSheet}>
                    <View style={styles.modalHeader}>
                        <ThemedText style={styles.modalTitle} weight="bold">Payment Method</ThemedText>
                        <TouchableOpacity onPress={() => setPaymentSheetVisible(false)}>
                            <Ionicons name="close" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{maxHeight: 400}}>
                        {PAYMENT_METHODS.map(method => (
                            <TouchableOpacity 
                                key={method.id} 
                                style={[styles.paymentCard, selectedPayment?.id === method.id && styles.paymentCardSelected]}
                                onPress={() => {
                                    setSelectedPayment(method);
                                    setPaymentSheetVisible(false);
                                }}
                            >
                                <View style={styles.paymentIconContainer}>
                                    {method.type === 'font-awesome' && <FontAwesome5 name={method.icon as any} size={18} color={Colors.white} />}
                                    {method.type === 'ionicon' && <Ionicons name={method.icon as any} size={20} color={Colors.white} />}
                                    {method.type === 'feather' && <MaterialIcons name={method.icon as any} size={20} color={Colors.white} />}
                                </View>
                                <ThemedText style={styles.paymentName} weight="medium">{method.name}</ThemedText>
                                {selectedPayment?.id === method.id && (
                                    <Ionicons name="radio-button-on" size={20} color={Colors.primary} style={{marginLeft: 'auto'}} />
                                )}
                                {selectedPayment?.id !== method.id && (
                                    <Ionicons name="radio-button-off" size={20} color="#666" style={{marginLeft: 'auto'}} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <View>
                    <ThemedText style={styles.headerTitle} weight="bold">Maiz Mexican Kitchen</ThemedText>
                    <ThemedText style={styles.headerSubtitle} fontFamily="dmsans">Delivery in 25-30 mins</ThemedText>
                </View>
                <TouchableOpacity style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
                
                {/* Savings Banner */}
                <LinearGradient colors={['#2A1A4A', '#1A1A2E']} style={styles.savingsBanner}>
                    <View style={styles.savingsContent}>
                        <ThemedText style={styles.savingsText} weight="bold">
                            <Ionicons name="gift" size={14} color="#F5C043" /> You saved <Text style={{color: '#F5C043'}}>$3.50</Text> with Gold
                        </ThemedText>
                    </View>
                </LinearGradient>

                {/* Items List */}
                <View style={styles.section}>
                    {cartItems.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                            <View style={styles.cartItemInfo}>
                                <View style={styles.itemHeader}>
                                    <View style={[styles.vegIcon, !item.isVeg && { borderColor: Colors.primary }]}>
                                        <View style={[styles.vegDot, !item.isVeg && { backgroundColor: Colors.primary }]} />
                                    </View>
                                    <ThemedText style={styles.itemName} weight="medium">{item.name}</ThemedText>
                                </View>
                                <ThemedText style={styles.itemPrice} fontFamily="dmsans">${item.price.toFixed(2)}</ThemedText>
                                {item.customization ? (
                                    <ThemedText style={styles.itemCustomization} fontFamily="dmsans">{item.customization}</ThemedText>
                                ) : null}
                            </View>
                            
                            <View style={styles.qtyContainer}>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                                    <Ionicons name="remove" size={16} color={Colors.primary} />
                                </TouchableOpacity>
                                <ThemedText style={styles.qtyText} weight="bold">{item.quantity}</ThemedText>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                                    <Ionicons name="add" size={16} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    
                    <TouchableOpacity style={styles.addMoreBtn} onPress={() => router.back()}>
                        <Ionicons name="add" size={18} color={Colors.white} />
                        <ThemedText style={styles.addMoreText} weight="medium">Add more items</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Bill Summary */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle} weight="bold">Bill Details</ThemedText>
                    
                    <View style={styles.billRow}>
                        <ThemedText style={styles.billLabel} fontFamily="dmsans">Item Total</ThemedText>
                        <ThemedText style={styles.billValue} fontFamily="dmsans">${itemTotal.toFixed(2)}</ThemedText>
                    </View>
                    <View style={styles.billRow}>
                        <View style={styles.rowStart}>
                            <ThemedText style={styles.billLabel} fontFamily="dmsans">Delivery Fee</ThemedText>
                            <Ionicons name="information-circle-outline" size={14} color="#888" style={{marginLeft: 4}} />
                        </View>
                        <ThemedText style={styles.billValue} fontFamily="dmsans">${deliveryFee.toFixed(2)}</ThemedText>
                    </View>
                    <View style={styles.billRow}>
                         <View style={styles.rowStart}>
                            <ThemedText style={styles.billLabel} fontFamily="dmsans">Platform Fee</ThemedText>
                            <Ionicons name="information-circle-outline" size={14} color="#888" style={{marginLeft: 4}} />
                        </View>
                        <ThemedText style={styles.billValue} fontFamily="dmsans">${platformFee.toFixed(2)}</ThemedText>
                    </View>
                    <View style={styles.billRow}>
                        <ThemedText style={styles.billLabel} fontFamily="dmsans">Taxes</ThemedText>
                        <ThemedText style={styles.billValue} fontFamily="dmsans">${tax.toFixed(2)}</ThemedText>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.billRow}>
                        <ThemedText style={styles.grandTotalLabel} weight="bold">Grand Total</ThemedText>
                        <ThemedText style={styles.grandTotalValue} weight="bold">${grandTotal.toFixed(2)}</ThemedText>
                    </View>
                </View>

                {/* Donation */}
                <View style={styles.donationCard}>
                    <View style={styles.donationHeader}>
                        <ThemedText style={styles.donationTitle} weight="bold">Let's serve a brighter future</ThemedText>
                        <Ionicons name="information-circle-outline" size={16} color="#AAA" />
                    </View>
                    <ThemedText style={styles.donationDesc} fontFamily="dmsans">Help feed those in need. 100% of proceeds go to charity.</ThemedText>
                    <View style={styles.donationRow}>
                        <ThemedText style={styles.donationLabel} weight="medium">Donate $1</ThemedText>
                        <TouchableOpacity style={styles.donateBtn}>
                            <ThemedText style={styles.donateBtnText} weight="bold">ADD</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cancellation Policy */}
                <View style={styles.policyContainer}>
                    <ThemedText style={styles.policyTitle} weight="bold">CANCELLATION POLICY</ThemedText>
                    <ThemedText style={styles.policyText} fontFamily="dmsans">
                        Help us reduce food waste by avoiding cancellations after placing your order. A 100% cancellation fee will be applied.
                    </ThemedText>
                </View>

                {/* Address Selection Widget */}
                <TouchableOpacity style={styles.addressWidget} onPress={() => setAddressSheetVisible(true)}>
                    <View style={styles.widgetHeader}>
                        <ThemedText style={styles.widgetLabel} weight="medium">DELIVER TO</ThemedText>
                        <ThemedText style={styles.changeText} weight="bold">CHANGE</ThemedText>
                    </View>
                    <View style={styles.widgetContent}>
                        <View style={styles.addressIconSmall}>
                            <Ionicons name={selectedAddress.type === 'Home' ? 'home' : 'briefcase'} size={14} color={Colors.white} />
                        </View>
                        <View>
                            <ThemedText style={styles.selectedAddressType} weight="bold">{selectedAddress.type}</ThemedText>
                            <ThemedText style={styles.selectedAddressText} fontFamily="dmsans" numberOfLines={1}>{selectedAddress.address}</ThemedText>
                        </View>
                    </View>
                </TouchableOpacity>

                 {/* Payment Selection Widget */}
                 <TouchableOpacity style={styles.paymentWidget} onPress={() => setPaymentSheetVisible(true)}>
                    <View style={styles.widgetHeader}>
                        <ThemedText style={styles.widgetLabel} weight="medium">PAYMENT METHOD</ThemedText>
                        <ThemedText style={styles.changeText} weight="bold">CHANGE</ThemedText>
                    </View>
                    <View style={styles.widgetContent}>
                         {selectedPayment ? (
                             <>
                                <View style={styles.paymentIconSmall}>
                                    {selectedPayment.type === 'font-awesome' && <FontAwesome5 name={selectedPayment.icon as any} size={14} color={Colors.white} />}
                                    {selectedPayment.type === 'ionicon' && <Ionicons name={selectedPayment.icon as any} size={16} color={Colors.white} />}
                                    {selectedPayment.type === 'feather' && <MaterialIcons name={selectedPayment.icon as any} size={16} color={Colors.white} />}
                                </View>
                                <ThemedText style={styles.selectedPaymentName} weight="bold">{selectedPayment.name}</ThemedText>
                             </>
                         ) : (
                             <ThemedText style={{ color: Colors.primary, fontSize: 14, fontWeight: 'bold' }}>Select Payment Method</ThemedText>
                         )}
                    </View>
                </TouchableOpacity>

            </ScrollView>

            {/* Sticky Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
                    <View style={styles.placeOrderContent}>
                        <View>
                            <ThemedText style={styles.footerTotal} weight="bold">${grandTotal.toFixed(2)}</ThemedText>
                            <ThemedText style={styles.totalLabel} fontFamily="dmsans">TOTAL</ThemedText>
                        </View>
                        <View style={styles.placeOrderRight}>
                            <ThemedText style={styles.placeOrderText} weight="bold">Place Order</ThemedText>
                            <Ionicons name="caret-forward" size={14} color={Colors.white} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Render Modals */}
            <AddressSheet />
            <PaymentSheet />

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
    headerSubtitle: {
        fontSize: 12,
        color: Colors.green,
    },
    shareBtn: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    savingsBanner: {
        padding: 12,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3A2A5A',
    },
    savingsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    savingsText: {
        color: '#DDD',
        fontSize: 12,
    },
    section: {
        backgroundColor: '#1E2328',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 16,
    },
    cartItemInfo: {
        flex: 1,
        paddingRight: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    vegIcon: {
        width: 14,
        height: 14,
        borderWidth: 1,
        borderColor: Colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.green,
    },
    itemName: {
        color: Colors.white,
        fontSize: 16,
    },
    itemPrice: {
        color: Colors.white,
        fontSize: 14,
        marginBottom: 4,
    },
    itemCustomization: {
        color: '#888',
        fontSize: 12,
    },
    qtyContainer: {
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        height: 32,
        borderWidth: 1,
        borderColor: '#333',
    },
    qtyBtn: {
        width: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        color: Colors.white,
        fontSize: 14,
        marginHorizontal: 4,
    },
    addMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        borderStyle: 'dashed',
    },
    addMoreText: {
        color: Colors.white,
        fontSize: 14,
        marginLeft: 8,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 16,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    rowStart: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    billLabel: {
        color: '#AAA',
        fontSize: 14,
    },
    billValue: {
        color: Colors.white,
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 12,
    },
    grandTotalLabel: {
        color: Colors.white,
        fontSize: 18,
    },
    grandTotalValue: {
        color: Colors.white,
        fontSize: 18,
    },
    donationCard: {
        backgroundColor: '#1E2328',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
    },
    donationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    donationTitle: {
        color: Colors.white,
        fontSize: 14,
    },
    donationDesc: {
        color: '#888',
        fontSize: 12,
        marginBottom: 12,
    },
    donationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    donationLabel: {
        color: Colors.white,
        fontSize: 14,
    },
    donateBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    donateBtnText: {
        color: Colors.primary,
        fontSize: 12,
    },
    policyContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
    },
    policyTitle: {
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
        letterSpacing: 1,
    },
    policyText: {
        color: '#666',
        fontSize: 12,
        lineHeight: 18,
    },
    addressWidget: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
    },
    paymentWidget: {
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#1E2328',
        borderRadius: 16,
        padding: 16,
    },
    widgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    widgetLabel: {
        color: '#888',
        fontSize: 12,
        letterSpacing: 1,
    },
    changeText: {
        color: Colors.primary,
        fontSize: 12,
    },
    widgetContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressIconSmall: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentIconSmall: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    selectedAddressType: {
        color: Colors.white,
        fontSize: 14,
        marginBottom: 2,
    },
    selectedAddressText: {
        color: '#AAA',
        fontSize: 12,
        width: width * 0.6,
    },
    selectedPaymentName: {
        color: Colors.white,
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E2328',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    placeOrderBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    placeOrderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerTotal: {
        color: Colors.white,
        fontSize: 18,
    },
    totalLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
    },
    placeOrderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeOrderText: {
        color: Colors.white,
        fontSize: 18,
        marginRight: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalSheet: {
        backgroundColor: '#1E2328',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        color: Colors.white,
        fontSize: 18,
    },
    addAddressBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    addAddressText: {
        color: Colors.primary,
        fontSize: 16,
        marginLeft: 12,
    },
    sectionLabel: {
        color: '#888',
        fontSize: 12,
        letterSpacing: 1,
        padding: 16,
    },
    addressCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#25282E',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    addressCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#2A1A1A',
    },
    addressIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    addressContent: {
        flex: 1,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    addressType: {
        color: Colors.white,
        fontSize: 16,
    },
    addressDistance: {
        color: '#AAA',
        fontSize: 12,
    },
    addressText: {
        color: '#CCC',
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
    addressPhone: {
        color: '#888',
        fontSize: 12,
    },
    checkIcon: {
        justifyContent: 'center',
        marginLeft: 12,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    paymentCardSelected: {
        backgroundColor: '#2A2A2A',
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    paymentName: {
        color: Colors.white,
        fontSize: 16,
    },
});
