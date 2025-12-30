export type RootStackParamList = {
    Home: { filterCategory?: string };
    NoteEditor: { noteId?: string };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
