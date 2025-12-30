import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    Image,
    KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useNotes } from '../store/NotesContext';
import { useTheme } from '../store/ThemeContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { CATEGORIES, Category } from '../types/note';
import { ChevronLeft, Trash2, Pin, Check, X, Image as ImageIcon, List, Type, Plus } from 'lucide-react-native';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ChecklistItem, Note } from '../types/note';

type NoteEditorRouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

export default function NoteEditorScreen() {
    const navigation = useNavigation();
    const route = useRoute<NoteEditorRouteProp>();
    const insets = useSafeAreaInsets();
    const { noteId } = route.params;
    const { notes, addNote, updateNote, deleteNote } = useNotes();
    const { theme } = useTheme();
    const colors = COLORS[theme];

    const existingNote = noteId ? notes.find((n) => n.id === noteId) : null;

    const [title, setTitle] = useState(existingNote?.title || '');
    const [description, setDescription] = useState(existingNote?.description || '');
    const [type, setType] = useState<'text' | 'checklist'>(existingNote?.type || 'text');
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(existingNote?.checklistItems || []);
    const [images, setImages] = useState<string[]>(existingNote?.images || []);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(existingNote?.categories || []);
    const [pinned, setPinned] = useState(existingNote?.pinned || false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSave = async () => {
        if (!title && !description && checklistItems.length === 0) {
            navigation.goBack();
            return;
        }

        const noteData = {
            title,
            description,
            type,
            checklistItems,
            images,
            categories: selectedCategories,
            pinned,
        };

        if (existingNote) {
            await updateNote(existingNote.id, noteData);
        } else {
            await addNote(noteData);
        }
        navigation.goBack();
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const addChecklistItem = () => {
        const newItem: ChecklistItem = {
            id: Math.random().toString(36).substring(7),
            text: '',
            completed: false,
        };
        setChecklistItems([...checklistItems, newItem]);
    };

    const updateChecklistItem = (id: string, text: string) => {
        setChecklistItems(checklistItems.map(item => item.id === id ? { ...item, text } : item));
    };

    const toggleChecklistItem = (id: string) => {
        setChecklistItems(checklistItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const removeChecklistItem = (id: string) => {
        setChecklistItems(checklistItems.filter(item => item.id !== id));
    };

    const handleDelete = async () => {
        if (existingNote) {
            await deleteNote(existingNote.id);
            setShowDeleteModal(false);
            navigation.goBack();
        }
    };

    const toggleCategory = (category: Category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c: Category) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <ChevronLeft size={28} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={[styles.headerButton, { marginRight: SPACING.sm }]}
                        >
                            <ImageIcon size={22} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setPinned(!pinned)}
                            style={[styles.headerButton, { marginRight: SPACING.sm }]}
                        >
                            <Pin size={22} color={pinned ? colors.pinned : colors.textSecondary} fill={pinned ? colors.pinned : 'transparent'} />
                        </TouchableOpacity>

                        {existingNote && (
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(true)}
                                style={[styles.headerButton, { marginRight: SPACING.sm }]}
                            >
                                <Trash2 size={22} color={colors.error} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={handleSave}>
                            <LinearGradient
                                colors={colors.primaryGradient as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.saveButton}
                            >
                                <Check size={24} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                            {images.map((uri, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri }} style={styles.imageThumb} />
                                    <TouchableOpacity
                                        style={styles.removeImage}
                                        onPress={() => setImages(images.filter((_, i) => i !== index))}
                                    >
                                        <X size={14} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <TextInput
                        style={[styles.titleInput, { color: colors.text }]}
                        placeholder="Title"
                        placeholderTextColor={colors.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                        multiline
                        scrollEnabled={false}
                    />

                    <View style={styles.categoriesSection}>
                        <View style={styles.categoriesContainer}>
                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCategories.includes(cat);
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => toggleCategory(cat)}
                                        style={[
                                            styles.categoryChip,
                                            {
                                                backgroundColor: isSelected ? colors.category[cat] : colors.surfaceSubtle,
                                                borderColor: isSelected ? colors.category[cat] : colors.border
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.categoryChipText, { color: isSelected ? '#fff' : colors.textSecondary }]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {type === 'text' ? (
                        <TextInput
                            style={[styles.descriptionInput, { color: colors.text }]}
                            placeholder="Start typing..."
                            placeholderTextColor={colors.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    ) : (
                        <View style={styles.checklistContainer}>
                            {checklistItems.map((item) => (
                                <View key={item.id} style={styles.checklistItem}>
                                    <TouchableOpacity
                                        onPress={() => toggleChecklistItem(item.id)}
                                        style={[styles.checkbox, { borderColor: item.completed ? colors.success : colors.border, backgroundColor: item.completed ? colors.success : 'transparent' }]}
                                    >
                                        {item.completed && <Check size={14} color="#fff" />}
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[styles.checklistInput, { color: item.completed ? colors.textSecondary : colors.text, textDecorationLine: item.completed ? 'line-through' : 'none' }]}
                                        value={item.text}
                                        onChangeText={(text) => updateChecklistItem(item.id, text)}
                                        placeholder="Item..."
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                    <TouchableOpacity onPress={() => removeChecklistItem(item.id)}>
                                        <X size={20} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity onPress={addChecklistItem} style={styles.addItemButton}>
                                <Plus size={20} color={colors.primary} />
                                <Text style={[styles.addItemText, { color: colors.primary }]}>Add Item</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

            </KeyboardAvoidingView>

            <ConfirmModal
                visible={showDeleteModal}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Delete"
                isDestructive={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveButton: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.sm,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    imageScroll: {
        marginBottom: SPACING.md,
    },
    imageWrapper: {
        marginRight: SPACING.sm,
        position: 'relative',
    },
    imageThumb: {
        width: 120,
        height: 120,
        borderRadius: BORDER_RADIUS.md,
    },
    removeImage: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleInput: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: SPACING.sm,
        padding: 0,
    },
    descriptionInput: {
        fontSize: 18,
        lineHeight: 28,
        minHeight: 400,
        padding: 0,
    },
    markdownContainer: {
        minHeight: 400,
        backgroundColor: 'transparent',
    },
    categoriesSection: {
        marginBottom: SPACING.lg,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.round,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '700',
    },
    checklistContainer: {
        marginBottom: SPACING.xl,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    checklistInput: {
        flex: 1,
        fontSize: 18,
        paddingVertical: 8,
    },
    addItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
        paddingVertical: 8,
    },
    addItemText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: SPACING.sm,
    },
});
