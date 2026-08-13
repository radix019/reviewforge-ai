import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import { RepositoryController } from "../controllers/repository.controller";
import { RepositoryService } from "../services/repository.service";
import { PrismaRepositoryStore } from "../repositories/prisma-repository.store";

const router = Router();

const repositoryStore = new PrismaRepositoryStore();
const repositoryService = new RepositoryService(repositoryStore);
const repositoryController = new RepositoryController(repositoryService);

router.use(authMiddleware);

router.post("/", repositoryController.create);
router.get("/", repositoryController.getAll);
router.get("/:id", repositoryController.getById);
router.delete("/:id", repositoryController.delete);

export default router;
