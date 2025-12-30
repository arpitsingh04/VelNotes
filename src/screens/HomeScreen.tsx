import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../store/NotesContext';
import { useTheme } from '../store/ThemeContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Note, CATEGORIES, Category } from '../types/note';
import { Plus, Search, Pin, Calendar, Tag, Trash2, Sun, Moon, Image as ImageIcon, CheckSquare, MoreVertical } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { format } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';
import { ConfirmModal } from '../components/common/ConfirmModal';

const NoteCard = ({
    note,
    onPress,
    onTogglePin,
    onDelete,
    onMore
}: {
    note: Note,
    onPress: () => void,
    onTogglePin: () => void,
    onDelete: () => void,
    onMore: () => void
}) => {
    const { theme } = useTheme();
    const colors = COLORS[theme];

    const completedItems = note.checklistItems?.filter(i => i.completed).length || 0;
    const totalItems = note.checklistItems?.length || 0;

    const swipeableRef = React.useRef<Swipeable>(null);

    const onPinPress = () => {
        swipeableRef.current?.close();
        onTogglePin();
    };

    const onDeletePress = () => {
        swipeableRef.current?.close();
        onDelete();
    };

    const renderRightActions = () => (
        <View style={styles.deleteActionContainer}>
            <View style={[styles.deleteAction, { backgroundColor: colors.error }]}>
                <Trash2 color="#fff" size={24} />
            </View>
        </View>
    );

    const renderLeftActions = () => (
        <View style={styles.pinActionContainer}>
            <View style={[styles.pinAction, { backgroundColor: note.pinned ? colors.textSecondary : colors.pinned }]}>
                <Pin color="#fff" size={24} fill={note.pinned ? 'transparent' : '#fff'} />
            </View>
        </View>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            onSwipeableLeftOpen={onPinPress}
            onSwipeableRightOpen={onDeletePress}
            friction={2}
            rightThreshold={40}
            leftThreshold={40}
            activeOffsetX={[-20, 20]}
            failOffsetY={[-10, 10]}
        >
            <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS[theme]]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                {note.images && note.images.length > 0 && (
                    <Image source={{ uri: note.images[0] }} style={styles.cardImage} />
                )}

                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                                {note.title || 'Untitled'}
                            </Text>
                        </View>
                        <View style={styles.cardHeaderActions}>
                            {note.pinned && (
                                <Pin size={16} color={colors.pinned} fill={colors.pinned} style={{ marginRight: 8 }} />
                            )}
                            <TouchableOpacity onPress={onMore} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <MoreVertical size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {note.type === 'text' ? (
                        <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={3}>
                            {note.description || 'No content'}
                        </Text>
                    ) : (
                        <View style={styles.cardChecklistSummary}>
                            <View style={[styles.checklistProgress, { backgroundColor: colors.surfaceSubtle }]}>
                                <View
                                    style={[
                                        styles.checklistProgressBar,
                                        {
                                            backgroundColor: colors.primary,
                                            width: totalItems > 0 ? `${(completedItems / totalItems) * 100}%` : '0%'
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={[styles.cardMetaText, { color: colors.textSecondary, marginTop: 4 }]}>
                                {completedItems}/{totalItems} items
                            </Text>
                        </View>
                    )}

                    <View style={styles.cardFooter}>
                        <View style={styles.categoriesContainer}>
                            {note.categories.slice(0, 2).map((cat) => (
                                <View key={cat} style={[styles.categoryBadge, { backgroundColor: colors.category[cat] + '20' }]}>
                                    <Text style={[styles.categoryBadgeText, { color: colors.category[cat] }]}>{cat}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

interface HomeHeaderProps {
    theme: 'light' | 'dark';
    colors: any;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeCategory: Category | 'All';
    setActiveCategory: (category: Category | 'All') => void;
    toggleTheme: () => void;
    insets: any;
}

const HomeHeader = React.memo(({
    theme,
    colors,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    toggleTheme,
    insets
}: HomeHeaderProps) => (
    <View style={{ paddingTop: SPACING.sm }}>
        <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: colors.text }]}>VelNotes</Text>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                    <LinearGradient
                        colors={colors.primaryGradient as any}
                        style={styles.themeToggleGradient}
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} color="#fff" />
                        ) : (
                            <Moon size={20} color="#fff" />
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                <Search size={20} color={colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search notes..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={['All', ...CATEGORIES]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setActiveCategory(item as Category | 'All')}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: activeCategory === item ? colors.primary : colors.surfaceSubtle,
                                borderColor: activeCategory === item ? colors.primary : colors.border
                            }
                        ]}
                    >
                        <Text style={[
                            styles.filterChipText,
                            { color: activeCategory === item ? '#fff' : colors.textSecondary }
                        ]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.filterList}
            />
        </View>
    </View>
));

export default function HomeScreen() {
    const { notes, togglePin, deleteNote } = useNotes();
    const { theme, mode, setMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [noteForActions, setNoteForActions] = useState<Note | null>(null);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const colors = COLORS[theme];

    const toggleTheme = () => {
        setMode(theme === 'dark' ? 'light' : 'dark');
    };

    const filteredNotes = useMemo(() => {
        let result = notes.filter((note) => {
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = activeCategory === 'All' || note.categories.includes(activeCategory);

            return matchesSearch && matchesCategory;
        });

        // Sort: Pinned first, then by updatedAt
        return result.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.updatedAt - a.updatedAt;
        });
    }, [notes, searchQuery, activeCategory]);

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Tag size={64} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No notes yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Start by creating your first note!</Text>
            <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('NoteEditor', {})}
            >
                <Text style={styles.emptyButtonText}>Create Note</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id}
                numColumns={1}
                renderItem={({ item }) => (
                    <NoteCard
                        note={item}
                        onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
                        onTogglePin={() => togglePin(item.id)}
                        onDelete={() => setNoteToDelete(item.id)}
                        onMore={() => setNoteForActions(item)}
                    />
                )}
                ListHeaderComponent={
                    <HomeHeader
                        theme={theme}
                        colors={colors}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        toggleTheme={toggleTheme}
                        insets={insets}
                    />
                }
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
            />

            <ConfirmModal
                visible={!!noteToDelete}
                title="Delete Note"
                message="Are you sure you want to delete this note?"
                confirmText="Delete"
                isDestructive
                onConfirm={async () => {
                    if (noteToDelete) {
                        await deleteNote(noteToDelete);
                        setNoteToDelete(null);
                    }
                }}
                onCancel={() => setNoteToDelete(null)}
            />

            <ConfirmModal
                visible={!!noteForActions}
                title="Note Actions"
                message={`What would you like to do with "${noteForActions?.title || 'this note'}"?`}
                confirmText={noteForActions?.pinned ? "Unpin Note" : "Pin Note"}
                onConfirm={async () => {
                    if (noteForActions) {
                        await togglePin(noteForActions.id);
                        setNoteForActions(null);
                    }
                }}
                onCancel={() => setNoteForActions(null)}
                secondaryText="Delete Note"
                onSecondaryAction={() => {
                    if (noteForActions) {
                        const id = noteForActions.id;
                        setNoteForActions(null);
                        setNoteToDelete(id);
                    }
                }}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('NoteEditor', {})}
                style={styles.fabContainer}
            >
                <LinearGradient
                    colors={colors.primaryGradient as any}
                    style={styles.fab}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Plus color="#fff" size={32} />
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.md,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },
    themeToggle: {
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    themeToggleGradient: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        height: 54,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        marginBottom: SPACING.lg,
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: 16,
        fontWeight: '500',
    },
    filterList: {
        paddingBottom: SPACING.md,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: BORDER_RADIUS.round,
        marginRight: SPACING.sm,
        borderWidth: 1,
    },
    filterChipText: {
        fontWeight: '700',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 120,
        paddingHorizontal: SPACING.md,
    },
    card: {
        width: '100%',
        marginBottom: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: SPACING.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.xs,
    },
    cardHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        flex: 1,
        lineHeight: 22,
    },
    cardDescription: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: SPACING.xs,
    },
    cardChecklistSummary: {
        marginTop: SPACING.sm,
    },
    checklistProgress: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    checklistProgressBar: {
        height: '100%',
        borderRadius: 3,
    },
    cardFooter: {
        marginTop: SPACING.md,
    },
    cardMetaText: {
        fontSize: 11,
        fontWeight: '600',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        marginRight: 4,
        marginBottom: 4,
    },
    categoryBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    fabContainer: {
        position: 'absolute',
        right: 24,
        bottom: 32,
        borderRadius: BORDER_RADIUS.xl,
        elevation: 8,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
    },
    fab: {
        width: 68,
        height: 68,
        borderRadius: BORDER_RADIUS.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginTop: SPACING.md,
    },
    emptySubtitle: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
        opacity: 0.7,
    },
    emptyButton: {
        marginTop: SPACING.xl,
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
    deleteActionContainer: {
        width: 100,
        height: '100%',
        paddingBottom: SPACING.md,
    },
    deleteAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.xl,
    },
    pinActionContainer: {
        width: 100,
        height: '100%',
        paddingBottom: SPACING.md,
    },
    pinAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.xl,
    },
});
