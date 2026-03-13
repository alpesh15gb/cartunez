import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LayoutDashboard, Package, ShoppingCart, User, Ticket, Users, Newspaper } from 'lucide-react-native';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CouponsScreen from '../screens/CouponsScreen';
import CustomersScreen from '../screens/CustomersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewsAdminScreen from '../screens/NewsAdminScreen';
import EditProductScreen from '../screens/EditProductScreen';
import { theme } from '../theme';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function InventoryStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProductsList" component={ProductsScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Dashboard') return <LayoutDashboard size={size} color={color} />;
                    if (route.name === 'Inventory') return <Package size={size} color={color} />;
                    if (route.name === 'Orders') return <ShoppingCart size={size} color={color} />;
                    if (route.name === 'Coupons') return <Ticket size={size} color={color} />;
                    if (route.name === 'Customers') return <Users size={size} color={color} />;
                    if (route.name === 'News') return <Newspaper size={size} color={color} />;
                    if (route.name === 'Profile') return <User size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.muted,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                    paddingBottom: 10,
                    paddingTop: 5,
                    height: 60,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Inventory" component={InventoryStack} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Coupons" component={CouponsScreen} />
            <Tab.Screen name="Customers" component={CustomersScreen} />
            <Tab.Screen name="News" component={NewsAdminScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
