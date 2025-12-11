import express from "express";
import { 
  getAutomations, 
  createAutomation, 
  deleteAutomation, 
  updateAutomation 
} from "../controllers/automationController.js";

const router = express.Router();

router.get("/automations", getAutomations);
router.post("/automations", createAutomation);
router.delete("/automations/:id", deleteAutomation);
router.put("/automations/:id", updateAutomation); 

export default router;