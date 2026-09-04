import crypto from "crypto";
import { env } from "../config/env";
import { GitHubConnectionStore } from "../repositories/Interfaces";
import { decrypt, encrypt } from "../utils/encryption";

export class GitHubService {
  constructor(private readonly githubConnectionStore: GitHubConnectionStore) {}

  async saveConnection(data: {
    githubUserId: string;
    username: string;
    accessToken: string;
    userId: string;
  }) {
    const existingConnection =
      await this.githubConnectionStore.findByGithubUserId(data.githubUserId);
    if (existingConnection) {
      throw new Error("This GitHub account is already connected");
    }
    const encryptedToken = encrypt(data.accessToken);

    return this.githubConnectionStore.create({
      githubUserId: data.githubUserId,
      username: data.username,
      accessToken: encryptedToken,
      userId: data.userId,
    });
  }

  generateState() {
    return crypto.randomBytes(32).toString("hex");
  }

  getAuthorizationURL(state: string) {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: env.GITHUB_CALLBACK_URL,
      scope: "repo read:user user:email",
      state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to exchange GitHub authorization code");
    }
    const data = await response.json();

    if (!data.access_token) {
      throw new Error("GitHub did not return an access token");
    }
    return data.access_token;
  }

  async getAuthenticatedUser(accessToken: string) {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!response.ok) {
      throw new Error("Faild to fetch Github user");
    }
    return response.json();
  }
  async getConnection(userId: string) {
    return this.githubConnectionStore.findByUserId(userId);
  }
  async disconnect(userId: string) {
    await this.githubConnectionStore.deleteByUserId(userId);
  }
  async getRepositories(userId: string) {
    const connection =
      await this.githubConnectionStore.findConnectionByUserId(userId);
    if (!connection) {
      throw new Error("GitHub account not connected!");
    }
    const accessToken = decrypt(connection.accessToken);
    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch GitHub Repositories");
    }
    const repositories = await response.json();

    return repositories.map((repo: any) => ({
      githubId: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      private: repo.private,
      defaultBranch: repo.default_branch,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));
  }
  async getRepositoryContents(userId: string, fullName: string, path = "") {
    const connection =
      await this.githubConnectionStore.findConnectionByUserId(userId);
    if (!connection) {
      throw new Error("GitHub account not connected");
    }
    const accessToken = decrypt(connection.accessToken);
    const response = await fetch(
      `https://api.github.com/repos/${fullName}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch repository contents");
    }
    const data = await response.json();
    return Array.isArray(data)
      ? data.map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          sha: item.sha,
        }))
      : data;
  }
}
