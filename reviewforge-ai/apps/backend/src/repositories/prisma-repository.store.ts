import { prisma } from "../config/prisma";
import { RepositoryStore } from "./Interfaces";

export class PrismaRepositoryStore implements RepositoryStore {
  async create(data: {
    name: string;
    fullName: string;
    url: string;
    provider: string;
    ownerId: string;
  }) {
    return prisma.repository.create({
      data,
    });
  }

  async findByOwnerId(ownerId: string) {
    return prisma.repository.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.repository.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    return prisma.repository.delete({
      where: {
        id,
      },
    });
  }
}
