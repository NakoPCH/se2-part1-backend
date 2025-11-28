// models/Widget.js

import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    config: { type: Object, default: {} }
  },
  { timestamps: true }
);

export const Widget =
  mongoose.models.Widget || mongoose.model("Widget", widgetSchema);
