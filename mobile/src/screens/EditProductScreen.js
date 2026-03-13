import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { Save, X, Package, Tag, Layers, Database } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';
import { useAuth } from '../context/AuthContext';

export default function EditProductScreen({ route, navigation }) {
    const { product } = route.params;
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
        stockQuantity: product.stockQuantity.toString(),
        categoryId: product.categoryId,
    });

    const handleSave = async () => {
        if (!formData.name || !formData.price || !formData.stockQuantity) {
            Alert.alert('Incomplete Data', 'Name, Price and Stock are required.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${product.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Alert.alert('Success', 'Product updated successfully');
                navigation.goBack();
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Connection to database failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <X size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Product</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color={theme.colors.primary} /> : <Save size={24} color={theme.colors.primary} />}
                </TouchableOpacity>
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
                        <Text style={styles.label}>Discount Price (₹)</Text>
                        <View style={styles.inputWrapper}>
                            <Tag size={18} color={theme.colors.muted} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                value={formData.discountPrice}
                                onChangeText={(text) => setFormData({ ...formData, discountPrice: text })}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stock Quantity</Text>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.card },
    headerTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.text, textTransform: 'uppercase', fontStyle: 'italic' },
    form: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 10, fontWeight: '900', color: theme.colors.muted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
    icon: { marginLeft: 15 },
    input: { flex: 1, padding: 15, color: theme.colors.text, fontWeight: 'bold' },
    textArea: { height: 100, textAlignVertical: 'top', backgroundColor: theme.colors.card, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, padding: 15 },
    row: { flexDirection: 'row' },
});
