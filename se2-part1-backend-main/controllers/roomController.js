// controllers/roomController.js

import { createRoom, deleteRoom } from "../services/roomService.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/**
 * POST /houses/:houseId/rooms
 */
export const createRoomController = async (req, res, next) => {
  try {
    const { houseId } = req.params;
    const room = await createRoom({ ...req.body, houseId });
    return sendSuccess(res, room, "Room added", 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /rooms/:roomId
 */
export const deleteRoomController = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const deleted = await deleteRoom(roomId);
    if (!deleted) {
      return sendError(res, "Room not found", "Not found", 404);
    }
    return sendSuccess(res, { id: roomId }, "Room removed", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /rooms/:roomId/temperature
 */
export const setRoomTemperatureController = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { temperature, unit } = req.body;

    // For demo, just echo back desired state.
    return sendSuccess(
      res,
      { roomId, temperature, unit: unit || "C" },
      "Temperature set",
      200
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /rooms/:roomId/lighting
 */
export const setRoomLightingController = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { brightness, on } = req.body;

    return sendSuccess(
      res,
      { roomId, brightness, on },
      "Lighting set",
      200
    );
  } catch (error) {
    return next(error);
  }
};
