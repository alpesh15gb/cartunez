import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions, 
    SafeAreaView,
    StatusBar,
    Animated
} from 'react-native';
import { ChevronLeft, Search, Share2, Heart, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { IMAGE_BASE_URL } from '../config';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;
    const { addToCart } = useCart();
    
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isHighlightsOpen, setIsHighlightsOpen] = useState(true);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const images = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [];
    
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${IMAGE_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
    };

    const currentPrice = product.discountPrice || product.price;
    const oldPrice = product.discountPrice ? product.price : null;
    const discountAmount = oldPrice ? oldPrice - currentPrice : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Transparent Header Overlay */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <ChevronLeft size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Search size={22} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Share2 size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <ScrollView 
                        horizontal 
                        pagingEnabled 
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                            setActiveImageIndex(newIndex);
                        }}
                    >
                        {images.length > 0 ? images.map((img, index) => (
                            <Image 
                                key={index}
                                source={{ uri: getImageUrl(img) }} 
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        )) : (
                            <View style={[styles.productImage, styles.placeholderContainer]}>
                                <Text style={styles.placeholderText}>🚗</Text>
                            </View>
                        )}
                    </ScrollView>
                    
                    {/* Pagination Dots */}
                    {images.length > 1 && (
                        <View style={styles.pagination}>
                            {images.map((_, index) => (
                                <View 
                                    key={index}
                                    style={[
                                        styles.dot,
                                        activeImageIndex === index ? styles.activeDot : styles.inactiveDot
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Product Info Section */}
                <View style={styles.infoBlock}>
                    <View style={styles.titleRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <TouchableOpacity>
                            <Heart size={24} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.quantity}>Net quantity: 1 pc</Text>

                    <View style={styles.priceContainer}>
                        <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>₹{currentPrice.toLocaleString('en-IN')}</Text>
                        </View>
                        {oldPrice && (
                            <View style={styles.oldPriceContainer}>
                                <Text style={styles.oldPriceLabel}>MRP </Text>
                                <Text style={styles.oldPriceValue}>₹{oldPrice.toLocaleString('en-IN')}</Text>
                                <Text style={styles.taxes}> (incl. of all taxes)</Text>
                                {discountAmount > 0 && (
                                    <Text style={styles.discountBadge}> ₹{discountAmount.toLocaleString('en-IN')} OFF</Text>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {/* Highlights Accordion */}
                <View style={styles.accordion}>
                    <TouchableOpacity 
                        style={styles.accordionHeader} 
                        onPress={() => setIsHighlightsOpen(!isHighlightsOpen)}
                    >
                        <Text style={styles.accordionTitle}>Highlights</Text>
                        {isHighlightsOpen ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                    </TouchableOpacity>
                    
                    {isHighlightsOpen && (
                        <View style={styles.accordionContent}>
                            <View style={styles.specRow}>
                                <Text style={styles.specLabel}>Category</Text>
                                <Text style={styles.specValue}>{product.category?.name || 'Automotive'}</Text>
                            </View>
                            <View style={styles.specRow}>
                                <Text style={styles.specLabel}>Unit</Text>
                                <Text style={styles.specValue}>1 pc</Text>
                            </View>
                            <View style={styles.specRowFull}>
                                <Text style={styles.specLabel}>Description</Text>
                                <Text style={styles.description}>
                                    {product.description?.replace(/<[^>]*>?/gm, '') || 'Premium automotive product designed for performance.'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Information Accordion */}
                <View style={[styles.accordion, { marginBottom: 100 }]}>
                    <TouchableOpacity 
                        style={styles.accordionHeader} 
                        onPress={() => setIsInfoOpen(!isInfoOpen)}
                    >
                        <Text style={styles.accordionTitle}>Information</Text>
                        {isInfoOpen ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
                    </TouchableOpacity>
                    
                    {isInfoOpen && (
                        <View style={styles.accordionContent}>
                            <View style={styles.specRowFull}>
                                <Text style={styles.specLabel}>Disclaimer</Text>
                                <Text style={styles.disclaimer}>
                                    All images are for representational purposes only. It is advised that you read the details, directions for use, and manufacturing information before purchasing.
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={styles.addToCartBtn}
                    onPress={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: currentPrice,
                        image: images[0] || null
                    })}
                >
                    <Text style={styles.addToCartText}>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    headerIcon: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 20,
        elevation: 2,
    },
    scrollContent: {
        backgroundColor: '#f3f4f6',
    },
    imageContainer: {
        backgroundColor: '#fff',
        height: width * 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: width,
        height: width * 1,
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 100,
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    activeDot: {
        width: 16,
        backgroundColor: '#333',
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#ccc',
    },
    infoBlock: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 15,
        marginBottom: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        flex: 1,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    priceContainer: {
        marginTop: 4,
    },
    priceBadge: {
        backgroundColor: '#287b3e',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priceText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    oldPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        flexWrap: 'wrap',
    },
    oldPriceLabel: {
        fontSize: 12,
        color: '#666',
    },
    oldPriceValue: {
        fontSize: 12,
        color: '#666',
        textDecorationLine: 'line-through',
    },
    taxes: {
        fontSize: 12,
        color: '#666',
    },
    discountBadge: {
        fontSize: 12,
        color: '#287b3e',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    accordion: {
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    accordionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },
    accordionContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    specRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    specRowFull: {
        marginBottom: 12,
    },
    specLabel: {
        width: '35%',
        fontSize: 14,
        color: '#666',
    },
    specValue: {
        flex: 1,
        fontSize: 14,
        color: '#111',
        fontWeight: '500',
    },
    description: {
        marginTop: 4,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    disclaimer: {
        marginTop: 4,
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    addToCartBtn: {
        backgroundColor: '#e83e8c',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
