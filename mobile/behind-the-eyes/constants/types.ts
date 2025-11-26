export interface CreateNote {
  title: string;
  content: string;
  date?: Date;
  word_count: number;
}

export interface NoteTableEntry extends Omit<CreateNote, "date"> {
  note_id: number;
  created_at: string;
  date: Date | string;
}

export interface NotificationMessage {
  to: string;
  sound: "default";
  title: string;
  body: string;
  data: object;
}

export interface PassageBody {
  translation: {
    identifier: string;
  };
  random_verse: {
    text: string;
    book: string;
    chapter: string;
    verse: string;
  };
}
