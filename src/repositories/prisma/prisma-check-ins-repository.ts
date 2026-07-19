import dayjs from "dayjs";
import { CheckIn } from "../../../generated/prisma/client.js";
import { CheckInUncheckedCreateInput } from "../../../generated/prisma/models/CheckIn.js";
import { prisma } from "../../../lib/prisma.js";
import { CheckInsRepository } from "../check-ins-repository.js";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });
    return checkIn;
  }
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date").toDate();
    const endOfTheDay = dayjs(date).endOf("date").toDate();

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });

    return checkIn;
  }
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });
    return checkIns;
  }
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });
    return checkIn;
  }
  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });
    return count;
  }
  async save(data: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });
    return updatedCheckIn;
  }
}
