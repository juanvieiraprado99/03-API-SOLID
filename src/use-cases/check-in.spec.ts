import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error.js";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(gymsRepository, checkInsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "A gym for JavaScript enthusiasts.",
      phone: "",
      latitude: -23.5476186,
      longitude: -47.180781,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    const gym = await gymsRepository.create({
      title: "JavaScript Gym",
      description: "A gym for JavaScript enthusiasts.",
      phone: "",
      latitude: new Decimal(-23.5476186),
      longitude: new Decimal(-47.180781),
    });

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: "user-01",
      userLatitude: -23.5476186,
      userLongitude: -47.180781,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5476186,
      userLongitude: -47.180781,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.5476186,
        userLongitude: -47.180781,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("Should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5476186,
      userLongitude: -47.180781,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.5476186,
      userLongitude: -47.180781,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on distant gym", async () => {
    const gym = await gymsRepository.create({
      title: "gym-02",
      description: "A gym for JavaScript enthusiasts.",
      phone: "",
      latitude: new Decimal(-23.5476186),
      longitude: new Decimal(-47.180781),
    });

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: "user-01",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
