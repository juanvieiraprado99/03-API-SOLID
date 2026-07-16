import { CheckIn } from "../../generated/prisma/client.js";
import { CheckInUncheckedCreateInput } from "../../generated/prisma/models.js";

export interface CheckInsRepository {
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
