import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';
import { IMAGE_BASE_URL } from '../config';

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2;

export default function ProductCard({ product, onPress }) {
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

    const currentPrice = product.discountPrice || product.price;
    const oldPrice = product.discountPrice ? product.price : null;
    const discountAmount = oldPrice ? oldPrice - currentPrice : 0;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image
                    source={getImageUrl(product.images) ? { uri: getImageUrl(product.images) } : { uri: 'https://via.placeholder.com/150' }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <TouchableOpacity style={styles.wishlistBtn}>
                    <Heart size={18} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.priceRow}>
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>₹{currentPrice.toLocaleString('en-IN')}</Text>
                    </View>
                    {oldPrice && (
                        <Text style={styles.oldPrice}>₹{oldPrice.toLocaleString('en-IN')}</Text>
                    )}
                </View>

                {discountAmount > 0 && (
                    <Text style={styles.discountText}>₹{discountAmount.toLocaleString('en-IN')} OFF</Text>
                )}

                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.unit}>1 unit</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '90%',
        height: '90%',
    },
    wishlistBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    content: {
        marginTop: 12,
        paddingHorizontal: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    priceBadge: {
        backgroundColor: '#287b3e',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priceText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    oldPrice: {
        color: '#999',
        fontSize: 11,
        textDecorationLine: 'line-through',
    },
    discountText: {
        color: '#287b3e',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    name: {
        fontSize: 12,
        color: '#333',
        fontWeight: '600',
        marginTop: 6,
        lineHeight: 16,
        height: 32,
    },
    footer: {
        marginTop: 8,
    },
    unit: {
        fontSize: 10,
        color: '#999',
    },
});
