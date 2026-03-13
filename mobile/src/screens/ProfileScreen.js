import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { User, Shield, Bell, LogOut, ChevronRight, MapPin, Phone, Mail } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const SettingItem = ({ icon: Icon, title, value, multiline }) => (
    <TouchableOpacity style={[styles.item, multiline && { height: 'auto', alignItems: 'flex-start' }]}>
        <View style={[styles.itemLeft, multiline && { alignItems: 'flex-start' }]}>
            <Icon size={20} color={theme.colors.primary} style={multiline && { marginTop: 2 }} />
            <Text style={[styles.itemTitle, multiline && { flex: 1 }]}>{title}</Text>
        </View>
        <View style={styles.itemRight}>
            {value && <Text style={[styles.itemValue, multiline && { flex: 1, textAlign: 'right' }]}>{value}</Text>}
            <ChevronRight size={16} color={theme.colors.muted} />
        </View>
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <User size={40} color={theme.colors.primary} />
                </View>
                <Text style={styles.adminName}>Admin Control</Text>
                <Text style={styles.adminEmail}>{user?.email || 'cartunezhyd@gmail.com'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Store Information</Text>
                <SettingItem
                    icon={MapPin}
                    title="Address"
                    value="Shop 12&13, Veer Hanuman Temple, S.P. Road, Secunderabad, 500003"
                    multiline
                />
                <SettingItem icon={Phone} title="Phone" value="+91 9949695030" />
                <SettingItem icon={Mail} title="Email" value="cartunezhyd@gmail.com" />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Settings</Text>
                <SettingItem icon={Shield} title="Security" value="High" />
                <SettingItem icon={Bell} title="Notifications" value="Enabled" />
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <LogOut size={20} color={theme.colors.secondary} />
                <Text style={styles.logoutText}>Logout System</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginBottom: 16,
    },
    adminName: {
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontStyle: 'italic',
    },
    adminEmail: {
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        color: theme.colors.muted,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
        marginLeft: 4,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemValue: {
        color: theme.colors.muted,
        fontSize: 12,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 'auto',
        marginBottom: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
        borderRadius: 12,
    },
    logoutText: {
        color: theme.colors.secondary,
        fontWeight: '900',
        textTransform: 'uppercase',
        fontSize: 14,
    },
});
