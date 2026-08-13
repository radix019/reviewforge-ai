import crypto from "crypto";
import { env } from "../config/env";

export class GitHubService {
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
}
