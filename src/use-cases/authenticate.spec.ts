import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import argon2 from "argon2";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("Should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await argon2.hash("123456"),
    });

    const { user } = await sut.execute({
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
