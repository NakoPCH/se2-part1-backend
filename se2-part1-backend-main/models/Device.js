// models/Device.js

import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roomId: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String },
    status: { type: String, default: "online" },
    state: { type: Object, default: {} }
  },
  { timestamps: true }
);

export const Device =
  mongoose.models.Device || mongoose.model("Device", deviceSchema);
