import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";
import { Decimal } from "@prisma/client/runtime/client";
import { randomUUID } from "node:crypto";
import { Gym } from "../../../generated/prisma/client.js";
import { GymCreateManyInput } from "../../../generated/prisma/models.js";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository.js";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.userLatitude, longitude: params.userLongitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      );
      const isWithin10km = distance <= 10;

      return isWithin10km;
    });
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: GymCreateManyInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    };
    this.items.push(gym);
    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }
}
