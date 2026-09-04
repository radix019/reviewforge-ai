import { RepositoryStore } from "../repositories/Interfaces";
import { GitHubService } from "./github.service";

export class RepositoryService {
  constructor(
    private readonly repositoryStore: RepositoryStore,
    private readonly githubService: GitHubService,
  ) {}

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

  async importRepository(
    userId: string,
    data: { name: string; fullName: string; url: string; provider: string },
  ) {
    return this.repositoryStore.create({
      ...data,
      ownerId: userId,
    });
  }
  async getFiles(userId: string, repositoryId: string) {
    const repository = await this.repositoryStore.findById(repositoryId);
    if (!repository) {
      throw new Error("Repository not found!");
    }
    if (repository.ownerId !== userId) {
      throw new Error("Repository not found!");
    }
    return this.githubService.getRepositoryContents(
      userId,
      repository.fullName,
    );
  }
}
