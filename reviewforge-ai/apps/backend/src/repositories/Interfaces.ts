import { User } from "@prisma/client";
import { GitHubConnection, Repository } from "../generated/prisma/client";
export interface IUserRespository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User>;
}

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

export interface GitHubConnectionStore {
  create(data: {
    githubUserId: string;
    username: string;
    accessToken: string;
    userId: string;
  }): Promise<GitHubConnection>;

  findByUserId(userId: string): Promise<GitHubConnection | null>;

  findByGithubUserId(githubUserId: string): Promise<GitHubConnection | null>;
}
