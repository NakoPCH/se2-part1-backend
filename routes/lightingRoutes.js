import express from "express";
import { 
  addDevice, 
  listDevices, 
  updateDevice, 
  deleteDevice, 
  getRooms      
} from "../controllers/lightingController.js";

const router = express.Router();

router.get("/rooms", getRooms);           // Get valid rooms
router.post("/devices", addDevice);       // Add device
router.get("/devices", listDevices);      // List devices
router.put("/devices/:id", updateDevice); // Update device
router.delete("/devices/:id", deleteDevice); // Delete device

export default router;