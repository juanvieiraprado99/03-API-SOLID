import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym.js";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("Should be able to register", async () => {
    const { gym } = await sut.execute({
      title: "Academia zika",
      description: null,
      phone: null,
      latitude: 12.34,
      longitude: 56.78,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
