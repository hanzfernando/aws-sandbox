export interface NoteRaw {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface NoteDto {
	id: number;
	title: string;
	content: string;
	userId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateNoteRequestDto {
	title: string;
	content: string;
}

export interface UpdateNoteRequestDto {
	title?: string;
	content?: string;
}

export interface NoteResponseDto {
	note: NoteDto;
}

export interface NoteListResponseDto {
	notes: NoteDto[];
}

export interface DeleteNoteResponseDto {
	success: boolean;
}
