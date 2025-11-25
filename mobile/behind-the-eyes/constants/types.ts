export interface NoteDTO {
  note_id?: number;
  title: string;
  content: string;
  created_at: Date | string | undefined;
  date?: Date | string;
  word_count: number;
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
