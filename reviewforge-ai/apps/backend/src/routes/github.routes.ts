import { Router } from "express";
import { GitHubController } from "../controllers/github.controller";
import { GitHubService } from "../services/github.service";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const githubservice = new GitHubService();
const gitHubController = new GitHubController(githubservice);

router.get("/connect", authMiddleware, gitHubController.connect);
router.get("/callback", gitHubController.callback);

export default router;
