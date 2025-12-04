import express from "express";
import { addDevice, listDevices } from "../controllers/lightingController.js";

const router = express.Router();

router.post("/devices", addDevice);
router.get("/devices", listDevices);

export default router;