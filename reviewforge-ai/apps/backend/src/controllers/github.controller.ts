import { Request, Response, NextFunction, CookieOptions } from "express";
import { GitHubService } from "../services/github.service";

export class GitHubController {
  constructor(private readonly githubservice: GitHubService) {}

  connect = (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = this.githubservice.generateState();

      const COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
      };

      res.cookie("github_oath_state", state, COOKIE_OPTIONS);
      res.cookie("github_oauth_user", req.user?.id, COOKIE_OPTIONS);

      const authorizationUrl = this.githubservice.getAuthorizationURL(state);

      res.redirect(authorizationUrl);
    } catch (error) {
      next(error);
    }
  };

  callback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query;
      if (typeof code !== "string" || typeof state !== "string") {
        return res.status(400).json({ message: "Missing OAuth code or state" });
      }

      const savedState = req.cookies.github_oath_state;
      if (!savedState || savedState !== state) {
        return res.status(403).json({ message: "Invalid OAuth State" });
      }

      const userId = req.cookies.github_oauth_user;
      if (!userId) {
        return res.status(401).json({
          message: "GitHub OAuth user not found",
        });
      }

      const accessToken = await this.githubservice.exchangeCodeForToken(code);

      const githubUser =
        await this.githubservice.getAuthenticatedUser(accessToken);

      await this.githubservice.saveConnection({
        githubUserId: githubUser.id.toString(),
        username: githubUser.login,
        accessToken,
        userId,
      });

      res.clearCookie("github_oauth_state");
      res.clearCookie("github_oauth_user");

      return res.json({ message: "GitHub connected successfully", githubUser });
    } catch (error) {
      next(error);
    }
  };
}
