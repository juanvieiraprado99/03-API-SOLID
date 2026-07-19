import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms.js";

let GymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    GymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(GymsRepository);
  });

  it("Should be able to search for gyms", async () => {
    await GymsRepository.create({
      title: "Gym 01",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await GymsRepository.create({
      title: "Gym 02",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    const { gyms } = await sut.execute({
      query: "Gym 02",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym 02" })]);
  });

  it("Should be able to search for gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      await GymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
