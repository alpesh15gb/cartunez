'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    signup: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('cartunez_user');
        const storedToken = localStorage.getItem('cartunez_token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('cartunez_token', newToken);
        localStorage.setItem('cartunez_user', JSON.stringify(newUser));
    };

    const signup = (newToken: string, newUser: User) => {
        login(newToken, newUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('cartunez_token');
        localStorage.removeItem('cartunez_user');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
