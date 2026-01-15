import { Router } from "express";
import prisma from "./config/database.config";
import AuthContainer from "./modules/auth/auth.container";

/**
 * Main route configuration class that organizes all API endpoints
 * Provides centralized routing with authentication middleware
 */
export class AppRoutes {
	private router: Router;
	private authContainer: AuthContainer;

	constructor() {
		this.router = Router();
		this.authContainer = new AuthContainer(prisma);
	
		this.initializeRoutes();
	}

	/**
	 * Sets up all API routes with appropriate middleware
	 * Auth routes are public, others can be added with protection
	 */
	private initializeRoutes(): void {
		this.router.use("/auth", this.authContainer.routes.getRouter());
	}

	/**
	 * Returns the configured Express router
	 */
	public getRouter(): Router {
		return this.router;
	}
}

export default AppRoutes;
