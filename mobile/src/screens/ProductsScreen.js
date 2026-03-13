import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { theme } from '../theme';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react-native';
import { API_ENDPOINTS, IMAGE_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function ProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { token } = useAuth();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?search=${search}`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const handleDelete = (id) => {
        Alert.alert("Caution", "Delete this product from inventory?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, { 
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) fetchProducts();
                    } catch (error) { console.error(error); }
                }
            }
        ]);
    };

    const getImageUrl = (images) => {
        if (!images) return null;
        const imageList = typeof images === 'string' ? JSON.parse(images) : images;
        if (imageList && imageList.length > 0) {
            const imgPath = imageList[0];
            if (imgPath.startsWith('http')) return imgPath;
            return `${IMAGE_BASE_URL}${imgPath.startsWith('/') ? imgPath : '/' + imgPath}`;
        }
        return null;
    };

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image 
                source={getImageUrl(item.images) ? { uri: getImageUrl(item.images) } : require('../../assets/admin_logo.png')} 
                style={styles.productImage} 
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category?.name || 'Uncategorized'}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
                    {item.discountPrice && <Text style={styles.discount}>₹{item.discountPrice.toLocaleString()}</Text>}
                </View>
                <Text style={[styles.stock, { color: item.stockQuantity > 5 ? theme.colors.accent : theme.colors.primary }]}>
                    {item.stockQuantity} in stock
                </Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('EditProduct', { product: item })}>
                    <Edit2 size={16} color={theme.colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                    <Trash2 size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Inventory</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProduct')}>
                    <Plus size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Search size={18} color={theme.colors.muted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search inventory..."
                    placeholderTextColor={theme.colors.muted}
                    value={search}
                    onChangeText={setSearch}
                />
                <Filter size={18} color={theme.colors.primary} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>NO PRODUCTS FOUND</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, fontStyle: 'italic', textTransform: 'uppercase' },
    addBtn: { backgroundColor: theme.colors.primary, padding: 10, borderRadius: 8 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, paddingHorizontal: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
    searchInput: { flex: 1, padding: 12, color: theme.colors.text, fontWeight: 'bold' },
    productCard: { flexDirection: 'row', backgroundColor: theme.colors.card, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
    productImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: theme.colors.background },
    productInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    productName: { color: theme.colors.text, fontSize: 14, fontWeight: 'bold' },
    productCategory: { color: theme.colors.muted, fontSize: 10, textTransform: 'uppercase' },
    priceRow: { flexDirection: 'row', gap: 10, marginTop: 4, alignItems: 'center' },
    price: { color: theme.colors.text, fontSize: 13, fontWeight: '900' },
    discount: { color: theme.colors.muted, fontSize: 10, textDecorationLine: 'line-through' },
    stock: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
    actions: { justifyContent: 'space-around', paddingLeft: 10 },
    actionBtn: { padding: 8, backgroundColor: theme.colors.background, borderRadius: 8, marginBottom: 5 },
    emptyText: { color: theme.colors.muted, textAlign: 'center', marginTop: 50, fontWeight: 'bold' }
});
