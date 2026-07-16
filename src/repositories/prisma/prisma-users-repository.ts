import { User } from "../../../generated/prisma/client.js";
import { UserCreateInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../../lib/prisma.js";
import { UsersRepository } from "../users-repository.js";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async create(data: UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }
}
