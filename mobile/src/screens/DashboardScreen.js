import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Icon size={20} color={color} />
        </View>
        <Text style={styles.cardValue}>{value}</Text>
    </View>
);

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        customers: 0,
        totalSales: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Using localhost for now, might need IP for real device
                const response = await fetch(API_ENDPOINTS.STATS);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.brandingContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.header}>Admin <Text style={{ color: theme.colors.primary }}>Dashboard</Text></Text>
            </View>

            <View style={styles.statsGrid}>
                <TouchableOpacity style={styles.statWrapper} onPress={() => navigation.navigate('Orders')}>
                    <StatCard title="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} icon={TrendingUp} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.statWrapper} onPress={() => navigation.navigate('Orders')}>
                    <StatCard title="New Orders" value={stats.orders.toString()} icon={ShoppingBag} color={theme.colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.statWrapper} onPress={() => navigation.navigate('Inventory')}>
                    <StatCard title="Products" value={stats.products.toString()} icon={Package} color={theme.colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.statWrapper} onPress={() => navigation.navigate('Customers')}>
                    <StatCard title="Customers" value={stats.customers.toString()} icon={Users} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.orderRow}>
                        <View>
                            <Text style={styles.orderId}>Order #CTZ-100{i}</Text>
                            <Text style={styles.orderDate}>10 Mar 2026</Text>
                        </View>
                        <View style={styles.orderStatus}>
                            <Text style={styles.statusText}>Processing</Text>
                            <Text style={styles.orderAmount}>₹4,500</Text>
                        </View>
                    </View>
                ))}
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('Orders')}>
                    <Text style={styles.viewAllText}>View All Orders →</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    brandingContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.md,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    logo: {
        width: 350,
        height: 180,
        marginBottom: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000000',
        fontStyle: 'italic',
        textTransform: 'uppercase',
        letterSpacing: -0.5,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    statWrapper: {
        width: '47%',
    },
    card: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.spacing.sm,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    cardTitle: {
        color: theme.colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardValue: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '900',
    },
    section: {
        marginTop: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: theme.spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
        paddingLeft: 10,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    orderId: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    orderDate: {
        color: theme.colors.muted,
        fontSize: 10,
    },
    orderStatus: {
        alignItems: 'flex-end',
    },
    statusText: {
        color: theme.colors.secondary,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    orderAmount: {
        color: theme.colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    viewAllBtn: {
        marginTop: theme.spacing.sm,
        alignItems: 'center',
        padding: theme.spacing.sm,
    },
    viewAllText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
});
