import { RepositoryStore } from "../repositories/Interfaces";

export class RepositoryService {
  constructor(private readonly repositoryStore: RepositoryStore) {}

  async createRepository(data: {
    name: string;
    fullName: string;
    url: string;
    provider: string;
    ownerId: string;
  }) {
    return this.repositoryStore.create(data);
  }

  async getRepositories(ownerId: string) {
    return this.repositoryStore.findByOwnerId(ownerId);
  }

  async getRepository(id: string, ownerId: string) {
    const repository = await this.repositoryStore.findById(id);

    if (!repository || repository.ownerId !== ownerId) {
      throw new Error("Repository not found");
    }

    return repository;
  }

  async deleteRepository(id: string, ownerId: string) {
    const repository = await this.repositoryStore.findById(id);

    if (!repository || repository.ownerId !== ownerId) {
      throw new Error("Repository not found");
    }

    return this.repositoryStore.delete(id);
  }
}
