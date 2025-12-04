// routes/scenarios.js

import express from "express";
import { createScenarioController } from "../controllers/scenarioController.js";
import { basicAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validation.js";

const router = express.Router();

router.post(
  "/scenarios",
  basicAuth,
  requireFields(["name", "steps"]),
  createScenarioController
);

export default router;
