import { RepositoryStore } from '../repositories/Interfaces';
import { GitHubService } from './github.service';

export class RepositoryService {
  constructor(
    private readonly repositoryStore: RepositoryStore,
    private readonly githubService: GitHubService
  ) {}

  private async getOwnedRepository(userId: string, repositoryId: string) {
    const repository = await this.repositoryStore.findById(repositoryId);

    if (!repository || repository.ownerId !== userId) throw new Error('Repository not found!');

    return repository;
  }
  async createRepository(data: { name: string; fullName: string; url: string; provider: string; ownerId: string }) {
    return this.repositoryStore.create(data);
  }

  async getRepositories(ownerId: string) {
    return this.repositoryStore.findByOwnerId(ownerId);
  }

  async getRepository(id: string, ownerId: string) {
    const repository = await this.repositoryStore.findById(id);

    if (!repository || repository.ownerId !== ownerId) {
      throw new Error('Repository not found');
    }

    return repository;
  }

  async deleteRepository(id: string, ownerId: string) {
    const repository = await this.repositoryStore.findById(id);

    if (!repository || repository.ownerId !== ownerId) {
      throw new Error('Repository not found');
    }

    return this.repositoryStore.delete(id);
  }

  async importRepository(userId: string, data: { name: string; fullName: string; url: string; provider: string }) {
    return this.repositoryStore.create({
      ...data,
      ownerId: userId,
    });
  }
  async getFiles(userId: string, repositoryId: string, path = '') {
    const repository = await this.getOwnedRepository(userId, repositoryId);
    console.log('repository', repository);
    return this.githubService.getRepositoryContents(userId, repository.fullName, path);
  }
  async getFileContent(userId: string, repositoryId: string, path: string) {
    const repository = await this.getOwnedRepository(userId, repositoryId);
    return this.githubService.getFileContent(userId, repository.fullName, path);
  }
}
