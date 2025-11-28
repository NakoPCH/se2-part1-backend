// routes/houses.js

import express from "express";
import {
  createHouseController,
  deleteHouseController
} from "../controllers/houseController.js";
import { basicAuth } from "../middleware/auth.js";
import { requireFields } from "../middleware/validation.js";

const router = express.Router();

router.post(
  "/",
  basicAuth,
  requireFields(["name", "address"]),
  createHouseController
);

router.delete("/:houseId", basicAuth, deleteHouseController);

export default router;
