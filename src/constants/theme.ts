export const COLORS = {
    light: {
        primary: '#6366f1', // Indigo
        primaryGradient: ['#6366f1', '#a855f7'],
        secondary: '#94a3b8',
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceSubtle: '#f1f5f9',
        text: '#0f172a',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        error: '#ef4444',
        success: '#10b981',
        pinned: '#f59e0b',
        category: {
            Personal: '#3b82f6',
            Work: '#8b5cf6',
            Ideas: '#ec4899',
            Urgent: '#f43f5e',
            Health: '#10b981',
            Misc: '#64748b',
        },
        shadow: '#000000',
        glass: 'rgba(255, 255, 255, 0.7)',
    },
    dark: {
        primary: '#818cf8', // Lighter Indigo
        primaryGradient: ['#818cf8', '#c084fc'],
        secondary: '#64748b',
        background: '#020617', // Very Dark Blue
        surface: '#0f172a',
        surfaceSubtle: '#1e293b',
        text: '#f8fafc',
        textSecondary: '#94a3b8',
        border: '#1e293b',
        error: '#f87171',
        success: '#34d399',
        pinned: '#fbbf24',
        category: {
            Personal: '#60a5fa',
            Work: '#a78bfa',
            Ideas: '#f472b6',
            Urgent: '#fb7185',
            Health: '#34d399',
            Misc: '#94a3b8',
        },
        shadow: '#000000',
        glass: 'rgba(15, 23, 42, 0.7)',
    },
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BORDER_RADIUS = {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    round: 999,
};

export const SHADOWS = {
    light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    dark: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    }
};
