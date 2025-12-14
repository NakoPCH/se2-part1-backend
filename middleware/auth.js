// middleware/auth.js
import { users } from "../data.js";
import { User } from "../models/User.js"; // Import το μοντέλο
import { sendError } from "../utils/responses.js";
import { isDbConnected } from "../utils/helpers.js"; // Import τον έλεγχο βάσης
import bcrypt from "bcrypt";

/**
 * Basic Authentication middleware.
 * Expects Authorization: Basic base64(username:password)
 */
export const basicAuth = async (req, res, next) => {
  try {
    const header = req.headers["authorization"] || "";

    if (!header.startsWith("Basic ")) {
      return sendError(res, "Missing Authorization header", "Unauthorized", 401);
    }

    const base64Credentials = header.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [username, password] = credentials.split(":");

    let user;

    // --- ΑΛΛΑΓΗ: Έλεγχος αν υπάρχει σύνδεση στη Βάση ---
    if (isDbConnected()) {
      // Ψάχνουμε στη βάση
      const dbUser = await User.findOne({ username });
      if (dbUser) {
        // Ελέγχουμε τον κωδικό με bcrypt
        const match = await bcrypt.compare(password, dbUser.password);
        if (match) {
          user = dbUser.toObject();
          // Προσθέτουμε το id ως string για συμβατότητα
          user.id = user._id.toString(); 
        }
      }
    } else {
      // Fallback στο αρχείο (παλιά λειτουργία)
      user = users.find(
        (u) => u.username === username && u.password === password
      );
    }

    if (!user) {
      return sendError(res, "Invalid credentials", "Unauthorized", 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return sendError(res, error.message || "Error", "Unauthorized", 401);
  }
};