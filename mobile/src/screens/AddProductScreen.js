import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { Plus, Package, Tag, Database, Layers, Camera, Trash2 } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';
import { useAuth } from '../context/AuthContext';

export default function AddProductScreen({ navigation }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stockQuantity: '',
        categoryId: '',
        images: [], // Real array now
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.CATEGORIES);
                const data = await response.json();
                setCategories(data);
                if (data.length > 0) setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        if (!formData.name || !formData.price || !formData.stockQuantity || !formData.categoryId) {
            Alert.alert('Incomplete Data', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCTS, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Alert.alert('Success', 'Weapon added to inventory');
                navigation.goBack();
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Transmission failed');
            }
        } catch (error) {
            console.error('Create error:', error);
            Alert.alert('Error', 'Connection to database failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add New Product</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Name</Text>
                    <View style={styles.inputWrapper}>
                        <Package size={18} color={theme.colors.muted} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Enter product name"
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Enter description"
                        placeholderTextColor={theme.colors.muted}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Price (₹)</Text>
                        <View style={styles.inputWrapper}>
                            <Tag size={18} color={theme.colors.muted} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                value={formData.price}
                                onChangeText={(text) => setFormData({ ...formData, price: text })}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Stock</Text>
                        <View style={styles.inputWrapper}>
                            <Database size={18} color={theme.colors.muted} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                value={formData.stockQuantity}
                                onChangeText={(text) => setFormData({ ...formData, stockQuantity: text })}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Images (URLs)</Text>
                    {formData.images.map((img, index) => (
                        <View key={index} style={[styles.inputWrapper, { marginBottom: 10 }]}>
                            <Camera size={18} color={theme.colors.muted} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                value={img}
                                onChangeText={(text) => {
                                    const newImages = [...formData.images];
                                    newImages[index] = text;
                                    setFormData({ ...formData, images: newImages });
                                }}
                                placeholder="https://image-url.com"
                                placeholderTextColor={theme.colors.muted}
                            />
                            <TouchableOpacity 
                                style={{ padding: 10 }} 
                                onPress={() => {
                                    const newImages = formData.images.filter((_, i) => i !== index);
                                    setFormData({ ...formData, images: newImages });
                                }}
                            >
                                <Trash2 size={18} color={theme.colors.secondary} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity 
                        style={styles.addImgBtn}
                        onPress={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                    >
                        <Plus size={16} color={theme.colors.primary} />
                        <Text style={styles.addImgText}>Add Image URL</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryGrid}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.catBtn, formData.categoryId === cat.id && styles.catBtnActive]}
                                onPress={() => setFormData({ ...formData, categoryId: cat.id })}
                            >
                                <Text style={[styles.catText, formData.categoryId === cat.id && styles.catTextActive]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.createBtn, loading && styles.disabledBtn]} 
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.createBtnText}>ADD TO INVENTORY</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.card },
    headerTitle: { fontSize: 24, fontWeight: '900', color: theme.colors.text, textTransform: 'uppercase', fontStyle: 'italic' },
    form: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 10, fontWeight: '900', color: theme.colors.muted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
    icon: { marginLeft: 15 },
    input: { flex: 1, padding: 15, color: theme.colors.text, fontWeight: 'bold' },
    textArea: { height: 100, textAlignVertical: 'top', backgroundColor: theme.colors.card, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, padding: 15 },
    row: { flexDirection: 'row' },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    catBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border },
    catBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    catText: { color: theme.colors.muted, fontSize: 11, fontWeight: 'bold' },
    catTextActive: { color: '#000' },
    createBtn: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    createBtnText: { fontWeight: '900', color: '#000', fontSize: 14 },
    disabledBtn: { opacity: 0.7 },
    addImgBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.primary, justifyContent: 'center', marginTop: 5 },
    addImgText: { color: theme.colors.primary, fontWeight: '900', fontSize: 11, marginLeft: 8, textTransform: 'uppercase' },
});
