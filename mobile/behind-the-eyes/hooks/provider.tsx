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
import { NoteDTO, NotificationMessage, PassageBody } from "@/constants/types";
import { DATE_FORMAT_OPTIONS } from "@/constants/consts";
import registerForPushNotificationsAsync from "@/utils/notificationRegister";
import IdleScreen from "@/components/IdleScreen";

interface AppContextType {
  db: SQLite.SQLiteDatabase;
  currentNote: NoteDTO;
  setCurrentNote: React.Dispatch<React.SetStateAction<NoteDTO>>;
  handleNoteSubmit: () => void;
  handleNoteUpdate: (editedNote: NoteDTO) => void;
  handleNoteDelete: (id: number) => void;
  dbVersion: number;
  bumpDBVersion: () => void;
  passage: PassageBody;
  setPassage: React.Dispatch<React.SetStateAction<PassageBody>>;
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
  const db = SQLite.useSQLiteContext(); // comes from SQLiteProvider
  const [dbVersion, setDbVersion] = useState(0);
  const bumpDBVersion = () => setDbVersion((prev) => prev + 1);
  useDrizzleStudio(db);

  const [passage, setPassage] = useState({
    translation: { identifier: "" },
    random_verse: { text: "", verse: "", book: "", chapter: "" },
  });

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const message: NotificationMessage = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

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

    const title =
      currentNote.title?.trim().length > 0
        ? currentNote.title
        : now.toLocaleTimeString();
    const formattedDate =
      currentNote.date instanceof Date
        ? currentNote.date.toLocaleDateString(undefined, {
            ...DATE_FORMAT_OPTIONS,
            hour: "numeric",
          })
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
      if (formattedDate.trim()) {
        const now = Date.now();
        const triggerDate = new Date(formattedDate);
        const safeDate =
          triggerDate.getTime() <= now ? new Date(now + 5000) : triggerDate;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title,
            body: currentNote.content,
            data: { id: currentNote.note_id },
            sound: "default",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: safeDate,
          },
        });
      }
    } catch (e: unknown) {
      alert((e as Error)?.message);
      throw e;
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
      const formattedDate =
        editedNote.date instanceof Date ? editedNote.date.toDateString() : "";

      await statement.executeAsync([
        editedNote.title,
        editedNote.content,
        editedNote.word_count,
        formattedDate,
        editedNote.note_id!,
      ]);
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
