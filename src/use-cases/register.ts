import { UsersRepository } from "@/repositories/users-repository.js";
import argon2 from "argon2";
import { User } from "../../generated/prisma/client.js";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await argon2.hash(password, {
      type: argon2.argon2id,
      parallelism: 4,
      memoryCost: 64 * 1024,
      timeCost: 4,
    });

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
