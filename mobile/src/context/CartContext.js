import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem('cart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };
        loadCart();
    }, []);

    const saveCart = async (newCart) => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            let newCart;
            if (existingItem) {
                newCart = prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }
            saveCart(newCart);
            return newCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter((item) => item.id !== productId);
            saveCart(newCart);
            return newCart;
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart((prevCart) => {
            const newCart = prevCart.map((item) => {
                if (item.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            saveCart(newCart);
            return newCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        saveCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
