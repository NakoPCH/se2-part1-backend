// routes/devices.js

import express from "express";
import {
  createDeviceController,
  deleteDeviceController,
  updateDeviceController,
  getDeviceStatusController,
  performDeviceActionController,
  updateSecurityStateController
} from "../controllers/deviceController.js";
import { basicAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validation.js";

const router = express.Router();

// Add device to room
router.post(
  "/rooms/:roomId/devices",
  basicAuth,
  requireFields(["name", "type"]),
  createDeviceController
);

// Remove device
router.delete("/devices/:deviceId", basicAuth, deleteDeviceController);

// Categorize / update device
router.put("/devices/:deviceId", basicAuth, updateDeviceController);

// Get device status
router.get("/devices/:deviceId/status", basicAuth, getDeviceStatusController);

// Control device manually
router.post(
  "/devices/:deviceId/action",
  basicAuth,
  performDeviceActionController
);

// Security system state
router.put(
  "/security/:deviceId/state",
  basicAuth,
  updateSecurityStateController
);

export default router;
