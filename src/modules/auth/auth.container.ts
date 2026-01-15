import type { PrismaClient } from "@prisma/client";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthRoutes } from "./auth.route";

export class AuthContainer {
	public readonly repository: AuthRepository;
	public readonly service: AuthService;
	public readonly controller: AuthController;
	public readonly routes: AuthRoutes;
  
	constructor(prisma: PrismaClient) {
		this.repository = new AuthRepository(prisma);
		this.service = new AuthService(this.repository);
		this.controller = new AuthController(this.service);
		this.routes = new AuthRoutes(this.controller);
	}
}

export default AuthContainer;

