import type { PrismaClient } from "@prisma/client";
import NoteRepository from "./note.repository";
import NoteService from "./note.service";
import NoteController from "./note.controller";
import NoteRoutes from "./note.route";

export class NoteContainer {
	public readonly repository: NoteRepository;
	public readonly service: NoteService;
	public readonly controller: NoteController;
	public readonly routes: NoteRoutes;

	constructor(prisma: PrismaClient) {
		this.repository = new NoteRepository(prisma);
		this.service = new NoteService(this.repository);
		this.controller = new NoteController(this.service);
		this.routes = new NoteRoutes(this.controller);
	}
}

export default NoteContainer;
