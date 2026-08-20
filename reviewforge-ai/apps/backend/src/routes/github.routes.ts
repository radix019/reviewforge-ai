import { Router } from "express";
import { GitHubController } from "../controllers/github.controller";
import { GitHubService } from "../services/github.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { PrismaGitHubConnectionStore } from "../repositories/prisma-github-connection.store";

const router = Router();
const githubConnectionStore = new PrismaGitHubConnectionStore();
const githubservice = new GitHubService(githubConnectionStore);
const gitHubController = new GitHubController(githubservice);

router.get("/connect", authMiddleware, gitHubController.connect);
router.get("/callback", gitHubController.callback);
router.get("/connection", authMiddleware, gitHubController.getConnection);

export default router;
