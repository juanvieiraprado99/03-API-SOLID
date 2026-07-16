import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import argon2 from "argon2";
import { beforeEach, describe, expect, it } from "vitest";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";
import { RegisterUseCase } from "./register.js";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("Should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("Should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await argon2.verify(
      user.password_hash,
      "123456",
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Should not be able to register with same email twice", async () => {
    const email = "john.doe@example.com";

    await sut.execute({
      name: "John Doe",
      email: email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email: email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
