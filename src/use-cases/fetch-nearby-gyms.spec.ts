import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearByGymsUseCase } from "./fetch-nearby-gyms.js";

let GymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    GymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(GymsRepository);
  });

  it("Should be able to fetch nearby gyms", async () => {
    await GymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await GymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
