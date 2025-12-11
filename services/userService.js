import fs from 'fs';
import path from 'path';
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import {
  users,
  houses,
  rooms,
  devices,
  automations,
  scenarios,
  widgets,
  notifications
} from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

// Path to your data.js file (assumes running from project root)
const DATA_FILE_PATH = path.join(process.cwd(), 'data.js');

/**
 * Creates a new user in DB or mock data.
 * @param {{username:string,password:string,email:string}} payload
 */
export const createUser = async (payload) => {
  const { username, password, email } = payload;

  // --- DB PATH ---
  if (isDbConnected()) {
    const existing = await User.findOne({ username });
    if (existing) {
      const err = new Error("Username already exists");
      err.statusCode = 409;
      err.userMessage = "Username already exists";
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, email });
    return user.toObject();
  }

  // --- MOCK DATA PATH ---
  const existing = users.find((u) => u.username === username);
  if (existing) {
    const err = new Error("Username already exists");
    err.statusCode = 409;
    err.userMessage = "Username already exists";
    throw err;
  }

  const id = generateId("u", users);
  const newUser = { id, username, password, email };
  
  // 1. Update in-memory array
  users.push(newUser);

  // 2. Persist to data.js file
  try {
    const fileContent = `
// In-memory mock data store used when no MongoDB connection is configured.

export const users = ${JSON.stringify(users, null, 2)};
export const houses = ${JSON.stringify(houses, null, 2)};
export const rooms = ${JSON.stringify(rooms, null, 2)};
export const devices = ${JSON.stringify(devices, null, 2)};
export const automations = ${JSON.stringify(automations, null, 2)};
export const scenarios = ${JSON.stringify(scenarios, null, 2)};
export const widgets = ${JSON.stringify(widgets, null, 2)};
export const notifications = ${JSON.stringify(notifications, null, 2)};
`;
    fs.writeFileSync(DATA_FILE_PATH, fileContent.trim(), 'utf8');
  } catch (error) {
    console.error("Error writing to data.js:", error);
  }

  return newUser;
};

/**
 * Validates user credentials and returns user object.
 * @param {string} username
 * @param {string} password
 */
export const authenticateUser = async (username, password) => {
  if (isDbConnected()) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? user.toObject() : null;
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};

/**
 * Returns a user by ID from mock data (or DB if needed).
 * @param {string} userId
 */
export const getUserById = async (userId) => {
  if (isDbConnected()) {
    const user = await User.findById(userId).lean();
    return user || null;
  }

  return users.find((u) => u.id === userId) || null;
};

/**
 * Computes simple statistics for the given user.
 * @param {string} userId
 */
export const getUserStatistics = async (userId) => {
  const userHouses = houses.filter((h) => h.ownerId === userId);
  const userHouseIds = userHouses.map((h) => h.id);

  const userRooms = rooms.filter((r) => userHouseIds.includes(r.houseId));
  const userRoomIds = userRooms.map((r) => r.id);

  const userDevices = devices.filter((d) => userRoomIds.includes(d.roomId));

  const userAutomations = automations.filter((a) => a.ownerId === userId);
  const userScenarios = scenarios.filter((s) => s.ownerId === userId);
  const userWidgets = widgets.filter((w) => w.userId === userId);
  const userNotifications = notifications.filter((n) => n.userId === userId);

  return {
    houses: userHouses.length,
    rooms: userRooms.length,
    devices: userDevices.length,
    automations: userAutomations.length,
    scenarios: userScenarios.length,
    widgets: userWidgets.length,
    notifications: userNotifications.length
  };
};