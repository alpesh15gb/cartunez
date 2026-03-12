import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { theme } from '../theme';
import { Plus, Trash2, Tag, Calendar, RefreshCcw } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';

export default function CouponsScreen() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountAmount: '',
        expiryDate: ''
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.COUPONS);
            const data = await response.json();
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreateCoupon = async () => {
        if (!newCoupon.code || !newCoupon.discountAmount) {
            Alert.alert('Incomplete Data', 'Please fill in code and discount amount.');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.COUPONS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon)
            });
            if (response.ok) {
                fetchCoupons();
                setShowAdd(false);
                setNewCoupon({ code: '', discountType: 'PERCENTAGE', discountAmount: '', expiryDate: '' });
            } else {
                Alert.alert('Error', 'Failed to create coupon.');
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Purge Coupon", "Deactivate this transmission code?", [
            { text: "Abort", style: "cancel" },
            { 
                text: "Purge", 
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await fetch(`${API_ENDPOINTS.COUPONS}/${id}`, { method: 'DELETE' });
                        if (response.ok) fetchCoupons();
                    } catch (error) { console.error(error); }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.couponCard}>
            <View style={styles.couponLeft}>
                <Tag size={20} color={theme.colors.primary} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.couponCode}>{item.code}</Text>
                    <Text style={styles.couponMeta}>
                        {item.discountType === 'PERCENTAGE' ? `${item.discountAmount}% OFF` : `₹${item.discountAmount} OFF`}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Trash2 size={18} color={theme.colors.secondary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Promo Codes</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
                    <Plus size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {showAdd && (
                <View style={styles.addForm}>
                    <TextInput 
                        placeholder="CODE (e.g. TURBO20)" 
                        placeholderTextColor={theme.colors.muted}
                        style={styles.input}
                        value={newCoupon.code}
                        onChangeText={(t) => setNewCoupon({...newCoupon, code: t.toUpperCase()})}
                    />
                    <View style={styles.row}>
                        <TextInput 
                            placeholder="Discount Amount" 
                            placeholderTextColor={theme.colors.muted}
                            style={[styles.input, { flex: 1, marginRight: 10 }]}
                            keyboardType="numeric"
                            value={newCoupon.discountAmount}
                            onChangeText={(t) => setNewCoupon({...newCoupon, discountAmount: t})}
                        />
                        <TouchableOpacity 
                            style={styles.typeToggle}
                            onPress={() => setNewCoupon({...newCoupon, discountType: newCoupon.discountType === 'PERCENTAGE' ? 'FIXED' : 'PERCENTAGE'})}
                        >
                            <Text style={styles.typeText}>{newCoupon.discountType === 'PERCENTAGE' ? '%' : '₹'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput 
                        placeholder="Expiry Date (YYYY-MM-DD)" 
                        placeholderTextColor={theme.colors.muted}
                        style={styles.input}
                        value={newCoupon.expiryDate}
                        onChangeText={(t) => setNewCoupon({...newCoupon, expiryDate: t})}
                    />
                    <TouchableOpacity style={styles.deployBtn} onPress={handleCreateCoupon}>
                        <Text style={styles.deployText}>DEPLOY CODE</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={coupons}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>NO ACTIVE CODES</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: '900', color: theme.colors.text, fontStyle: 'italic', textTransform: 'uppercase' },
    addBtn: { backgroundColor: theme.colors.primary, padding: 10, borderRadius: 8 },
    couponCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.card, padding: 20, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
    couponLeft: { flexDirection: 'row', alignItems: 'center' },
    couponCode: { color: theme.colors.text, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
    couponMeta: { color: theme.colors.primary, fontSize: 10, fontWeight: 'bold' },
    addForm: { backgroundColor: theme.colors.card, padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.primary },
    input: { backgroundColor: theme.colors.background, color: theme.colors.text, padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    typeToggle: { backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, width: 50, alignItems: 'center' },
    typeText: { fontWeight: '900', color: '#000' },
    deployBtn: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
    deployText: { fontWeight: '900', color: '#000', fontSize: 12 },
    emptyText: { color: theme.colors.muted, textAlign: 'center', marginTop: 50, fontWeight: 'bold' }
});
