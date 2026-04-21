import { Router } from "express";
import { NoteController } from "./note.controller";

export class NoteRoutes {
	public readonly router: Router;

	constructor(private readonly controller: NoteController) {
		this.router = Router();
		this.bindRoutes();
	}

	private bindRoutes() {
		this.router.post("/", this.controller.createNote);
		this.router.get("/", this.controller.getNotes);
		this.router.get("/:id", this.controller.getNoteById);
		this.router.put("/:id", this.controller.updateNote);
		this.router.delete("/:id", this.controller.deleteNote);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default NoteRoutes;
