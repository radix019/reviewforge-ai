import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { User } from "@prisma/client";

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
      res.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  };
  logout = async (_: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      return res.status(200).json({
        message: "Logged out successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.getCurrentUser(
        req.user?.id as string,
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
