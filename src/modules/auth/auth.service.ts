import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { AuthUserDto, LoginRequestDto, LoginResponseDto, LogoutResponseDto, SignupRequestDto, SignupResponseDto, User } from "./auth.type";
import AuthRepository from "./auth.repository";
import { generateToken } from "../../core/utils/auth-helper";
import { config } from "../../config/env.config";
import { AppError } from "../../core/utils/error";

export class AuthService {
	constructor(private readonly repo: AuthRepository) {}

	private toAuthUser(user: User): AuthUserDto {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}

  async signup(payload: SignupRequestDto, res: Response): Promise<SignupResponseDto> {
    const existingUser = await this.repo.findUserByEmail(payload.email);
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await this.repo.createUser(payload.name, payload.email, hashedPassword);
    const authUser = this.toAuthUser(newUser);
    const token = generateToken(authUser.id, res);
    return { user: authUser, token };
  }
  
	async login(payload: LoginRequestDto, res: Response): Promise<LoginResponseDto> {
		const user = await this.repo.findUserByEmail(payload.email);
		if (!user) {
			throw new AppError("Invalid email or password", 400);
		}
		const isValid = await bcrypt.compare(payload.password, user.password);
		if (!isValid) {
			throw new AppError("Invalid email or password", 400);
		}
		const authUser = this.toAuthUser(user);
    const token = generateToken(authUser.id, res);
		return { user: authUser, token };
	}

	async logout(res: Response): Promise<LogoutResponseDto> {
		res.clearCookie(config.cookie, {
			httpOnly: true,
			sameSite: config.env !== "development" ? "none" : "strict",
			secure: config.env !== "development",
			path: "/",
		});
		return { success: true };
	}

	async getProfile(token: string): Promise<AuthUserDto> {
		try {
			const payload = jwt.verify(token, config.jwt.secret) as { id: number };
			if (!payload?.id) {
				throw new AppError("Unauthorized", 401);
			}
			const user = await this.repo.findUserById(payload.id);
			if (!user) {
				throw new AppError("User not found", 404);
			}
			return this.toAuthUser(user);
		} catch (err) {
			// jsonwebtoken throws for invalid/expired tokens
			if (err instanceof AppError) throw err;
			throw new AppError("Unauthorized", 401);
		}
	}
}

export default AuthService;

