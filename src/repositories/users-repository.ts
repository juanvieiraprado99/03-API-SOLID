import { User } from "../../generated/prisma/client.js";
import { UserCreateInput } from "../../generated/prisma/models/User.js";

export interface UsersRepository {
  create(data: UserCreateInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
