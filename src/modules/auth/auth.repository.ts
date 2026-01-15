import type { PrismaClient } from "@prisma/client";

export class AuthRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findUserByEmail(email: string) {
		return this.prisma.users.findUnique({
			where: { email },
			select: {
				id: true,
				name: true,
				email: true,
        password: true,
			},
		});
	}

	async findUserById(id: number) {
		return this.prisma.users.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
	}
}

export default AuthRepository;

