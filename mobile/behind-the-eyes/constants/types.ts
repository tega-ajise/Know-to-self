export interface NoteDTO {
  title: string;
  content: string;
  createdAt: Date | undefined;
  date?: Date;
  word_count: number;
}
