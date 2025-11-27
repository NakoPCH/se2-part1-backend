// routes/users.js

import express from "express";
import {
  createUserController,
  getUserStatisticsController,
  customizeHomeController,
  addWidgetController,
  sendNotificationController,
  getCurrentUserController
} from "../controllers/userController.js";
import { basicAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validation.js";

const router = express.Router();

// Create account
router.post(
  "/",
  requireFields(["username", "password", "email"]),
  createUserController
);

// Get current user (helper)
router.get("/me", basicAuth, getCurrentUserController);

// View statistics
router.get("/:userId/statistics", basicAuth, getUserStatisticsController);

// Customize home screen
router.put("/:userId/home", basicAuth, customizeHomeController);

// Add widgets
router.post(
  "/:userId/widgets",
  basicAuth,
  requireFields(["type"]),
  addWidgetController
);

// Send notifications
router.post(
  "/:userId/notifications",
  basicAuth,
  requireFields(["title", "message"]),
  sendNotificationController
);

export default router;
