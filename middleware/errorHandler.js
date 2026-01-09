// middleware/errorHandler.js

import { sendError } from "../utils/responses.js";

/**
 * Centralized error handler middleware.
 * Differentiates known errors via `statusCode` when present.
 */
// ΔΙΟΡΘΩΣΗ: 
// 1. Το 'req' έγινε '_req' (ή _) γιατί δεν χρησιμοποιείται, αλλά πρέπει να υπάρχει στη θέση 2.
// 2. Το 'next' έγινε '_next' γιατί δεν χρησιμοποιείται, αλλά ΠΡΕΠΕΙ να υπάρχει στη θέση 4 για να λειτουργεί ως Error Handler.
export const errorHandler = (err, _req, res, _next) => {
  console.error("[ERROR]", err);

  const statusCode = err.statusCode || 500;
  const message = err.userMessage || "Internal server error";

  return sendError(res, err, message, statusCode);
};