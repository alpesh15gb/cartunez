import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { theme } from '../theme';
import { User, ChevronRight, ShoppingBag, Mail, Calendar } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';

export default function CustomersScreen() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.USERS);
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.customerCard}>
            <View style={styles.avatar}>
                <User size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.info}>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.metaRow}>
                    <View style={styles.meta}>
                        <ShoppingBag size={10} color={theme.colors.muted} />
                        <Text style={styles.metaText}>{item._count?.orders || 0} Orders</Text>
                    </View>
                    <View style={styles.meta}>
                        <Calendar size={10} color={theme.colors.muted} />
                        <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>
            <ChevronRight size={18} color={theme.colors.muted} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Customer Directory</Text>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={customers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>NO DATA IN DIRECTORY</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
    header: { fontSize: 24, fontWeight: '900', color: theme.colors.text, fontStyle: 'italic', textTransform: 'uppercase', marginBottom: 20 },
    customerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border },
    avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: theme.colors.primary },
    info: { flex: 1 },
    email: { color: theme.colors.text, fontSize: 14, fontWeight: 'bold' },
    metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { color: theme.colors.muted, fontSize: 10, fontWeight: 'bold' },
    emptyText: { color: theme.colors.muted, textAlign: 'center', marginTop: 50, fontWeight: 'bold' }
});
