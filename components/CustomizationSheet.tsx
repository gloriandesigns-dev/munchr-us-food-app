import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { ThemedText } from './ThemedText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { SlideInDown, SlideOutDown, FadeIn, FadeOut } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface CustomizationSheetProps {
    visible: boolean;
    item: any;
    onClose: () => void;
    onAdd: (item: any, quantity: number, price: number) => void;
}

export const CustomizationSheet = ({ visible, item, onClose, onAdd }: CustomizationSheetProps) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (visible) {
            setQuantity(1);
            // Pre-select required options if needed (optional logic)
            const initialSelections: Record<string, string[]> = {};
            item?.customizationGroups?.forEach((group: any) => {
                if (group.required && group.type === 'single' && group.options.length > 0) {
                    initialSelections[group.id] = [group.options[0].id];
                }
            });
            setSelectedOptions(initialSelections);
        }
    }, [visible, item]);

    if (!item) return null;

    const handleOptionSelect = (groupId: string, optionId: string, type: 'single' | 'multiple') => {
        setSelectedOptions(prev => {
            const current = prev[groupId] || [];
            if (type === 'single') {
                return { ...prev, [groupId]: [optionId] };
            } else {
                // Toggle
                if (current.includes(optionId)) {
                    return { ...prev, [groupId]: current.filter(id => id !== optionId) };
                } else {
                    return { ...prev, [groupId]: [...current, optionId] };
                }
            }
        });
    };

    // Calculate Total Price
    const calculateTotal = () => {
        let total = item.price;
        item.customizationGroups?.forEach((group: any) => {
            const selectedIds = selectedOptions[group.id] || [];
            selectedIds.forEach(id => {
                const option = group.options.find((o: any) => o.id === id);
                if (option) {
                    total += option.price;
                }
            });
        });
        return total * quantity;
    };

    const totalPrice = calculateTotal();

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
                
                <Animated.View entering={SlideInDown.duration(300)} exiting={SlideOutDown.duration(300)} style={styles.sheet}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.itemMeta}>
                            <View style={[styles.vegIcon, !item.isVeg && { borderColor: Colors.primary }]}>
                                <View style={[styles.vegDot, !item.isVeg && { backgroundColor: Colors.primary }]} />
                            </View>
                            <ThemedText style={styles.itemName} weight="bold">{item.name}</ThemedText>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                        <ThemedText style={styles.itemPrice} weight="bold" fontFamily="dmsans">${item.price.toFixed(2)}</ThemedText>
                        <ThemedText style={styles.itemDesc} fontFamily="dmsans" numberOfLines={2}>{item.desc}</ThemedText>
                    </View>

                    <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }}>
                        {item.customizationGroups?.map((group: any) => (
                            <View key={group.id} style={styles.groupContainer}>
                                <View style={styles.groupHeader}>
                                    <ThemedText style={styles.groupTitle} weight="bold">{group.title}</ThemedText>
                                    <ThemedText style={styles.groupRequired} fontFamily="dmsans">
                                        {group.required ? 'Required' : 'Optional'}
                                    </ThemedText>
                                </View>
                                
                                {group.options.map((option: any) => {
                                    const isSelected = (selectedOptions[group.id] || []).includes(option.id);
                                    return (
                                        <TouchableOpacity 
                                            key={option.id} 
                                            style={styles.optionRow}
                                            onPress={() => handleOptionSelect(group.id, option.id, group.type)}
                                        >
                                            <View style={styles.optionInfo}>
                                                <View style={[styles.vegIconSmall, option.type === 'non-veg' && { borderColor: Colors.primary }]}>
                                                    <View style={[styles.vegDotSmall, option.type === 'non-veg' && { backgroundColor: Colors.primary }]} />
                                                </View>
                                                <ThemedText style={styles.optionName} fontFamily="dmsans">{option.name}</ThemedText>
                                            </View>
                                            
                                            <View style={styles.optionRight}>
                                                {option.price > 0 && (
                                                    <ThemedText style={styles.optionPrice} fontFamily="dmsans">+${option.price.toFixed(2)}</ThemedText>
                                                )}
                                                <View style={[
                                                    styles.checkbox, 
                                                    group.type === 'single' && styles.radio,
                                                    isSelected && styles.checkboxSelected
                                                ]}>
                                                    {isSelected && <Ionicons name="checkmark" size={12} color={Colors.black} />}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity 
                                style={styles.qtyBtn} 
                                onPress={() => quantity > 1 && setQuantity(q => q - 1)}
                            >
                                <Ionicons name="remove" size={20} color={Colors.white} />
                            </TouchableOpacity>
                            <ThemedText style={styles.qtyText} weight="bold">{quantity}</ThemedText>
                            <TouchableOpacity 
                                style={styles.qtyBtn} 
                                onPress={() => setQuantity(q => q + 1)}
                            >
                                <Ionicons name="add" size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => {
                                onAdd(item, quantity, totalPrice);
                                onClose();
                            }}
                        >
                            <ThemedText style={styles.addButtonText} weight="bold">Add item - ${totalPrice.toFixed(2)}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        backgroundColor: '#1E2328',
        height: height * 0.85,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    vegIcon: {
        width: 16,
        height: 16,
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
        fontSize: 20,
        color: Colors.white,
        flex: 1,
    },
    closeBtn: {
        padding: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
    },
    itemPrice: {
        fontSize: 18,
        color: Colors.white,
        marginBottom: 8,
    },
    itemDesc: {
        fontSize: 14,
        color: '#AAA',
    },
    scrollContent: {
        flex: 1,
    },
    groupContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    groupTitle: {
        fontSize: 18,
        color: Colors.white,
    },
    groupRequired: {
        fontSize: 12,
        color: '#888',
        backgroundColor: '#333',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    optionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    vegIconSmall: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: Colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    vegDotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.green,
    },
    optionName: {
        fontSize: 16,
        color: '#DDD',
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionPrice: {
        fontSize: 14,
        color: '#AAA',
        marginRight: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#AAA',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radio: {
        borderRadius: 10,
    },
    checkboxSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    footer: {
        padding: 20,
        backgroundColor: '#1E2328',
        borderTopWidth: 1,
        borderTopColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontSize: 16,
        color: Colors.white,
        marginHorizontal: 8,
    },
    addButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 16,
        color: Colors.white,
    },
});
