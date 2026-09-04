import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { RepositoryController } from '../controllers/repository.controller';
import { RepositoryService } from '../services/repository.service';
import { PrismaRepositoryStore } from '../repositories/prisma-repository.store';
import { GitHubService } from '../services/github.service';
import { PrismaGitHubConnectionStore } from '../repositories/prisma-github-connection.store';

const router = Router();
const repositoryStore = new PrismaRepositoryStore();
const githubConnectionStore = new PrismaGitHubConnectionStore();
const githubservice = new GitHubService(githubConnectionStore);
const repositoryService = new RepositoryService(repositoryStore, githubservice);
const repositoryController = new RepositoryController(repositoryService);

router.use(authMiddleware);

router.post('/', repositoryController.create);
router.get('/', repositoryController.getAll);
router.get('/:id', repositoryController.getById);
router.delete('/:id', repositoryController.delete);
router.get('/:id/files', repositoryController.getFiles);
router.get('/:id/file', repositoryController.getFileContent);

export default router;
