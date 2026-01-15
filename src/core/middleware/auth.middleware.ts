import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../config/database.config";
import { AppError } from "../utils/error";
import { extractToken } from "../utils/auth-helper";
import { config } from "../../config/env.config";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError("Unauthorized", 401);

    const payload = jwt.verify(token, config.jwt.secret) as { id: number };
    if (!payload?.id) throw new AppError("Unauthorized", 401);

    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true },
    });
    if (!user) throw new AppError("Unauthorized", 401);

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError("Unauthorized", 401));
  }
};

