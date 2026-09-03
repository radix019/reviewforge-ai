import { Request, Response, NextFunction } from "express";
import { RepositoryService } from "../services/repository.service";

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
      const repositories = await this.repositoryService.getRepositories(
        req.user!.id,
      );
      res.status(200).json(repositories);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = await this.repositoryService.getRepository(
        req.params.id as string,
        req.user!.id,
      );
      res.json(repository);
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repositoryService.deleteRepository(
        req.params.id as string,
        req.user!.id,
      );
      res.status(204).send(`Repository with ID: ${req.params.id} is DELETED!`);
    } catch (error) {
      next(error);
    }
  };
  importRepository = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    console.log("GOING");
    try {
      const repository = await this.repositoryService.importRepository(
        req.user?.id as string,
        req.body,
      );
      console.log("repository", repository);
      return res.status(201).json({
        repository,
      });
    } catch (error) {
      next(error);
    }
  };
}
