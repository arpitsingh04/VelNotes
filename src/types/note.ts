export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface Note {
    id: string;
    title: string;
    description: string;
    type: 'text' | 'checklist';
    checklistItems?: ChecklistItem[];
    images?: string[];
    categories: Category[];
    pinned: boolean;
    createdAt: number;
    updatedAt: number;
}

export type Category = 'Personal' | 'Work' | 'Ideas' | 'Urgent' | 'Health' | 'Misc';

export const CATEGORIES: Category[] = ['Personal', 'Work', 'Ideas', 'Urgent', 'Health', 'Misc'];

