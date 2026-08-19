import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// export interface AuthenticatedRequest extends Request {
//   user: {
//     id: string;
//     role: string;
//   };
// } This interface is no longer needed since overridden of Request at the global level: in file /express.d.ts

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cookieToken = req.cookies.access_token;

  if (!cookieToken) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const payload = jwt.verify(cookieToken, env.JWT_SECRET);
    if (typeof payload !== "object" || !payload.sub || !payload.role) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      detials: error,
    });
  }
}
