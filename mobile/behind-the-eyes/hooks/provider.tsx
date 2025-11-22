import React, { createContext, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

interface AppContextType {
  openModal?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const db = SQLite.openDatabaseSync("bte.db");
const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useDrizzleStudio(db);

  useEffect(() => {
    initDB();
  }, []);

  async function initDB() {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS journal_entries (
	note_id INTEGER PRIMARY KEY,
   	date TEXT NOT NULL,
	title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0);
      `);
  }

  return (
    <SQLite.SQLiteProvider
      databaseName="bte.db"
      useSuspense
      directory="../assets"
    >
      <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
    </SQLite.SQLiteProvider>
  );
};

export const useAppProvider = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within a provider");
  }
  return context;
};
