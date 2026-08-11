import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  // constructor(private readonly authService = new AuthService()){}
  // // this is tradition design pattern, that violates Dependency Inversion Principle;  controller is creating its dependency, which should not be it's task.

  constructor(private readonly authService: AuthService) {} // Inverted Design (with DIP)

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(
        req.body.name,
        req.body.email,
        req.body.password,
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(
        req.body.email,
        req.body.password,
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
