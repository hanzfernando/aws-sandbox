import type { PrismaClient } from "../../../generated/prisma/client";

import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRoutes } from "./user.route";
import { S3Storage } from "./storage/s3.storage";

export class UserContainer {
  public readonly repository: UserRepository
  public readonly service: UserService
  public readonly controller: UserController
  public readonly routes: UserRoutes
  constructor(prisma: PrismaClient) {
    this.repository = new UserRepository(prisma)
    const storage = new S3Storage()
    this.service = new UserService(this.repository, storage)
    this.controller = new UserController(this.service)
    this.routes = new UserRoutes(this.controller)
  }
}

export default UserContainer;