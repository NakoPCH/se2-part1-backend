// controllers/authController.js

import { authenticateUser } from "../services/userService.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/**
 * POST /auth/login
 * Basic login endpoint that validates username and password.
 */
export const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await authenticateUser(username, password);
    if (!user) {
      return sendError(res, "Invalid credentials", "Unauthorized", 401);
    }

    const base64 = Buffer.from(`${username}:${password}`).toString("base64");
    const authHeader = `Basic ${base64}`;

    return sendSuccess(
      res,
      { user, authHeader },
      "Login successful",
      200
    );
  } catch (error) {
    return next(error);
  }
};
