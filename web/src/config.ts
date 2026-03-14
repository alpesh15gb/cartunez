const isServer = typeof window === 'undefined';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || (
    isServer 
    ? (process.env.INTERNAL_API_URL || 'http://backend:5000/api') 
    : '/api'
);

export const API_ENDPOINTS = {
    PRODUCTS: `${API_URL}/products`,
    CATEGORIES: `${API_URL}/categories`,
    ORDERS: `${API_URL}/orders`,
    AUTH: `${API_URL}/auth`,
    USERS: `${API_URL}/users`,
    WISHLIST: `${API_URL}/wishlist`,
    COUPONS: `${API_URL}/coupons`,
    STATS: `${API_URL}/stats`,
    VEHICLES: `${API_URL}/vehicles`,
    REVIEWS: `${API_URL}/reviews`,
};
