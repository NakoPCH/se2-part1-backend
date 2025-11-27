// middleware/logger.js

import morgan from "morgan";

/**
 * HTTP request logger middleware based on morgan.
 */
export const logger = morgan("dev");
