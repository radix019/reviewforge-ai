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
const API = "/api";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/repositories`, repositoryRoutes);
app.use(`${API}/github`, githubRoutes);

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
