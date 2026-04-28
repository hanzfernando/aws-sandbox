import type { PrismaClient } from "../../../generated/prisma/client";


export class NoteRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async createNote(userId: number, title: string, content: string) {
		return this.prisma.notes.create({
			data: {
				title,
				content,
				user_id: userId,
			},
			select: {
				id: true,
				title: true,
				content: true,
				user_id: true,
				created_at: true,
				updated_at: true,
			},
		});
	}

	async getNotesByUser(userId: number) {
		return this.prisma.notes.findMany({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
			select: {
				id: true,
				title: true,
				content: true,
				user_id: true,
				created_at: true,
				updated_at: true,
			},
		});
	}

	async getNoteById(id: number) {
		return this.prisma.notes.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				content: true,
				user_id: true,
				created_at: true,
				updated_at: true,
			},
		});
	}

	async updateNote(id: number, data: { title?: string; content?: string }) {
		return this.prisma.notes.update({
			where: { id },
			data,
			select: {
				id: true,
				title: true,
				content: true,
				user_id: true,
				created_at: true,
				updated_at: true,
			},
		});
	}

	async deleteNote(id: number) {
		return this.prisma.notes.delete({
			where: { id },
			select: {
				id: true,
			},
		});
	}
}

export default NoteRepository;
