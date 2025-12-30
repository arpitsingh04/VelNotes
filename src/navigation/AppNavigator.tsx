import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { HomeScreen, NoteEditorScreen } from '../screens';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
        </Stack.Navigator>
    );
};
