import { AppError } from "../../core/utils/error";
import NoteRepository from "./note.repository";
import {
	CreateNoteRequestDto,
	DeleteNoteResponseDto,
	NoteDto,
	NoteListResponseDto,
	NoteRaw,
	NoteResponseDto,
	UpdateNoteRequestDto,
} from "./note.type";

export class NoteService {
	constructor(private readonly repo: NoteRepository) {}

	private toNoteDto(note: NoteRaw): NoteDto {
		return {
			id: note.id,
      title: note.title,
      content: note.content,
      userId: note.user_id,
			createdAt: note.created_at,
			updatedAt: note.updated_at,
		};
  }
	async createNote(userId: number, payload: CreateNoteRequestDto): Promise<NoteResponseDto> {
		const note = await this.repo.createNote(userId, payload.title, payload.content);
		return { note: this.toNoteDto(note as NoteRaw) };
  }


	async getNotes(userId: number): Promise<NoteListResponseDto> {
		const notes = await this.repo.getNotesByUser(userId);
		return { notes: (notes as NoteRaw[]).map((n) => this.toNoteDto(n)) };
  }

	async getNoteById(userId: number, id: number): Promise<NoteResponseDto> {
		const note = await this.repo.getNoteById(id);
		if (!note || note.user_id !== userId) {
			throw new AppError("Note not found", 404);
		}
		return { note: this.toNoteDto(note as NoteRaw) };
  }
	async updateNote(userId: number, id: number, payload: UpdateNoteRequestDto): Promise<NoteResponseDto> {
		const existing = await this.repo.getNoteById(id);
		if (!existing || existing.user_id !== userId) {
			throw new AppError("Note not found", 404);
		}

    const data: { title?: string; content?: string } = {};
    if (typeof payload.title === "string") data.title = payload.title;
    if (typeof payload.content === "string") data.content = payload.content;
    const updated = await this.repo.updateNote(id, data);
    return { note: this.toNoteDto(updated as NoteRaw) };
  }
	async deleteNote(userId: number, id: number): Promise<DeleteNoteResponseDto> {
		const existing = await this.repo.getNoteById(id);
		if (!existing || existing.user_id !== userId) {
			throw new AppError("Note not found", 404);
		}

		await this.repo.deleteNote(id);
		return { success: true };
	}
}

export default NoteService;
