// controllers/scenarioController.js

import { createScenario } from "../services/scenarioService.js";
import { sendSuccess } from "../utils/responses.js";

/**
 * POST /scenarios
 */
export const createScenarioController = async (req, res, next) => {
  try {
    const ownerId = req.user?.id || req.body.ownerId;
    const scenario = await createScenario({ ...req.body, ownerId });
    return sendSuccess(res, scenario, "Scenario created", 201);
  } catch (error) {
    return next(error);
  }
};
