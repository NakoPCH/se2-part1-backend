// middleware/errorHandler.js

import { sendError } from "../utils/responses.js";

/**
 * Centralized error handler middleware.
 * Differentiates known errors via `statusCode` when present.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err);

  const statusCode = err.statusCode || 500;
  const message = err.userMessage || "Internal server error";

  return sendError(res, err, message, statusCode);
};
