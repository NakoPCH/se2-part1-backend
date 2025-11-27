// models/Automation.js

import mongoose from "mongoose";

const automationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    rules: [
      {
        deviceId: { type: String, required: true },
        trigger: { type: String, required: true },
        action: { type: Object, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const Automation =
  mongoose.models.Automation ||
  mongoose.model("Automation", automationSchema);
