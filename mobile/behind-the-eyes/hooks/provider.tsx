import React, {
  createContext,
  Suspense,
  useContext,
  useMemo,
  useState,
} from "react";
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { NoteDTO } from "@/constants/types";
import LoadingScreen from "@/components/LoadingScreen";

interface AppContextType {
  db: SQLite.SQLiteDatabase;
  currentNote: NoteDTO;
  setCurrentNote: React.Dispatch<React.SetStateAction<NoteDTO>>;
  ID_TRACKER: number;
}

const AppContext = createContext<AppContextType | null>(null);

// Inner component that actually uses the DB
const AppProviderInner = ({ children }: { children: React.ReactNode }) => {
  const db = SQLite.useSQLiteContext(); // comes from SQLiteProvider
  useDrizzleStudio(db);
  console.log(db.databasePath);

  const [currentNote, setCurrentNote] = useState<NoteDTO>({
    title: "",
    content: "",
    createdAt: undefined,
    word_count: 0,
  });

  const ID_TRACKER = useMemo(() => {
    const rows = db.getAllSync(`SELECT * FROM journal_entries`);
    return rows?.length ?? 0;
  }, [db]);

  const contextValue = {
    db,
    currentNote,
    setCurrentNote,
    ID_TRACKER,
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
          note_id INTEGER PRIMARY KEY,
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
