// controllers/automationController.js

import { createAutomation } from "../services/automationService.js";
import { sendSuccess } from "../utils/responses.js";

/**
 * POST /automations
 */
export const createAutomationController = async (req, res, next) => {
  try {
    const ownerId = req.user?.id || req.body.ownerId;
    const automation = await createAutomation({ ...req.body, ownerId });
    return sendSuccess(res, automation, "Automation rule created", 201);
  } catch (error) {
    return next(error);
  }
};
