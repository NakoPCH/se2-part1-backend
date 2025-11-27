// app.js

import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
import cors from "cors";

// Allow requests from frontend
app.use(
  cors({
    origin: "*",   // Επιτρέπουμε όλα τα origins για την εργασία
  })
);

dotenv.config();

const app = express();

// Global middlewares
app.use(helmet());
app.use(express.json());
app.use(logger);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, data: null, error: null, message: "Healthy" });
});

// API routes
app.use("/api", apiRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    error: "Not found",
    message: "The requested resource was not found"
  });
});

// Central error handler
app.use(errorHandler);

export default app;
