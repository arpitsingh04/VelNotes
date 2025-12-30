import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Note } from '../types/note';
import { storage } from '../utils/storage';

interface NotesContextType {
    notes: Note[];
    loading: boolean;
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    togglePin: (id: string) => Promise<void>;
    refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotes = useCallback(async () => {
        setLoading(true);
        const storedNotes = await storage.getNotes();
        setNotes(storedNotes.sort((a, b) => b.updatedAt - a.updatedAt));
        setLoading(false);
    }, []);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = Date.now();
        const newNote: Note = {
            ...noteData,
            id: Math.random().toString(36).substring(2, 9) + now.toString(36),
            createdAt: now,
            updatedAt: now,
        };
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        await storage.saveNotes(updatedNotes);
    };

    const updateNote = async (id: string, updates: Partial<Note>) => {
        const now = Date.now();
        const updatedNotes = notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: now } : note
        );
        setNotes(updatedNotes);
        await storage.saveNotes(updatedNotes);
    };

    const deleteNote = async (id: string) => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        await storage.saveNotes(updatedNotes);
    };

    const togglePin = async (id: string) => {
        const updatedNotes = notes.map((note) =>
            note.id === id ? { ...note, pinned: !note.pinned, updatedAt: Date.now() } : note
        );
        setNotes(updatedNotes.sort((a, b) => b.updatedAt - a.updatedAt));
        await storage.saveNotes(updatedNotes);
    };

    return (
        <NotesContext.Provider
            value={{
                notes,
                loading,
                addNote,
                updateNote,
                deleteNote,
                togglePin,
                refreshNotes: loadNotes,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};
