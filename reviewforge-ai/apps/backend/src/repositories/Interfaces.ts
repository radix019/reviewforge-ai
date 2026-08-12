import { User } from "@prisma/client";

export interface IUserRespository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User>;
}
