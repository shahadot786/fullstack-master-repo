/**
 * Navigation Type Definitions
 * 
 * These types define the structure of our navigation system.
 * TypeScript will use these to provide autocomplete and type checking
 * for navigation props throughout the app.
 */

import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root Stack Navigator
 * This is the top-level navigator that switches between different app states
 */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainDrawerParamList>;
};

/**
 * Auth Stack Navigator
 * Handles all authentication-related screens
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email: string };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

/**
 * Main Drawer Navigator
 * The main app navigation with drawer sidebar
 */
export type MainDrawerParamList = {
  TodosStack: NavigatorScreenParams<TodoStackParamList>;
  NotesStack: NavigatorScreenParams<NotesStackParamList>;
  Settings: undefined;
};

/**
 * Todo Stack Navigator
 * Nested stack for todo-related screens
 */
export type TodoStackParamList = {
  TodoTabs: NavigatorScreenParams<TodoTabParamList>;
  TodoDetail: { todoId: string };
  CreateTodo: undefined;
  EditTodo: { todoId: string };
};

/**
 * Todo Bottom Tabs Navigator
 * Bottom tabs for different todo views
 */
export type TodoTabParamList = {
  AllTodos: undefined;
  ActiveTodos: undefined;
  CompletedTodos: undefined;
};

/**
 * Notes Stack Navigator (Demo)
 * Nested stack for notes-related screens
 */
export type NotesStackParamList = {
  NotesTabs: NavigatorScreenParams<NotesTabParamList>;
};

/**
 * Notes Bottom Tabs Navigator (Demo)
 * Bottom tabs for different note views
 */
export type NotesTabParamList = {
  AllNotes: undefined;
  FavoriteNotes: undefined;
  RecentNotes: undefined;
};

/**
 * Navigation Props Helper Types
 * These make it easier to type navigation props in components
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
