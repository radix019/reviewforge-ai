import express from "express";
import cors from "cors";
import helmet from "helmet";
const morgan = require("morgan");

import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);

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
