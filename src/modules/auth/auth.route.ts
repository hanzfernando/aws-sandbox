import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRoutes {
	public readonly router: Router;

	constructor(private readonly controller: AuthController) {
		this.router = Router();
		this.bindRoutes();
	}

	private bindRoutes() {
    this.router.post("/signup", this.controller.signup);
		this.router.post("/login", this.controller.login);
		this.router.post("/logout", this.controller.logout);
		this.router.get("/check-auth", this.controller.getProfile);
	}

		// Expose router via method for consistency with class-based AppRoutes
	public getRouter(): Router {
		return this.router;
	}
}


export default AuthRoutes;

