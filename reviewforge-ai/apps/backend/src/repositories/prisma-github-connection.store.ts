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
    });
  }

  async findByGithubUserId(githubUserId: string) {
    return prisma.gitHubConnection.findUnique({
      where: {
        githubUserId,
      },
    });
  }
}
