import React, { createContext, Suspense, useContext, useState } from "react";
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { NoteDTO } from "@/constants/types";
import LoadingScreen from "@/components/LoadingScreen";
import { DATE_FORMAT_OPTIONS } from "@/constants/consts";

interface AppContextType {
  db: SQLite.SQLiteDatabase;
  currentNote: NoteDTO;
  setCurrentNote: React.Dispatch<React.SetStateAction<NoteDTO>>;
  handleNoteSubmit: () => void;
  handleNoteUpdate: (editedNote: NoteDTO) => void;
  handleNoteDelete: (id: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Inner component that actually uses the DB
const AppProviderInner = ({ children }: { children: React.ReactNode }) => {
  const db = SQLite.useSQLiteContext(); // comes from SQLiteProvider
  useDrizzleStudio(db);

  const [currentNote, setCurrentNote] = useState<NoteDTO>({
    title: "",
    content: "",
    created_at: undefined,
    word_count: 0,
  });

  const handleNoteSubmit = async () => {
    if (!currentNote.content?.trim()) {
      return alert("No note content!");
    }
    const now = new Date();

    const title = currentNote.title?.trim() ?? now.toLocaleDateString();
    const formattedDate =
      currentNote.date instanceof Date
        ? currentNote.date.toLocaleDateString(undefined, DATE_FORMAT_OPTIONS)
        : "";

    const createdAt = now?.toLocaleDateString(undefined, DATE_FORMAT_OPTIONS);

    const statement = await db.prepareAsync(
      `INSERT INTO journal_entries(date, title, content, created_at, word_count) VALUES (?,?,?,?,?)`
    );

    try {
      const values = [
        formattedDate,
        title,
        currentNote.content,
        createdAt,
        currentNote.word_count,
      ];
      const { lastInsertRowId } = await statement.executeAsync(values);
      console.log({ lastInsertRowId });
    } catch (e: unknown) {
      alert((e as Error)?.message);
    } finally {
      setCurrentNote({
        content: "",
        title: "",
        created_at: undefined,
        word_count: 0,
      });
      await statement.finalizeAsync();
    }
  };

  const handleNoteUpdate = async (editedNote: NoteDTO) => {
    if (!editedNote.content?.trim() || !editedNote.title?.trim()) {
      return alert("Values for one or more fields missing!");
    }

    const statement = await db.prepareAsync(
      `UPDATE journal_entries SET title = ?, content = ?, word_count = ?, date = ? WHERE note_id = ?`
    );
    try {
      const formattedDate = (editedNote.date as Date).toLocaleDateString(
        undefined,
        DATE_FORMAT_OPTIONS
      );

      await statement.executeAsync([
        editedNote.title,
        editedNote.content,
        editedNote.word_count,
        formattedDate,
        editedNote.note_id!,
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      await statement.finalizeAsync();
    }
  };

  const handleNoteDelete = async (id: number) => {
    const statement = await db.prepareAsync(
      "DELETE FROM journal_entries WHERE note_id = ?"
    );
    try {
      await statement.executeAsync([id]);
    } catch (e) {
      alert("Unable to delete note");
      console.error(e);
    } finally {
      await statement.finalizeAsync();
    }
  };

  const contextValue = {
    db,
    currentNote,
    setCurrentNote,
    handleNoteSubmit,
    handleNoteUpdate,
    handleNoteDelete,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const initDBIfNeeded = async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS journal_entries (
          note_id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT,
          title TEXT NOT NULL UNIQUE,
          content TEXT NOT NULL,
          word_count INTEGER DEFAULT 0,
          created_at TEXT NOT NULL
        );
      `);
  };
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SQLite.SQLiteProvider
        databaseName="bte.db"
        useSuspense
        onInit={initDBIfNeeded}
      >
        <AppProviderInner>{children}</AppProviderInner>
      </SQLite.SQLiteProvider>
    </Suspense>
  );
};

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within a provider");
  }
  return context;
};
