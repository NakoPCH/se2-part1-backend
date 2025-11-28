// routes/automations.js

import express from "express";
import { createAutomationController } from "../controllers/automationController.js";
import { basicAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validation.js";

const router = express.Router();

router.post(
  "/automations",
  basicAuth,
  requireFields(["name", "rules"]),
  createAutomationController
);

export default router;
