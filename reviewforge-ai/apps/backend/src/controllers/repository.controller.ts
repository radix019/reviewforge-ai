import { Request, Response, NextFunction } from 'express';
import { RepositoryService } from '../services/repository.service';

export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = await this.repositoryService.createRepository({
        name: req.body.name,
        fullName: req.body.fullName,
        url: req.body.url,
        provider: req.body.provider,
        ownerId: req.user!.id,
      });
      res.status(201).json(repository);
    } catch (error) {
      next(error);
    }
  };
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repositories = await this.repositoryService.getRepositories(req.user!.id);
      res.status(200).json(repositories);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = await this.repositoryService.getRepository(req.params.id as string, req.user!.id);
      res.json(repository);
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repositoryService.deleteRepository(req.params.id as string, req.user!.id);
      res.status(204).send(`Repository with ID: ${req.params.id} is DELETED!`);
    } catch (error) {
      next(error);
    }
  };
  importRepository = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = await this.repositoryService.importRepository(req.user?.id as string, req.body);
      return res.status(201).json({
        repository,
      });
    } catch (error) {
      next(error);
    }
  };
  getFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = typeof req.query.path === 'string' ? req.query.path : '';

      const files = await this.repositoryService.getFiles(req.user?.id as string, req.params?.id as string, path);
      res.status(200).json({ files, path });
    } catch (error) {
      next(error);
    }
  };
  getFileContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = typeof req.query.path === 'string' ? req.query.path : '';
      if (!path) {
        return res.status(400).json({
          message: 'File path is required',
        });
      }

      const file = await this.repositoryService.getFileContent(req.user?.id as string, req.params.id as string, path);
      return res.status(200).json({
        file,
      });
    } catch (error) {}
  };
}
