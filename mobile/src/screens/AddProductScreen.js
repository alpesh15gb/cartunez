import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { theme } from '../theme';
import { Camera, ChevronLeft, Package, Tag, IndianRupee, Database, List } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';

export default function AddProductScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        categoryId: '',
        images: []
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.CATEGORIES);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.stock || !formData.categoryId) {
            Alert.alert('Incomplete Manifest', 'All primary telemetry fields must be populated.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                    stock: parseInt(formData.stock),
                    // Adding dummy images for now as image picker requires native modules
                    images: ['https://source.unsplash.com/featured/?car,parts']
                })
            });

            if (response.ok) {
                Alert.alert('Success', 'New asset deployed to inventory.');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to deploy asset.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.header}>New Asset</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Designation</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="e.g. Carbon Fiber Spoiler"
                        placeholderTextColor={theme.colors.muted}
                        value={formData.name}
                        onChangeText={(t) => setFormData({...formData, name: t})}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Logistics Details (Description)</Text>
                    <TextInput 
                        style={[styles.input, { height: 100 }]}
                        multiline
                        placeholder="Technical specifications..."
                        placeholderTextColor={theme.colors.muted}
                        value={formData.description}
                        onChangeText={(t) => setFormData({...formData, description: t})}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>MRP (Original Price)</Text>
                        <TextInput 
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor={theme.colors.muted}
                            value={formData.price}
                            onChangeText={(t) => setFormData({...formData, price: t})}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Discount Price</Text>
                        <TextInput 
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Optional"
                            placeholderTextColor={theme.colors.muted}
                            value={formData.discountPrice}
                            onChangeText={(t) => setFormData({...formData, discountPrice: t})}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stock Level</Text>
                    <TextInput 
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={theme.colors.muted}
                        value={formData.stock}
                        onChangeText={(t) => setFormData({...formData, stock: t})}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category Classification</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {categories.map((cat) => (
                            <TouchableOpacity 
                                key={cat.id}
                                style={[styles.catBtn, formData.categoryId === cat.id && styles.catBtnActive]}
                                onPress={() => setFormData({...formData, categoryId: cat.id})}
                            >
                                <Text style={[styles.catText, formData.categoryId === cat.id && styles.catTextActive]}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Compatibility Placeholder */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vehicle Compatibility (Advanced Tagger)</Text>
                    <View style={styles.compatibilityCard}>
                        <Database size={16} color={theme.colors.muted} />
                        <Text style={styles.compatibilityHint}>Global cross-reference enabled. Use web dashboard for batch tagging.</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.imageUpload}>
                    <Camera size={30} color={theme.colors.primary} />
                    <Text style={styles.uploadText}>Acquire Visual Data (Add Image)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.submitBtn, loading && { opacity: 0.5 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.submitText}>COMMIT TO DATABASE</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30, marginTop: 10 },
    header: { fontSize: 24, fontWeight: '900', color: theme.colors.text, fontStyle: 'italic', textTransform: 'uppercase' },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { color: theme.colors.muted, fontSize: 10, fontWeight: 'black', textTransform: 'uppercase', letterSpacing: 1 },
    input: { backgroundColor: theme.colors.card, color: theme.colors.text, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, fontWeight: 'bold' },
    row: { flexDirection: 'row' },
    categoryScroll: { flexDirection: 'row', gap: 10 },
    catBtn: { backgroundColor: theme.colors.card, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, marginRight: 10 },
    catBtnActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '20' },
    catText: { color: theme.colors.muted, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    catTextActive: { color: theme.colors.primary },
    imageUpload: { height: 150, backgroundColor: theme.colors.card, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: theme.colors.primary + '40', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
    uploadText: { color: theme.colors.muted, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    compatibilityCard: { backgroundColor: theme.colors.card, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 },
    compatibilityHint: { color: theme.colors.muted, fontSize: 10, flex: 1 },
    submitBtn: { backgroundColor: theme.colors.primary, padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 50 },
    submitText: { color: '#000', fontWeight: '900', fontSize: 14, textTransform: 'uppercase' }
});
