import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import argon2 from "argon2";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { GetUserProfileUseCase } from "./get-user-profile.js";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("Should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await argon2.hash("123456"),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("Should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existent-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
