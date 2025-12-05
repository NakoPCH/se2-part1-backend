// server.js

import dotenv from "dotenv";
import app from "./app.js"; // <<< Το αντικείμενο της Express εφαρμογής
import { connectDatabase } from "./config/database.js";

dotenv.config();

// 1. Ορίζουμε μια σταθερά για να ελέγχουμε τη λειτουργία του server
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    // 2. Η εφαρμογή συνδέεται στη βάση δεδομένων (την πραγματική)
    await connectDatabase();

    // 3. Η εφαρμογή αρχίζει να ακούει σε μια θύρα
    app.listen(PORT, () => {
      console.log(`Smart Home API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// 4. Ελέγχουμε: Τρέξε τον server ΜΟΝΟ αν δεν είμαστε σε test mode
if (NODE_ENV !== 'test') {
  startServer();
}

// Προαιρετικό, αλλά βελτιώνει την κατανόηση του τι συμβαίνει στο app.js
// export default app; // Δεν το χρειαζόμαστε εδώ, εφόσον το app.js κάνει ήδη export το app
