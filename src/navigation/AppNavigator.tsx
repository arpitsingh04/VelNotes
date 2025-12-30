import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { HomeScreen, NoteEditorScreen } from '../screens';
import { useTheme } from '../store/ThemeContext';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const { theme } = useTheme();
    const colors = COLORS[theme];

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
        </Stack.Navigator>
    );
};
