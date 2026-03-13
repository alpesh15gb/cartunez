import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { theme } from '../theme';
import { Plus, Trash2, Newspaper, Link as LinkIcon, Image as ImageIcon, Send } from 'lucide-react-native';
import { API_ENDPOINTS } from '../config';
import { useAuth } from '../context/AuthContext';

export default function NewsAdminScreen() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        imageUrl: '',
        externalUrl: ''
    });
    const { token } = useAuth();

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.NEWS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchNews();
    }, [token]);

    const handleCreatePost = async () => {
        if (!newPost.title || !newPost.content) {
            Alert.alert('Incomplete Data', 'Please fill in at least title and content.');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.NEWS, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newPost)
            });
            if (response.ok) {
                fetchNews();
                setShowAdd(false);
                setNewPost({ title: '', content: '', imageUrl: '', externalUrl: '' });
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to create news post.');
            }
        } catch (error) {
            console.error('Error creating news post:', error);
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Delete Post", "Are you sure you want to remove this news update?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await fetch(`${API_ENDPOINTS.NEWS}/${id}`, { 
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) fetchNews();
                    } catch (error) { console.error(error); }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.newsCard}>
            <View style={styles.newsContent}>
                <View style={styles.titleRow}>
                    <Newspaper size={18} color={theme.colors.primary} />
                    <Text style={styles.newsTitle} numberOfLines={1}>{item.title}</Text>
                </View>
                <Text style={styles.newsDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.newsSnippet} numberOfLines={2}>{item.content}</Text>
                {item.externalUrl && (
                    <View style={styles.linkRow}>
                        <LinkIcon size={12} color={theme.colors.muted} />
                        <Text style={styles.linkText} numberOfLines={1}>{item.externalUrl}</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Trash2 size={18} color={theme.colors.secondary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>News Manager</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
                    <Plus size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {showAdd && (
                <ScrollView style={styles.addForm} showsVerticalScrollIndicator={false}>
                    <Text style={styles.formLabel}>Post Title</Text>
                    <TextInput 
                        placeholder="e.g. New Performance Intake Arrived!" 
                        placeholderTextColor={theme.colors.muted}
                        style={styles.input}
                        value={newPost.title}
                        onChangeText={(t) => setNewPost({...newPost, title: t})}
                    />
                    
                    <Text style={styles.formLabel}>Description / Content</Text>
                    <TextInput 
                        placeholder="Details about the update..." 
                        placeholderTextColor={theme.colors.muted}
                        style={[styles.input, styles.textArea]}
                        multiline
                        numberOfLines={3}
                        value={newPost.content}
                        onChangeText={(t) => setNewPost({...newPost, content: t})}
                    />

                    <Text style={styles.formLabel}>Image URL (Optional)</Text>
                    <View style={styles.inputRow}>
                        <ImageIcon size={16} color={theme.colors.muted} style={{ marginRight: 10 }} />
                        <TextInput 
                            placeholder="https://..." 
                            placeholderTextColor={theme.colors.muted}
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            value={newPost.imageUrl}
                            onChangeText={(t) => setNewPost({...newPost, imageUrl: t})}
                        />
                    </View>

                    <Text style={styles.formLabel}>Social Link (FB/IG - Optional)</Text>
                    <View style={[styles.inputRow, { marginBottom: 20 }]}>
                        <LinkIcon size={16} color={theme.colors.muted} style={{ marginRight: 10 }} />
                        <TextInput 
                            placeholder="Paste post link here..." 
                            placeholderTextColor={theme.colors.muted}
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            value={newPost.externalUrl}
                            onChangeText={(t) => setNewPost({...newPost, externalUrl: t})}
                        />
                    </View>

                    <TouchableOpacity style={styles.deployBtn} onPress={handleCreatePost}>
                        <Send size={18} color="#000" style={{ marginRight: 8 }} />
                        <Text style={styles.deployText}>PUBLISH UPDATE</Text>
                    </TouchableOpacity>
                    <View style={{ height: 20 }} />
                </ScrollView>
            )}

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={news}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>NO UPDATES PUBLISHED</Text>}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.md },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    header: { fontSize: 24, fontWeight: '900', color: theme.colors.text, fontStyle: 'italic', textTransform: 'uppercase' },
    addBtn: { backgroundColor: theme.colors.primary, padding: 10, borderRadius: 8 },
    newsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.card, padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
    newsContent: { flex: 1 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    newsTitle: { color: theme.colors.text, fontSize: 15, fontWeight: '900', marginLeft: 8, flex: 1 },
    newsDate: { color: theme.colors.muted, fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
    newsSnippet: { color: theme.colors.text, fontSize: 12, opacity: 0.7, lineHeight: 18 },
    linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    linkText: { color: theme.colors.muted, fontSize: 10, fontStyle: 'italic', marginLeft: 6, flex: 1 },
    deleteBtn: { padding: 10, marginLeft: 10 },
    addForm: { backgroundColor: theme.colors.card, padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.primary, maxHeight: '70%' },
    formLabel: { color: theme.colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 },
    input: { backgroundColor: theme.colors.background, color: theme.colors.text, padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: theme.colors.border, fontWeight: 'bold' },
    textArea: { height: 80, textAlignVertical: 'top' },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 12, marginBottom: 15 },
    deployBtn: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    deployText: { fontWeight: '900', color: '#000', fontSize: 14 },
    emptyText: { color: theme.colors.muted, textAlign: 'center', marginTop: 50, fontWeight: 'bold', letterSpacing: 2 }
});
