import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { theme } from '../theme';
import { Clock, CheckCircle, Truck, XCircle, ChevronDown, PackageCheck } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINTS.ORDERS}/all`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchOrders();
                setModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to update order status.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    const getStatusIcon = (status) => {
        if (status === 'Shipped') return <Truck size={14} color={theme.colors.primary} />;
        if (status === 'Processing') return <Clock size={14} color={theme.colors.secondary} />;
        if (status === 'Delivered') return <CheckCircle size={14} color={theme.colors.accent} />;
        return <XCircle size={14} color={theme.colors.muted} />;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.orderCard}
            onPress={() => {
                setSelectedOrder(item);
                setModalVisible(true);
            }}
        >
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.customerName}>{item.user?.email || 'Guest User'}</Text>
                    <Text style={styles.orderId}>#ORDER-{item.id.substring(15).toUpperCase()}</Text>
                </View>
                <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.orderFooter}>
                <View style={styles.statusBadge}>
                    {getStatusIcon(item.status)}
                    <Text style={[styles.statusText, { marginLeft: 6 }]}>{item.status}</Text>
                </View>
                <Text style={styles.orderAmount}>₹{item.totalAmount.toLocaleString()}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.muted, marginTop: 10, fontSize: 10, fontWeight: 'bold' }}>intercepting order streams...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Orders</Text>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                    <View style={{ marginTop: 100, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.muted, fontWeight: 'bold' }}>NO ORDERS IN MANIFEST</Text>
                    </View>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Protocol Override</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <XCircle size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Update Order Status for {selectedOrder?.id.substring(15).toUpperCase()}</Text>
                        
                        <View style={styles.statusGrid}>
                            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                <TouchableOpacity 
                                    key={status}
                                    style={[styles.statusBtn, selectedOrder?.status === status && styles.statusBtnActive]}
                                    onPress={() => updateStatus(selectedOrder.id, status)}
                                >
                                    <Text style={[styles.statusBtnText, selectedOrder?.status === status && styles.statusBtnTextActive]}>{status}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    header: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
        fontStyle: 'italic',
        textTransform: 'uppercase',
        marginBottom: theme.spacing.lg,
    },
    orderCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    customerName: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        color: theme.colors.muted,
        fontSize: 12,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        color: theme.colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    orderAmount: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    orderId: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        borderTopWidth: 2,
        borderTopColor: theme.colors.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    },
    modalSubtitle: {
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statusBtn: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        minWidth: '45%',
        alignItems: 'center',
    },
    statusBtnActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '20',
    },
    statusBtnText: {
        color: theme.colors.muted,
        fontSize: 10,
        fontWeight: 'black',
        textTransform: 'uppercase',
    },
    statusBtnTextActive: {
        color: theme.colors.primary,
    },
});
