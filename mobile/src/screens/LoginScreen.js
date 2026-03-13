import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ChevronRight } from 'lucide-react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Incomplete Credentials', 'Please provide both email and security code.');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Access Denied', result.message || 'Invalid authentication signature.');
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <View style={styles.brandingContainer}>
                    <Image
                        source={require('../../assets/admin_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={styles.badge}>
                        <Lock size={12} color="#000" />
                        <Text style={styles.badgeText}>ADMIN SECURE PORTAL</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>OPERATOR IDENTITY</Text>
                    <View style={styles.inputRow}>
                        <Mail size={20} color={theme.colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            placeholderTextColor={theme.colors.muted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <Text style={styles.label}>SECURITY KEY</Text>
                    <View style={styles.inputRow}>
                        <Lock size={20} color={theme.colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.loginBtn, loading && styles.disabledBtn]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Text style={styles.loginText}>INITIALIZE SYSTEM ACCESS</Text>
                                <ChevronRight size={18} color="#000" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>AUTHORIZED PERSONNEL ONLY • CARTUNEZ v1.0</Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    inner: { flex: 1, padding: 30, justifyContent: 'center' },
    brandingContainer: { alignItems: 'center', marginBottom: 50 },
    logo: { width: 300, height: 120, marginBottom: 10 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    badgeText: { fontSize: 10, fontWeight: '900', color: '#000' },
    form: { backgroundColor: theme.colors.card, padding: 25, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border },
    label: { color: theme.colors.muted, fontSize: 10, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
    inputIcon: { marginLeft: 15 },
    input: { flex: 1, color: theme.colors.text, padding: 15, fontWeight: 'bold' },
    loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: theme.colors.primary, padding: 18, borderRadius: 12, marginTop: 10 },
    disabledBtn: { opacity: 0.7 },
    loginText: { fontWeight: '900', color: '#000', fontSize: 12, letterSpacing: 0.5 },
    footer: { color: theme.colors.muted, fontSize: 8, textAlign: 'center', marginTop: 40, fontWeight: 'bold' }
});
