import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const NOTES_KEY = '@velnotes_notes_v1';

export const storage = {
    async saveNotes(notes: Note[]): Promise<void> {
        try {
            const jsonValue = JSON.stringify(notes);
            await AsyncStorage.setItem(NOTES_KEY, jsonValue);
        } catch (e) {
            console.error('Error saving notes:', e);
        }
    },

    async getNotes(): Promise<Note[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Error getting notes:', e);
            return [];
        }
    },

    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.removeItem(NOTES_KEY);
        } catch (e) {
            console.error('Error clearing notes:', e);
        }
    }
};
