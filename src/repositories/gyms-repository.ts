import { Gym } from "../../generated/prisma/client.js";
import { GymCreateInput } from "../../generated/prisma/models.js";

export interface FindManyNearbyParams {
  userLatitude: number;
  userLongitude: number;
}
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  create(data: GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
