import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(
      req.body.name,
      req.body.email,
      req.body.password,
    );
    res.status(200).json(result);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json(result);
  }
}
