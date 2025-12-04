// routes/index.js

import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import houseRoutes from "./houses.js";
import roomRoutes from "./rooms.js";
import deviceRoutes from "./devices.js";
import automationRoutes from "./automations.js";
import scenarioRoutes from "./scenarios.js";

const router = express.Router();

// Prefix all API routes with /api to keep things tidy.
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/houses", houseRoutes);
router.use("/", roomRoutes); // contains /houses/:houseId/rooms and /rooms/...
router.use("/", deviceRoutes); // contains /rooms/:roomId/devices and /devices/... etc.
router.use("/", automationRoutes);
router.use("/", scenarioRoutes);

export default router;
