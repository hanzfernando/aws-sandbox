import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../core/middleware/request-lifecycle.middleware";
import { sendResponse } from "../../core/utils/response";
import { extractToken } from "../../core/utils/auth-helper";
import { AppError } from "../../core/utils/error";
import { config } from "../../config/env.config";
import { UserService } from "./user.service";


export class UserController {
  constructor(private readonly userService: UserService) {}

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
    

  updateAvatar = asyncHandler(async (req: Request, res: Response) => {
    console.log("Update avatar called");
    const userId = this.getUserIdFromRequest(req);
    const file = req.file;
    if (!file) {
      throw new AppError("File is required", 400);
    }
    console.log("User ID:", userId);
    console.log("Received file:", file);
    const key = await this.userService.updateAvatar({ userId, file });
    console.log("Uploaded file key:", key);
    sendResponse(res, { profile_pic_url: key }, 200);
  });
}
