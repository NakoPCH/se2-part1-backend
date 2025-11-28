// models/Scenario.js

import mongoose from "mongoose";

const scenarioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    steps: [
      {
        deviceId: { type: String, required: true },
        action: { type: Object, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const Scenario =
  mongoose.models.Scenario || mongoose.model("Scenario", scenarioSchema);
