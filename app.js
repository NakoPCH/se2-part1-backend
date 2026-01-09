import cors from 'cors';
import express from "express";
import bodyParser from "body-parser";
import lightingRoutes from "./routes/lightingRoutes.js";
import automationRoutes from "./routes/automations.js";
import helmet from "helmet";
import dotenv from "dotenv";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());

// Global middlewares
app.use(helmet());
app.use(express.json());
app.use(logger);
app.use(bodyParser.json());

app.use("/api/lighting", lightingRoutes);
app.use("/api", automationRoutes);

// Health check
// ΔΙΟΡΘΩΣΗ: Αλλάξαμε το (req, res) σε (_, res) γιατί το req δεν χρησιμοποιείται
app.get("/health", (_, res) => {
  res.status(200).json({ success: true, data: null, error: null, message: "Healthy" });
});

// API routes
app.use("/api", apiRoutes);

// 404 handler for unknown routes
// ΔΙΟΡΘΩΣΗ: 
// 1. Αλλάξαμε το req σε _ (γιατί δεν χρησιμοποιείται)
// 2. Σβήσαμε τελείως το 'next' από το τέλος (γιατί δεν χρησιμοποιείται)
app.use((_, res) => {
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