// routes/rooms.js

import express from "express";
import {
  createRoomController,
  deleteRoomController,
  setRoomTemperatureController,
  setRoomLightingController
} from "../controllers/roomController.js";
import { basicAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validation.js";

const router = express.Router();

// Add room to a house
router.post(
  "/houses/:houseId/rooms",
  basicAuth,
  requireFields(["name"]),
  createRoomController
);

// Remove room
router.delete("/rooms/:roomId", basicAuth, deleteRoomController);

// Set temperature
router.put(
  "/rooms/:roomId/temperature",
  basicAuth,
  requireFields(["temperature"]),
  setRoomTemperatureController
);

// Set lighting
router.put(
  "/rooms/:roomId/lighting",
  basicAuth,
  requireFields([]),
  setRoomLightingController
);

export default router;
