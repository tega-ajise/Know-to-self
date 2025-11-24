export interface NoteDTO {
  note_id?: number;
  title: string;
  content: string;
  created_at: Date | string | undefined;
  date?: Date | string;
  word_count: number;
}
