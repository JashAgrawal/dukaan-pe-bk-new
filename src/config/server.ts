import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "../middlewares/errorHandler";
import { morganStream } from "../utils/logger";

/**
 * Configure Express application
 */
export const configureServer = (): Application => {
  const app: Application = express();

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors());

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging middleware
  app.use(morgan("combined", { stream: morganStream }));

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default configureServer;
