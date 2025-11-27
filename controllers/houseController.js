// controllers/houseController.js

import { createHouse, deleteHouse } from "../services/houseService.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/**
 * POST /houses
 */
export const createHouseController = async (req, res, next) => {
  try {
    const ownerId = req.user?.id || req.body.ownerId;
    const house = await createHouse({ ...req.body, ownerId });
    return sendSuccess(res, house, "House added", 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /houses/:houseId
 */
export const deleteHouseController = async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const deleted = await deleteHouse(houseId);
    if (!deleted) {
      return sendError(res, "House not found", "Not found", 404);
    }
    return sendSuccess(res, { id: houseId }, "House removed", 200);
  } catch (error) {
    return next(error);
  }
};
