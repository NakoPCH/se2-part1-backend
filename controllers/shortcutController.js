import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "shortcuts.json");

// Helper: Read shortcuts
const getShortcutsFromFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// GET /api/shortcuts
export const getShortcuts = (req, res) => {
  const shortcuts = getShortcutsFromFile();
  res.json(shortcuts);
};

// POST /api/shortcuts (Save the entire list of IDs)
export const saveShortcuts = (req, res) => {
  const newShortcuts = req.body; // Expecting array: [{ id: "123", type: "device" }, ...]
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(newShortcuts, null, 2));
    res.json({ success: true, shortcuts: newShortcuts });
  } catch (error) {
    res.status(500).json({ error: "Failed to save shortcuts" });
  }
};