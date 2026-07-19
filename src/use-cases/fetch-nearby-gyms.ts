import { GymsRepository } from "@/repositories/gyms-repository.js";
import { Gym } from "../../generated/prisma/client.js";

interface FetchNearByGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearByGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      userLatitude: userLatitude,
      userLongitude: userLongitude,
    });

    return { gyms };
  }
}
