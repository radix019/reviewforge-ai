import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
const morgan = require("morgan");

import authRoutes from "./routes/auth.routes";
import repositoryRoutes from "./routes/repository.routes";
import githubRoutes from "./routes/github.routes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/github", githubRoutes);

app.get("/health", (_, res) => {
  res.json({
    status: "OK",
  });
});
app.get("/api/protected", authMiddleware, (_, res) => {
  res.json({
    message: "You are authenticated!",
  });
});

app.use(errorHandler);

export default app;
