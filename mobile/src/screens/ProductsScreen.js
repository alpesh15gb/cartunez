import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { Plus, Edit3, Trash2, RefreshCcw } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';

export default function ProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCTS);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            Alert.alert('Error', 'Failed to fetch inventory from the backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to decommission this part from the inventory?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
                                method: 'DELETE'
                            });
                            if (response.ok) {
                                fetchProducts();
                            } else {
                                Alert.alert('Error', 'Failed to delete product.');
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                        }
                    }
                }
            ]
        );
    };
    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <View style={styles.imagePlaceholder}>
                {item.images && item.images[0] ? (
                    <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                ) : (
                    <Text style={{ fontSize: 20 }}>🏎️</Text>
                )}
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productMeta}>{item.category?.name || 'Uncategorized'} • In Stock: {item.stock}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.productPrice}>₹{(item.discountPrice || item.price).toLocaleString()}</Text>
                    {item.discountPrice && (
                        <Text style={[styles.productMeta, { textDecorationLine: 'line-through' }]}>₹{item.price.toLocaleString()}</Text>
                    )}
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Edit3 size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                    <Trash2 size={18} color={theme.colors.secondary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.muted, marginTop: 10, fontSize: 10, fontWeight: 'bold' }}>SCANNING INVENTORY...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Inventory</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.refreshBtn} onPress={fetchProducts}>
                        <RefreshCcw size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
                        <Plus size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View style={{ marginTop: 100, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.muted, fontWeight: 'bold' }}>NO ASSETS FOUND IN DATABASE</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    header: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },
    addBtn: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 8,
    },
    refreshBtn: {
        backgroundColor: theme.colors.card,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    productMeta: {
        color: theme.colors.muted,
        fontSize: 10,
        marginTop: 2,
    },
    productPrice: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionBtn: {
        padding: 8,
    }
});
