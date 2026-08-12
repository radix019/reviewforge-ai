import { Repository } from "../generated/prisma";

export interface RepositoryStore {
  create(data: {
    name: string;
    fullName: string;
    url: string;
    provider: string;
    ownerId: string;
  }): Promise<Repository>;

  findByOwnerId(ownerId: string): Promise<Repository[]>;

  findById(id: string): Promise<Repository | null>;

  delete(id: string): Promise<Repository>;
}
