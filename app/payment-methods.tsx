import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ThemedText } from '../components/ThemedText';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAYMENT_METHODS = [
    { id: '1', name: 'Credit / Debit Cards', icon: 'credit-card', type: 'feather', linked: true, detail: 'Visa ending in 4242' },
    { id: '2', name: 'Apple Pay', icon: 'apple', type: 'font-awesome', linked: true, detail: 'Linked' },
    { id: '3', name: 'Google Pay', icon: 'google', type: 'font-awesome', linked: false, detail: '' },
    { id: '4', name: 'PayPal', icon: 'paypal', type: 'font-awesome', linked: false, detail: '' },
    { id: '5', name: 'Cash on Delivery', icon: 'cash', type: 'ionicon', linked: true, detail: '' },
];

export default function PaymentMethodsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.darkHeader} />
            
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle} weight="bold">Payment Methods</ThemedText>
                <View style={{width: 24}} /> 
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle} fontFamily="dmsans">MANAGE PAYMENT METHODS</ThemedText>
                    
                    <View style={styles.cardContainer}>
                        {PAYMENT_METHODS.map((method, index) => (
                            <TouchableOpacity key={method.id} style={[styles.methodItem, index === PAYMENT_METHODS.length - 1 && styles.lastItem]}>
                                <View style={styles.iconContainer}>
                                    {method.type === 'font-awesome' && <FontAwesome5 name={method.icon as any} size={18} color={Colors.white} />}
                                    {method.type === 'ionicon' && <Ionicons name={method.icon as any} size={20} color={Colors.white} />}
                                    {method.type === 'feather' && <MaterialIcons name={method.icon as any} size={20} color={Colors.white} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <ThemedText style={styles.methodName} weight="medium">{method.name}</ThemedText>
                                    {method.linked && method.detail ? (
                                        <ThemedText style={styles.methodDetail} fontFamily="dmsans">{method.detail}</ThemedText>
                                    ) : null}
                                </View>
                                {method.linked ? (
                                    <Ionicons name="chevron-forward" size={16} color="#666" />
                                ) : (
                                    <ThemedText style={styles.linkText} weight="bold">LINK</ThemedText>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                    <ThemedText style={styles.addButtonText} weight="bold">Add new payment method</ThemedText>
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
        padding: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#888',
        fontSize: 12,
        marginBottom: 12,
        letterSpacing: 1,
    },
    cardContainer: {
        backgroundColor: '#1E2328',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    methodInfo: {
        flex: 1,
    },
    methodName: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 2,
    },
    methodDetail: {
        color: '#888',
        fontSize: 12,
    },
    linkText: {
        color: Colors.primary,
        fontSize: 12,
        letterSpacing: 0.5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 12,
        borderStyle: 'dashed',
        backgroundColor: 'rgba(226, 55, 68, 0.1)',
    },
    addButtonText: {
        color: Colors.primary,
        fontSize: 16,
        marginLeft: 8,
    },
});
