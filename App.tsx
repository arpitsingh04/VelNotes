import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotesProvider } from './src/store/NotesContext';
import { ThemeProvider, useTheme } from './src/store/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NotesProvider>
            <AppContent />
          </NotesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
