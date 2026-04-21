import type { PrismaClient } from "@prisma/client";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async updateProfilePicUrl(userId: number, profilePicUrl: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { profile_pic_url: profilePicUrl },
      select: {
        id: true,
        name: true,
        email: true,
        profile_pic_url: true,
      },
    });
  }

  async findById(userId: number) {
    return this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profile_pic_url: true,
      },
    });
  }

}