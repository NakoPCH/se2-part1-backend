// middleware/auth.js

import { users } from "../data.js";
import { sendError } from "../utils/responses.js";

/**
 * Basic Authentication middleware.
 * Expects Authorization: Basic base64(username:password)
 */
export const basicAuth = (req, res, next) => {
  try {
    const header = req.headers["authorization"] || "";

    if (!header.startsWith("Basic ")) {
      return sendError(res, "Missing Authorization header", "Unauthorized", 401);
    }

    const base64Credentials = header.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [username, password] = credentials.split(":");

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return sendError(res, "Invalid credentials", "Unauthorized", 401);
    }

    req.user = user; // attach user object to request
    return next();
  } catch (error) {
    return sendError(res, error, "Unauthorized", 401);
  }
};
