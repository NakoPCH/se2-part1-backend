// services/notificationService.js

import { Notification } from "../models/Notification.js";
import { notifications } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Sends (stores) a notification to a user.
 * @param {{userId:string,title:string,message:string}} payload
 */
export const createNotification = async (payload) => {
  const { userId, title, message } = payload;

  if (isDbConnected()) {
    const notification = await Notification.create({ userId, title, message });
    return notification.toObject();
  }

  const id = generateId("n", notifications);
  const newNotification = {
    id,
    userId,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };

  notifications.push(newNotification);
  return newNotification;
};
