import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SQLite from "expo-sqlite";
import * as Notifications from "expo-notifications";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { CreateNote, PassageBody, NoteTableEntry } from "@/constants/types";
import IdleScreen from "@/components/IdleScreen";
import fetchBiblePassage from "./useBiblePassages";
import { useRouter } from "expo-router";

interface AppContextType {
  db: SQLite.SQLiteDatabase;
  currentNote: CreateNote;
  setCurrentNote: React.Dispatch<React.SetStateAction<CreateNote>>;
  handleNoteSubmit: () => void;
  handleNoteUpdate: (editedNote: NoteTableEntry) => void;
  handleNoteDelete: (id: number) => void;
  dbVersion: number;
  bumpDBVersion: () => void;
  passage: PassageBody | undefined;
  setPassage: React.Dispatch<React.SetStateAction<PassageBody | undefined>>;
  notification: Notifications.Notification | undefined;
  setNotification: React.Dispatch<
    React.SetStateAction<Notifications.Notification | undefined>
  >;
}

const AppContext = createContext<AppContextType | null>(null);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Inner component that actually uses the DB
const AppProviderInner = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const db = SQLite.useSQLiteContext(); // comes from SQLiteProvider
  useDrizzleStudio(db);

  const [dbVersion, setDbVersion] = useState(0);
  const bumpDBVersion = () => setDbVersion((prev) => prev + 1);

  const [passage, setPassage] = useState<PassageBody | undefined>({
    translation: { identifier: "" },
    random_verse: { text: "", verse: "", book: "", chapter: "" },
  });

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const [currentNote, setCurrentNote] = useState<CreateNote>({
    title: "",
    content: "",
    word_count: 0,
  });

  useEffect(() => {
    // 2. Foreground delivery (notification arrives while app is open)
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // 3. Background → foreground via tap
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped");
        const tappedNotification = response.notification;
        setNotification(tappedNotification);

        const url = tappedNotification.request.content.data?.url;

        if (url) {
          router.replace(url);
        }
      });

    // 4. Other startup logic
    const loadData = async () => {
      const psg = await fetchBiblePassage();
      setPassage(psg);
    };
    // Handle cold start (if app opened from a killed state via notification)
    const loadNotification = async () => {
      const lastResponse =
        await Notifications.getLastNotificationResponseAsync();

      if (lastResponse) {
        const tappedNotification = lastResponse.notification;
        setNotification(tappedNotification);

        const url = tappedNotification.request.content.data?.url;

        if (url) {
          router.replace(url);
        }
      }
    };

    loadData();
    loadNotification();

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [router]);

  const handleNoteSubmit = async () => {
    if (!currentNote.content?.trim()) {
      return alert("No note content!");
    }
    const now = new Date();

    const title =
      currentNote.title?.trim().length > 0
        ? currentNote.title
        : now.toLocaleTimeString();

    const formattedDate = currentNote?.date?.toString() ?? "";

    const statement = await db.prepareAsync(
      `INSERT INTO journal_entries(date, title, content, created_at, word_count) VALUES (?,?,?,?,?)`
    );

    try {
      const values = [
        formattedDate,
        title,
        currentNote.content,
        now.toString(),
        currentNote.word_count,
      ];
      const { lastInsertRowId } = await statement.executeAsync(values);

      console.log({ lastInsertRowId });
      // only schedule if we have a date string
      if (currentNote.date) {
        // 1. Parse string → Date
        let triggerDate = new Date(currentNote.date);

        if (isNaN(triggerDate.getTime())) {
          console.log(
            "Invalid date string for notification:",
            currentNote.date
          );
        } else {
          // 2. If it's in the past, bump it 5 seconds into the future
          const nowMs = Date.now();
          if (triggerDate.getTime() <= nowMs) {
            triggerDate = new Date(nowMs + 5000);
          }

          console.log("Scheduling notification at:", triggerDate.toISOString());

          // 3. Schedule with a DATE trigger (TS-safe)
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body: currentNote.content,
              data: { url: "/(tabs)/kween" },
              sound: "default",
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: triggerDate,
            },
          });
        }
      }
      setCurrentNote({
        content: "",
        title: "",
        word_count: 0,
      });
    } catch (e: unknown) {
      if ((e as Error).message.includes("code 19")) {
        alert("Title already exists!");
        return;
      } else {
        throw e;
      }
    } finally {
      await statement.finalizeAsync();
    }
  };

  const handleNoteUpdate = async (editedNote: NoteTableEntry) => {
    if (!editedNote.content?.trim() || !editedNote.title?.trim()) {
      return alert("Values for one or more fields missing!");
    }

    const statement = await db.prepareAsync(
      `UPDATE journal_entries SET title = ?, content = ?, word_count = ?, date = ? WHERE note_id = ?`
    );
    try {
      const formattedDate = editedNote.date.toString() ?? "";

      await statement.executeAsync([
        editedNote.title,
        editedNote.content,
        editedNote.word_count,
        formattedDate,
        editedNote.note_id,
      ]);
      if (editedNote.date && editedNote.date instanceof Date) {
        let triggerDate = editedNote.date;
        // 2. If it's in the past, bump it 5 seconds into the future
        const nowMs = Date.now();
        if (editedNote.date.getTime() <= nowMs) {
          triggerDate = new Date(nowMs + 5000);
        }

        console.log("Scheduling notification at:", triggerDate.toISOString());

        // 3. Schedule with a DATE trigger (TS-safe)
        await Notifications.scheduleNotificationAsync({
          content: {
            title: editedNote.title,
            body: editedNote.content,
            data: { url: "/(tabs)/kween" },
            sound: "default",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });
      }
      bumpDBVersion();
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
      bumpDBVersion();
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
    dbVersion,
    bumpDBVersion,
    passage,
    setPassage,
    notification,
    setNotification,
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
    <Suspense fallback={<IdleScreen />}>
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
