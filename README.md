# VelNotes

A clean, modern, and minimal React Native notes application built with TypeScript and Expo.

## Features

- **100% Offline:** Stores all data locally using AsyncStorage.
- **Notes CRUD:** Create, read, update, and delete notes with ease.
- **Search:** Real-time search by title or description.
- **Pin Notes:** Keep important notes at the top.
- **Categories:** Organize notes with customizable categories (Work, Personal, Ideas, etc.).
- **Swipe Actions:**
  - Swipe left to delete a note.
  - Swipe right to pin/unpin a note.
- **Dark Mode:** Supports system-based dark mode and adapts seamlessly.
- **Refactoring Ready:** The storage layer is abstracted to allow easy integration of cloud sync in the future.

## Tech Stack

- **Framework:** Expo (SDK 50+)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **Storage:** @react-native-async-storage/async-storage
- **Icons:** Lucide React Native
- **Animations:** React Native Reanimated & Gesture Handler

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

## Project Structure

- `src/components`: Reusable UI components.
- `src/screens`: Main application screens (Home, Note Editor).
- `src/store`: Context-based state management and storage logic.
- `src/constants`: Theme colors and spacing constants.
- `src/types`: TypeScript interfaces and types.
- `src/utils`: Utility functions for storage and formatting.

---

*“Structure the project so it can later support cloud sync without major refactoring.”*
The project uses a clean Repository pattern in `src/utils/storage.ts` and a central state management via `NotesContext.tsx`, making it trivial to swap local storage for a cloud backend later.
