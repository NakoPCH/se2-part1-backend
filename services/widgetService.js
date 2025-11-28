// services/widgetService.js

import { Widget } from "../models/Widget.js";
import { widgets } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Adds a widget to a user's home screen.
 * @param {{userId:string,type:string,config:Object}} payload
 */
export const createWidget = async (payload) => {
  const { userId, type, config } = payload;

  if (isDbConnected()) {
    const widget = await Widget.create({ userId, type, config });
    return widget.toObject();
  }

  const id = generateId("w", widgets);
  const newWidget = {
    id,
    userId,
    type,
    config: config || {}
  };

  widgets.push(newWidget);
  return newWidget;
};
