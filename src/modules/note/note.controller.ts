import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import NoteService from "./note.service";
import { asyncHandler } from "../../core/middleware/request-lifecycle.middleware";
import { sendResponse } from "../../core/utils/response";
import { extractToken } from "../../core/utils/auth-helper";
import { AppError } from "../../core/utils/error";
import { CreateNoteRequestDto, UpdateNoteRequestDto } from "./note.type";
import { config } from "../../config/env.config";

export class NoteController {
	constructor(private readonly service: NoteService) {}

	private getUserIdFromRequest(req: Request): number {
		const token = extractToken(req);
		if (!token) {
			throw new AppError("Unauthorized", 401);
		}

		try {
			const payload = jwt.verify(token, config.jwt.secret) as { id: number };
			if (!payload?.id) {
				throw new AppError("Unauthorized", 401);
			}
			return payload.id;
		} catch (err) {
			if (err instanceof AppError) throw err;
			throw new AppError("Unauthorized", 401);
		}
	}

	createNote = asyncHandler(async (req: Request, res: Response) => {
		const userId = this.getUserIdFromRequest(req);
		const payload = req.body as CreateNoteRequestDto;
		const result = await this.service.createNote(userId, payload);
		sendResponse(res, result, 201);
	});

	getNotes = asyncHandler(async (req: Request, res: Response) => {
		const userId = this.getUserIdFromRequest(req);
		const result = await this.service.getNotes(userId);
		sendResponse(res, result, 200);
	});

	getNoteById = asyncHandler(async (req: Request, res: Response) => {
		const userId = this.getUserIdFromRequest(req);
		const noteId = Number(req.params.id);
		if (Number.isNaN(noteId)) {
			throw new AppError("Invalid note id", 400);
		}
		const result = await this.service.getNoteById(userId, noteId);
		sendResponse(res, result, 200);
	});

	updateNote = asyncHandler(async (req: Request, res: Response) => {
		const userId = this.getUserIdFromRequest(req);
		const noteId = Number(req.params.id);
		if (Number.isNaN(noteId)) {
			throw new AppError("Invalid note id", 400);
		}
		const payload = req.body as UpdateNoteRequestDto;
		const result = await this.service.updateNote(userId, noteId, payload);
		sendResponse(res, result, 200);
	});

	deleteNote = asyncHandler(async (req: Request, res: Response) => {
		const userId = this.getUserIdFromRequest(req);
		const noteId = Number(req.params.id);
		if (Number.isNaN(noteId)) {
			throw new AppError("Invalid note id", 400);
		}
		const result = await this.service.deleteNote(userId, noteId);
		sendResponse(res, result, 200);
	});
}

export default NoteController;
