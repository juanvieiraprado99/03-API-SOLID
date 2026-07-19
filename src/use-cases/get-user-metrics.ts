import { CheckInsRepository } from "@/repositories/check-ins-repository.js";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInCount = await this.checkInsRepository.countByUserId(userId);

    return { checkInCount };
  }
}
