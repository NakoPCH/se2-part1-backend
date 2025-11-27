// controllers/userController.js

import {
  createUser,
  getUserById,
  getUserStatistics
} from "../services/userService.js";
import { createNotification } from "../services/notificationService.js";
import { createWidget } from "../services/widgetService.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/**
 * POST /users
 */
export const createUserController = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return sendSuccess(res, user, "User created", 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /users/:userId/statistics
 */
export const getUserStatisticsController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    if (!user) {
      return sendError(res, "User not found", "Not found", 404);
    }

    const stats = await getUserStatistics(userId);
    return sendSuccess(res, stats, "Statistics retrieved", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /users/:userId/home
 * For demo purposes, this just acknowledges customization.
 */
export const customizeHomeController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);

    if (!user) {
      return sendError(res, "User not found", "Not found", 404);
    }

    // No real persistence for layout; just echo back payload.
    return sendSuccess(
      res,
      { userId, layout: req.body.layout || {} },
      "Home screen customized",
      200
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /users/:userId/widgets
 */
export const addWidgetController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const widget = await createWidget({ userId, ...req.body });
    return sendSuccess(res, widget, "Widget added", 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /users/:userId/notifications
 */
export const sendNotificationController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notification = await createNotification({ userId, ...req.body });
    return sendSuccess(res, notification, "Notification sent", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /users/me (non-Swagger helper route)
 */
export const getCurrentUserController = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, "No authenticated user", "Unauthorized", 401);
    }
    return sendSuccess(res, req.user, "Current user", 200);
  } catch (error) {
    return next(error);
  }
};
