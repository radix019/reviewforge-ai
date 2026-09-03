import { Router } from "express";
import { GitHubController } from "../controllers/github.controller";
import { GitHubService } from "../services/github.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { PrismaGitHubConnectionStore } from "../repositories/prisma-github-connection.store";
import { RepositoryService } from "../services/repository.service";
import { RepositoryController } from "../controllers/repository.controller";
import { PrismaRepositoryStore } from "../repositories/prisma-repository.store";

const router = Router();
const githubConnectionStore = new PrismaGitHubConnectionStore();
const githubservice = new GitHubService(githubConnectionStore);
const gitHubController = new GitHubController(githubservice);
const repositoryStore = new PrismaRepositoryStore();
const repositoryService = new RepositoryService(repositoryStore);
const repositoryController = new RepositoryController(repositoryService);

router.delete("/connection", authMiddleware, gitHubController.disconnect);
router.get("/connect", authMiddleware, gitHubController.connect);
router.get("/callback", gitHubController.callback);
router.get("/connection", authMiddleware, gitHubController.getConnection);
router.get("/repositories", authMiddleware, gitHubController.getRepositories);
router.post(
  "/repositories",
  authMiddleware,
  repositoryController.importRepository,
);
export default router;
