import { prisma } from "../config/prisma";
import { GitHubConnectionStore } from "./Interfaces";

export class PrismaGitHubConnectionStore implements GitHubConnectionStore {
  async create(data: {
    githubUserId: string;
    username: string;
    accessToken: string;
    userId: string;
  }) {
    return prisma.gitHubConnection.create({
      data,
    });
  }

  async findByUserId(userId: string) {
    return prisma.gitHubConnection.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        githubUserId: true,
        username: true,
        userId: true,
      },
    });
  }
  async findConnectionByUserId(userId: string) {
    return prisma.gitHubConnection.findUnique({
      where: { userId },
      select: {
        id: true,
        githubUserId: true,
        username: true,
        userId: true,
        accessToken: true,
      },
    });
  }

  async findByGithubUserId(githubUserId: string) {
    return prisma.gitHubConnection.findUnique({
      where: {
        githubUserId,
      },
    });
  }
  async deleteByUserId(userId: string): Promise<void> {
    await prisma.gitHubConnection.delete({
      where: {
        userId,
      },
    });
  }
}
