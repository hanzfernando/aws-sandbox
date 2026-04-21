import { Router } from "express";
import { UserController } from "./user.controller";
import { uploadMiddleware } from "../../core/middleware/upload.middleware";

export class UserRoutes {
  public readonly router: Router; 

  constructor(private readonly controller: UserController) {
    this.router = Router();
    this.bindRoutes();
  }

  private bindRoutes() {
		this.router.put("/avatar", uploadMiddleware, this.controller.updateAvatar);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default UserRoutes;