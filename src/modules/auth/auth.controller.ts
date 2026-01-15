import { Request, Response } from "express";
import { LoginRequestDto, SignupRequestDto } from "./auth.type";
import { asyncHandler } from "../../core/middleware/request-lifecycle.middleware";
import { sendResponse } from "../../core/utils/response";
import AuthService from "./auth.service";
import { extractToken } from "../../core/utils/auth-helper";
import { AppError } from "../../core/utils/error";

export class AuthController {
	constructor(private readonly service: AuthService) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as SignupRequestDto;
    const result = await this.service.signup(payload, res);
    sendResponse(res, result, 201);
  });

	login = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as LoginRequestDto;
    const result = await this.service.login(payload, res);
    sendResponse(res, result, 200);
	});

	logout = asyncHandler(async (_req: Request, res: Response) => {
		const result = await this.service.logout(res);
		sendResponse(res, result, 200);
	});

	getProfile = asyncHandler(async (req: Request, res: Response) => {
		const token = extractToken(req);
		if (!token) {
      console.log("No token found in request");
			throw new AppError("Unauthorized", 401);
		}
		const user = await this.service.getProfile(token);
		sendResponse(res, { user }, 200);
	});
}

export default AuthController;

