const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Standard for Android Emulator to localhost

export const API_ENDPOINTS = {
    PRODUCTS: `${API_BASE_URL}/products`,
    ORDERS: `${API_BASE_URL}/orders`,
    COUPONS: `${API_BASE_URL}/coupons`,
    USERS: `${API_BASE_URL}/users`,
    STATS: `${API_BASE_URL}/stats`,
    CATEGORIES: `${API_BASE_URL}/categories`,
};

export default API_BASE_URL;
