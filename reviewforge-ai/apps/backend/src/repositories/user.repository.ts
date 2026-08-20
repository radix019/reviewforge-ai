import { User } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IUserRespository } from "./Interfaces";

export class UserRepository implements IUserRespository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({
      data,
    });
  }
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}

export class FakeUserRespository implements IUserRespository {
  async findByEmail(email: string) {
    return null;
  }
  async create(data: any) {
    return {
      id: "1",
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }
  async findById(id: string): Promise<User | null> {
    return null;
  }
}
